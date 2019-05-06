/** Logical operators */

/** AND */
export const land = (a: boolean, b: boolean): boolean => a && b;

export const andN = (...args: boolean[]): boolean => args.reduce(land);

/** OR */
export const lor = (a: boolean, b: boolean): boolean => a || b;

export const orN = (...args: boolean[]): boolean => args.reduce(lor);
