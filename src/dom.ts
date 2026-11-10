// DOM 小工具
export const $ = <T extends Element = HTMLElement>(id: string): T => document.getElementById(id) as unknown as T;
// 事件委派：往上找符合 selector 的元素
export const closest = <T extends HTMLElement = HTMLElement>(e: Event, sel: string): T | null => (e.target as Element).closest<T>(sel);
