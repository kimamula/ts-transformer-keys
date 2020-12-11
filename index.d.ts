interface IDictionary<T> {[key: string]: T;}
export function keys<T extends object>(): Array<keyof T>;
export function classMembers<T extends object>(): IDictionary<string>;
