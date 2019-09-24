/** Relational binary operators  */

// lt := (a,b) => a < b
export const lt: ComparableBinFn = (a, b) => a < b;

// leq := (a,b) => a <= b
export const leq: ComparableBinFn = (a, b) => a <= b;

// eq := (a,b) => a === b
export const eq: ComparableBinFn = (a, b) => a === b;

// neq := (a,b) => a !== b
export const neq: ComparableBinFn = (a, b) => a !== b;

// gt := (a,b) => a > b
export const gt: ComparableBinFn = (a, b) => a > b;

// geq := (a,b) => a >= b
export const geq: ComparableBinFn = (a, b) => a >= b;

export const cmp = (a: Comparable, b: Comparable): number => {
  if (eq(a, b)) return 0;
  return lt(a, b) ? -1 : 1;
};

// interval := (a,b,n) => a < n < b
export const inInterval = (lower: number, higher: number, num: number): boolean => lt(lower, num) && lt(num, higher);

// segment := (a,b,n) => a <= n <= b
export const inSegment = (lower: number, higher: number, num: number): boolean => leq(lower, num) && leq(num, higher);

export const isNegative = (a: number): boolean => lt(a, 0);

export const isPositive = (a: number): boolean => gt(a, 0);

export const isNonNegative = (a: number): boolean => geq(a, 0);

/** Relational curried operators  */

// ltc := b => a => a < b
export const ltc: ComparableCurryFn = b => a => a < b;

// leqc := b => a => a <= b
export const leqc: ComparableCurryFn = b => a => a <= b;

// eqc := b => a => a === b
export const eqc: ComparableCurryFn = b => a => a === b;

// neqc := b => a => a != b
export const neqc: ComparableCurryFn = b => a => a !== b;

// gtc := b => a => a > b
export const gtc: ComparableCurryFn = b => a => a > b;

// geqc := b => a => a >= b
export const geqc: ComparableCurryFn = b => a => a >= b;

// intervalc := (a,b) => x => a < x < b
export const inIntervalc = (a: Comparable, b: Comparable) => (x: Comparable): boolean => ltc(x)(a) && ltc(b)(x);

// segmentc := (a,b) => x => a <= x <= b
export const inSegmentc = (a: Comparable, b: Comparable) => (x: Comparable): boolean => leqc(x)(a) && leqc(b)(x);

/** Relational array operators */
