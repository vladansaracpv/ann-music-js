/** Logical operators (binary, N-ary) */

/** Logical AND  */
export const and2 = (a: boolean, b: boolean): boolean => a && b;
export const andN = (...args: boolean[]): boolean => args.reduce(and2);

/** Logical OR */
export const or2 = (a: boolean, b: boolean): boolean => a || b;
export const orN = (...args: boolean[]): boolean => args.reduce(or2);
