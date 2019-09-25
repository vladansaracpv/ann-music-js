/** Boolean methods */

/** Ternary operator. Returns f or g, based on condition */
export const either = (f: any, g: any, condition: boolean): any => (condition ? f : g);

/** Returns true if none of the conditions are true */
export const none2 = (a: boolean, b: boolean): boolean => !a && !b;
export const none = (...args: boolean[]): boolean => args.reduce(none2);

/** Returns true if all conditions are true */
export const both = (a: boolean, b: boolean): boolean => a && b;
export const allTrue = (...args: boolean[]): boolean => args.reduce(both);

const or = (a: boolean, b: boolean): boolean => a || b;
export const someTrue = (...args: boolean[]): boolean => args.reduce(or);
