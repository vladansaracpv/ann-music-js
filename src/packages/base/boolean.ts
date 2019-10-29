/** Boolean methods */

/** Ternary operator. Returns f or g, based on condition */
export const either = (f: any, g: any, condition: boolean): any => (condition ? f : g);

/** Returns true if none of the conditions are true */
export const none = (a: boolean, b: boolean): boolean => !a && !b;
export const allFalse = (args: boolean[]): boolean => args.reduce(none);

/** Returns true if all conditions are true */
export const both = (a: boolean, b: boolean): boolean => a && b;
export const allTrue = (args: boolean[]): boolean => args.reduce(both);

export const some = (a: boolean, b: boolean): boolean => a || b;
export const someTrue = (args: boolean[]): boolean => args.reduce(some);
