import type { SvelteComponent } from "svelte";
export type LocalSvelteProps = {
  children?: any;
  class?: string;
  [key: string]: any;
};

/**
 * Local svelte class for adding typescript definitions for svelte components
 *
 */
export declare class LocalSvelteComponent<Props = {}> {
  constructor(props: Props & LocalSvelteProps);
  $$prop_def: Props & LocalSvelteProps;
  render: undefined;
  context: undefined;
  setState: undefined;
  forceUpdate: undefined;
  props: undefined;
  state: undefined;
  refs: undefined;
}
export interface IComponentProps {
  somthing?: string;
}

export declare class Component extends LocalSvelteComponent<IComponentProps> {}

