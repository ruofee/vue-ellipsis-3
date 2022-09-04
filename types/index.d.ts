import type { DefineComponent, Plugin } from 'vue';

declare const VueEllipsis3: DefineComponent<
  {
    text: string;
    visibleLine: number;
    visibleHeight: number | string;
    maxLine: number;
    maxHeight: number | string;
    ellipsis: boolean;
    ellipsisNode: string;
    endExcludes: Array<string>;
    useInnerHtml: boolean;
    reflowOnResize: boolean;
    onReflow: (ellipsis: boolean, text: string) => void;
    onEllipsisClick: () => void;
  },
  {},
  any
>;
export { VueEllipsis3 };

declare const _default: Plugin;
export default _default;
