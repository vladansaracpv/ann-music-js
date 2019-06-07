export type Comparable = number | string;

/** Relational binary operators  */

// lt := (a,b) => a < b
export const lt = (a: Comparable, b: Comparable): boolean => a < b;

// ltc := b => a => a < b
export const ltc = (b: Comparable) => (a: Comparable): boolean => a < b;

// leq := (a,b) => a <= b
export const leq = (a: Comparable, b: Comparable): boolean => a <= b;

// leqc := b => a => a <= b
export const leqc = (b: Comparable) => (a: Comparable): boolean => a <= b;

// eq := (a,b) => a === b
export const eq = (a: Comparable, b: Comparable): boolean => a === b;

// eqc := b => a => a === b
export const eqc = (b: Comparable) => (a: Comparable): boolean => a === b;

// neq := (a,b) => a !== b
export const neq = (a: Comparable, b: Comparable): boolean => a !== b;

// neqc := b => a => a != b
export const neqc = (b: Comparable) => (a: Comparable): boolean => a !== b;

// gt := (a,b) => a > b
export const gt = (a: Comparable, b: Comparable): boolean => a > b;

// gtc := b => a => a > b
export const gtc = (b: Comparable) => (a: Comparable): boolean => a > b;

// geq := (a,b) => a >= b
export const geq = (a: Comparable, b: Comparable): boolean => a >= b;

// geqc := b => a => a >= b
export const geqc = (b: Comparable) => (a: Comparable): boolean => a >= b;

// interval := (a,b,n) => a < n < b
export const interval = (lower: number, higher: number, num: number): boolean => lt(lower, num) && lt(num, higher);

// intervalc := (a,b) => x => a < x < b
export const intervalc = (a: Comparable, b: Comparable) => (x: Comparable): boolean => ltc(x)(a) && ltc(b)(x);

// segment := (a,b,n) => a <= n <= b
export const segment = (lower: number, higher: number, num: number): boolean => leq(lower, num) && leq(num, higher);

// segmentc := (a,b) => x => a <= x <= b
export const segmentc = (a: Comparable, b: Comparable) => (x: Comparable): boolean => leqc(x)(a) && leqc(b)(x);

export const isNegative = (a: number): boolean => lt(a, 0);
export const isPositive = (a: number): boolean => gt(a, 0);
export const isNonNegative = (a: number): boolean => geq(a, 0);
