/** Boolean methods */

/** Ternary operator. Returns one of expressions: f | g, based on conditional: cond */
export const either = (f: any, g: any, cond: boolean): any => (cond ? f : g);
