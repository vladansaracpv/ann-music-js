export type Comparable = number | string;

/** Relational binary operators  */
export const lt = (a: Comparable, b: Comparable): boolean => a < b;

export const leq = (a: Comparable, b: Comparable): boolean => a <= b;

export const eq = (a: Comparable, b: Comparable): boolean => a === b;

export const neq = (a: Comparable, b: Comparable): boolean => a !== b;

export const gt = (a: Comparable, b: Comparable): boolean => a > b;

export const geq = (a: Comparable, b: Comparable): boolean => a >= b;

export const interval = (lower: number, higher: number, num: number): boolean => lt(lower, num) && lt(num, higher);

export const segment = (lower: number, higher: number, num: number): boolean => leq(lower, num) && leq(num, higher);

export const isPositive = (x: number): boolean => geq(0, x);

/** Relational binary operators. Curried version  */
export const ltc = (b: Comparable) => (a: Comparable): boolean => a < b;

export const leqc = (b: Comparable) => (a: Comparable): boolean => a <= b;

export const eqc = (b: Comparable) => (a: Comparable): boolean => a === b;

export const neqc = (b: Comparable) => (a: Comparable): boolean => a !== b;

export const gtc = (b: Comparable) => (a: Comparable): boolean => a > b;

export const geqc = (b: Comparable) => (a: Comparable): boolean => a >= b;

export const intervalc = (a: Comparable, b: Comparable) => (x: Comparable): boolean => ltc(x)(a) && ltc(b)(x);

export const segmentc = (a: Comparable, b: Comparable) => (x: Comparable): boolean => leqc(x)(a) && leqc(b)(x);
