/** Relational binary operators  */
type Comparable = number | string;

type BinRelationFn<T> = (a: T, b: T) => boolean;
type ComparableBinFn = BinRelationFn<Comparable>;
type BinRelationFnNum<T> = (a: T, b: T) => number;
type ComparableBinFnNum = BinRelationFnNum<Comparable>;

type CurryRelationFn<T> = (b: T) => (a: T) => boolean;
type ComparableCurryFn = CurryRelationFn<Comparable>;

// lt := (a,b) => a < b
export const lt: ComparableBinFn = (...args) => args[0] < args[1];

// leq := (a,b) => a <= b
export const leq: ComparableBinFn = (...args) => args[0] <= args[1];

// eq := (a,b) => a === b
export const eq: ComparableBinFn = (...args) => args[0] === args[1];

// neq := (a,b) => a !== b
export const neq: ComparableBinFn = (...args) => args[0] !== args[1];

// gt := (a,b) => args[0]> b
export const gt: ComparableBinFn = (...args) => args[0] > args[1];

// geq := (a,b) => a >= b
export const geq: ComparableBinFn = (...args) => args[0] >= args[1];

export const cmp: ComparableBinFnNum = (...args) => {
  const a: Comparable = args[0];
  const b: Comparable = args[1];
  if (eq(a, b)) return 0;
  return lt(a, b) ? -1 : 1;
};

// interval := (a,b,n) => a < n < b
export const inInterval = (lower: number, higher: number, num: number): boolean => lt(lower, num) && lt(num, higher);

// segment := (a,b,n) => a <= n <= b
export const inSegment = (lower: number, higher: number, num: number): boolean => leq(lower, num) && leq(num, higher);

export const isNegative = (a: number): boolean => a < 0;

export const ltz = isNegative;

export const isPositive = (a: number): boolean => a > 0;

export const gtz = isPositive;

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
