
/** Boolean methods */

export const isPositive = (x: number): boolean => geq(0, x);

export const isNumber = (x: any): boolean => typeof x === 'number';



export const isEmpty = (x: string | any[]) => eq(0, x.length);

export const isMemberOf = (X: string | string[], el: any): boolean => andN(!isEmpty(el), geq(0, X.indexOf(el)));

export const isIn = str => n => str.includes(n[1]);

export const isMadeOfChar = (el: string): boolean => fillStr(el[0], el.length) === el;

export const isInside = (a: number, b: number, x: number): boolean => andN(lt(x, a), gt(x, b));

export const isBetween = (a: number, b: number, x: number): boolean => andN(leq(x, a), geq(x, b));

export const isEither = (f, g, c) => { return c ? f : g };

export const either = (f: any, g: any, cond: boolean): any => cond ? f : g;

export const charAtEq = (position: number, eqTo: string, str: string): boolean => str.length >= position && str[position] === eqTo;
