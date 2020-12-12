export function keys<T extends object>(): Array<keyof T>;
export function typeMembers<T extends object>(): { [key in keyof T]: string; };
