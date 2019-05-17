import { curry } from './functional';

/** Arithmetic operations (binary, C-urried, N-ary) */
type BinCurryFn = (b: number) => (a: number) => number;

/** Addition */
export const add2 = (a: number, b: number): number => a + b;

export const addN = (...args: number[]): number => args.reduce(add2);

export const addC = curry(add2) as BinCurryFn;

export const inc = addC(1);

/** Subtraction */
export const sub2 = (a: number, b: number): number => a - b;

export const subN = (...args: number[]): number => args.reduce(sub2);

export const subC = curry(sub2) as BinCurryFn;

export const dec = subC(1);

/** Division */
export const div2 = (a: number, b: number): number => a / b;

export const divN = (...args: number[]): number => args.reduce(div2);

export const divC = curry(div2) as BinCurryFn;

/** Multiplication */
export const mul2 = (a: number, b: number): number => a * b;

export const mulN = (...args: number[]): number => args.reduce(mul2);

export const mulC = curry(mul2) as BinCurryFn;

/** Math functions */
export const mod2 = (n: number, a: number): number => a % n;
export const modC = curry(mod2) as BinCurryFn;

export const floor = (n: number): number => Math.floor(n);

export const ceil = (n: number): number => Math.ceil(n);

export const abs = (n: number): number => Math.abs(n);

export const pow = (n: number) => (a: number): number => Math.pow(a, n);

export const pow2 = (n: number): number => 2 ** n;

export const sign = (n: number): number => (n < 0 ? -1 : 1);

export const flipCoin = (n: number): number => Math.floor(Math.random() * Math.floor(n));

/** Sums */
export const gsum = (a1: number, r: number, n: number): number => (a1 * (1 - r ** n)) / (1 - r);
