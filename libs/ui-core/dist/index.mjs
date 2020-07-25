function noop() { }
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
        const lets = definition[2](fn(dirty));
        if ($$scope.dirty === undefined) {
            return lets;
        }
        if (typeof lets === 'object') {
            const merged = [];
            const len = Math.max($$scope.dirty.length, lets.length);
            for (let i = 0; i < len; i += 1) {
                merged[i] = $$scope.dirty[i] | lets[i];
            }
            return merged;
        }
        return $$scope.dirty | lets;
    }
    return $$scope.dirty;
}
function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
    const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
    if (slot_changes) {
        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
        slot.p(slot_context, slot_changes);
    }
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data)
        text.data = data;
}
function set_style(node, key, value, important) {
    node.style.setProperty(key, value, important ? 'important' : '');
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
        callbacks.slice().forEach(fn => fn(event));
    }
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
let outros;
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const prop_values = options.props || {};
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, prop_values, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if ($$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set() {
        // overridden by instance, if it has props
    }
}

/* src/Component.svelte generated by Svelte v3.24.0 */

function create_fragment(ctx) {
	let h1;

	return {
		c() {
			h1 = element("h1");
			h1.textContent = "This is part of the @scx/ui-core";
		},
		m(target, anchor) {
			insert(target, h1, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(h1);
		}
	};
}

class Component extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, null, create_fragment, safe_not_equal, {});
	}
}

/* src/Navbar.svelte generated by Svelte v3.24.0 */

function add_css() {
	var style = element("style");
	style.id = "svelte-14k4171-style";
	style.textContent = "nav.svelte-14k4171{width:100%;font-size:2rem;padding:var(--padding);background-color:#333;color:#fff;text-align:center}";
	append(document.head, style);
}

function create_fragment$1(ctx) {
	let nav;
	let t;

	return {
		c() {
			nav = element("nav");
			t = text(/*title*/ ctx[0]);
			set_style(nav, "--padding", paddingInRem + "rem");
			attr(nav, "class", "svelte-14k4171");
		},
		m(target, anchor) {
			insert(target, nav, anchor);
			append(nav, t);
		},
		p(ctx, [dirty]) {
			if (dirty & /*title*/ 1) set_data(t, /*title*/ ctx[0]);
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(nav);
		}
	};
}

let paddingInRem = 1;

function instance($$self, $$props, $$invalidate) {
	let { title = "Default Title" } = $$props;

	$$self.$set = $$props => {
		if ("title" in $$props) $$invalidate(0, title = $$props.title);
	};

	return [title];
}

class Navbar extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-14k4171-style")) add_css();
		init(this, options, instance, create_fragment$1, safe_not_equal, { title: 0 });
	}
}

/* src/Card.svelte generated by Svelte v3.24.0 */

function add_css$1() {
	var style = element("style");
	style.id = "svelte-13c2d6f-style";
	style.textContent = "section.svelte-13c2d6f{width:600px;height:370px;padding:2rem 2rem;margin:2rem auto 0 auto;border-radius:10px;position:relative;color:white;box-shadow:0 1px 3px hsla(0, 0%, 0%, 0.12), 0 1px 2px hsla(0, 0%, 0%, 0.24);background-size:cover}";
	append(document.head, style);
}

function create_fragment$2(ctx) {
	let section;
	let current;
	const default_slot_template = /*$$slots*/ ctx[1].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

	return {
		c() {
			section = element("section");
			if (default_slot) default_slot.c();
			attr(section, "class", "svelte-13c2d6f");
		},
		m(target, anchor) {
			insert(target, section, anchor);

			if (default_slot) {
				default_slot.m(section, null);
			}

			current = true;
		},
		p(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && dirty & /*$$scope*/ 1) {
					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
				}
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(section);
			if (default_slot) default_slot.d(detaching);
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$props => {
		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
	};

	return [$$scope, $$slots];
}

class Card extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-13c2d6f-style")) add_css$1();
		init(this, options, instance$1, create_fragment$2, safe_not_equal, {});
	}
}

/* src/TextInput.svelte generated by Svelte v3.24.0 */

function create_fragment$3(ctx) {
	let label_1;
	let div;
	let t0;
	let t1;
	let input;
	let mounted;
	let dispose;

	return {
		c() {
			label_1 = element("label");
			div = element("div");
			t0 = text(/*label*/ ctx[1]);
			t1 = space();
			input = element("input");
			attr(div, "class", "labelText");
			attr(input, "type", /*type*/ ctx[3]);
			attr(input, "placeholder", /*placeholder*/ ctx[2]);
			input.value = /*value*/ ctx[0];
		},
		m(target, anchor) {
			insert(target, label_1, anchor);
			append(label_1, div);
			append(div, t0);
			append(label_1, t1);
			append(label_1, input);

			if (!mounted) {
				dispose = [
					listen(input, "keydown", /*keydown_handler*/ ctx[4]),
					listen(input, "change", /*change_handler*/ ctx[5]),
					listen(input, "input", /*input_handler*/ ctx[6]),
					listen(input, "focus", /*focus_handler*/ ctx[7]),
					listen(input, "blur", /*blur_handler*/ ctx[8]),
					listen(input, "input", /*input_handler_1*/ ctx[9])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*label*/ 2) set_data(t0, /*label*/ ctx[1]);

			if (dirty & /*type*/ 8) {
				attr(input, "type", /*type*/ ctx[3]);
			}

			if (dirty & /*placeholder*/ 4) {
				attr(input, "placeholder", /*placeholder*/ ctx[2]);
			}

			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
				input.value = /*value*/ ctx[0];
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(label_1);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$2($$self, $$props, $$invalidate) {
	let { label } = $$props;
	let { placeholder } = $$props;
	let { type } = $$props;
	let { value = "" } = $$props;

	function keydown_handler(event) {
		bubble($$self, event);
	}

	function change_handler(event) {
		bubble($$self, event);
	}

	function input_handler(event) {
		bubble($$self, event);
	}

	function focus_handler(event) {
		bubble($$self, event);
	}

	function blur_handler(event) {
		bubble($$self, event);
	}

	const input_handler_1 = ({ target }) => {
		$$invalidate(0, value = target.value);
	};

	$$self.$set = $$props => {
		if ("label" in $$props) $$invalidate(1, label = $$props.label);
		if ("placeholder" in $$props) $$invalidate(2, placeholder = $$props.placeholder);
		if ("type" in $$props) $$invalidate(3, type = $$props.type);
		if ("value" in $$props) $$invalidate(0, value = $$props.value);
	};

	return [
		value,
		label,
		placeholder,
		type,
		keydown_handler,
		change_handler,
		input_handler,
		focus_handler,
		blur_handler,
		input_handler_1
	];
}

class TextInput extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$2, create_fragment$3, safe_not_equal, {
			label: 1,
			placeholder: 2,
			type: 3,
			value: 0
		});
	}
}

/* src/FlexLayout.svelte generated by Svelte v3.24.0 */

function add_css$2() {
	var style = element("style");
	style.id = "svelte-ghvm8b-style";
	style.textContent = "div.svelte-ghvm8b{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:left}.space-between.svelte-ghvm8b{justify-content:space-between}.start.svelte-ghvm8b{align-items:flex-start}.center.svelte-ghvm8b{align-items:center}.end.svelte-ghvm8b{align-items:flex-end}.column.svelte-ghvm8b{flex-direction:column}";
	append(document.head, style);
}

function create_fragment$4(ctx) {
	let div;
	let current;
	const default_slot_template = /*$$slots*/ ctx[4].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

	return {
		c() {
			div = element("div");
			if (default_slot) default_slot.c();
			attr(div, "class", "svelte-ghvm8b");
			toggle_class(div, "column", /*direction*/ ctx[2] === "column");
			toggle_class(div, "space-between", /*justify*/ ctx[0] === "space-between");
			toggle_class(div, "start", /*align*/ ctx[1] === "start");
			toggle_class(div, "center", /*align*/ ctx[1] === "center");
			toggle_class(div, "end", /*align*/ ctx[1] === "end");
		},
		m(target, anchor) {
			insert(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
		},
		p(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && dirty & /*$$scope*/ 8) {
					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
				}
			}

			if (dirty & /*direction*/ 4) {
				toggle_class(div, "column", /*direction*/ ctx[2] === "column");
			}

			if (dirty & /*justify*/ 1) {
				toggle_class(div, "space-between", /*justify*/ ctx[0] === "space-between");
			}

			if (dirty & /*align*/ 2) {
				toggle_class(div, "start", /*align*/ ctx[1] === "start");
			}

			if (dirty & /*align*/ 2) {
				toggle_class(div, "center", /*align*/ ctx[1] === "center");
			}

			if (dirty & /*align*/ 2) {
				toggle_class(div, "end", /*align*/ ctx[1] === "end");
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			if (default_slot) default_slot.d(detaching);
		}
	};
}

function instance$3($$self, $$props, $$invalidate) {
	let { justify = "left" } = $$props;
	let { align = "baseline" } = $$props;
	let { direction = "row" } = $$props;
	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$props => {
		if ("justify" in $$props) $$invalidate(0, justify = $$props.justify);
		if ("align" in $$props) $$invalidate(1, align = $$props.align);
		if ("direction" in $$props) $$invalidate(2, direction = $$props.direction);
		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
	};

	return [justify, align, direction, $$scope, $$slots];
}

class FlexLayout extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-ghvm8b-style")) add_css$2();
		init(this, options, instance$3, create_fragment$4, safe_not_equal, { justify: 0, align: 1, direction: 2 });
	}
}

/* src/Logo.svelte generated by Svelte v3.24.0 */

function add_css$3() {
	var style = element("style");
	style.id = "svelte-c4qnwi-style";
	style.textContent = "picture.svelte-c4qnwi{margin:0.5rem 0.5rem 0.5rem 0;position:relative;top:5px}";
	append(document.head, style);
}

// (15:0) {#if imgSrc && imgSrc.length > 0}
function create_if_block(ctx) {
	let picture;
	let img;
	let img_src_value;

	return {
		c() {
			picture = element("picture");
			img = element("img");
			if (img.src !== (img_src_value = /*imgSrc*/ ctx[0])) attr(img, "src", img_src_value);
			attr(img, "alt", /*imgAlt*/ ctx[1]);
			attr(img, "id", /*id*/ ctx[2]);
			attr(picture, "class", "svelte-c4qnwi");
		},
		m(target, anchor) {
			insert(target, picture, anchor);
			append(picture, img);
		},
		p(ctx, dirty) {
			if (dirty & /*imgSrc*/ 1 && img.src !== (img_src_value = /*imgSrc*/ ctx[0])) {
				attr(img, "src", img_src_value);
			}

			if (dirty & /*imgAlt*/ 2) {
				attr(img, "alt", /*imgAlt*/ ctx[1]);
			}

			if (dirty & /*id*/ 4) {
				attr(img, "id", /*id*/ ctx[2]);
			}
		},
		d(detaching) {
			if (detaching) detach(picture);
		}
	};
}

function create_fragment$5(ctx) {
	let if_block_anchor;
	let if_block = /*imgSrc*/ ctx[0] && /*imgSrc*/ ctx[0].length > 0 && create_if_block(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
		},
		p(ctx, [dirty]) {
			if (/*imgSrc*/ ctx[0] && /*imgSrc*/ ctx[0].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach(if_block_anchor);
		}
	};
}

function instance$4($$self, $$props, $$invalidate) {
	let { imgSrc } = $$props;
	let { imgAlt } = $$props;
	let { id } = $$props;

	$$self.$set = $$props => {
		if ("imgSrc" in $$props) $$invalidate(0, imgSrc = $$props.imgSrc);
		if ("imgAlt" in $$props) $$invalidate(1, imgAlt = $$props.imgAlt);
		if ("id" in $$props) $$invalidate(2, id = $$props.id);
	};

	return [imgSrc, imgAlt, id];
}

class Logo extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-c4qnwi-style")) add_css$3();
		init(this, options, instance$4, create_fragment$5, safe_not_equal, { imgSrc: 0, imgAlt: 1, id: 2 });
	}
}

/* src/QRCode.svelte generated by Svelte v3.24.0 */

function add_css$4() {
	var style = element("style");
	style.id = "svelte-2zn91n-style";
	style.textContent = "picture.svelte-2zn91n{margin-top:5rem}";
	append(document.head, style);
}

function create_fragment$6(ctx) {
	let picture;
	let img;
	let img_src_value;

	return {
		c() {
			picture = element("picture");
			img = element("img");
			if (img.src !== (img_src_value = /*imgSrc*/ ctx[0])) attr(img, "src", img_src_value);
			attr(img, "alt", "qrcode");
			attr(picture, "class", "svelte-2zn91n");
		},
		m(target, anchor) {
			insert(target, picture, anchor);
			append(picture, img);
		},
		p(ctx, [dirty]) {
			if (dirty & /*imgSrc*/ 1 && img.src !== (img_src_value = /*imgSrc*/ ctx[0])) {
				attr(img, "src", img_src_value);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(picture);
		}
	};
}

function instance$5($$self, $$props, $$invalidate) {
	let { values } = $$props;

	$$self.$set = $$props => {
		if ("values" in $$props) $$invalidate(1, values = $$props.values);
	};

	let qrString;
	let imgSrc;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*values*/ 2) {
			 $$invalidate(2, qrString = `BEGIN:VCARD
      VERSION:4.0
      N:${values.name};${values.name};;;
      FN:${values.name}
      ORG:${values.organization}
      TITLE:${values.jobTitle}
      TEL;TYPE=work;VALUE=uri:${values.phone}
      ADR;TYPE=WORK;PREF=1;LABEL="${values.address}":;;${values.address}
      EMAIL;TYPE=WORK:${values.email}
      REV:20080424T195243Z
      x-qq:21588891
      END:VCARD`);
		}

		if ($$self.$$.dirty & /*qrString*/ 4) {
			 $$invalidate(0, imgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURI(qrString)}`);
		}
	};

	return [imgSrc, values];
}

class QRCode extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-2zn91n-style")) add_css$4();
		init(this, options, instance$5, create_fragment$6, safe_not_equal, { values: 1 });
	}
}

export { Card, Component, FlexLayout, Logo, Navbar, QRCode, TextInput };
