import { curry } from './functional';
/**
 *
 * binary: (fn, a, b) => fn(a,b)
 * n-ary: (fn, args) => args.map(fn)
 * curry: (fn, ...args) => curry(fn)(args)
 *
 */

export const unary = fn => (...args: any[]) => curry(fn, args);
export const binary = fn => (one: any, other: any) => fn(one, other);
export const nary = fn => (...args: any[]) => args.reduce(fn);

export const arity = {
  one: unary,
  two: binary,
  n: nary,
};

/** Arithmetic operations (binary, C-urried, N-ary) */

/** Addition */
export const add = (one: number, other: number): number => one + other;

export const inc = (n: number) => n + 1;

/** Subtraction */

export const sub = (a: number, b: number): number => a - b;

export const subC = (b: number) => (a: number): number => a - b;

export const dec = (n: number): number => n - 1;

export const subN = (...args: number[]): number => args.reduce(sub);

/** Division */

export const div = (a: number, b: number): number => a / b;

export const divC = (n: number) => (x: number): number => x / n;

export const divN = (...args: number[]): number => args.reduce(div);

/** Multiplication */

export const mul = (a: number, b: number): number => a * b;

export const mulC = (n: number) => (x: number): number => x * n;

export const mulN = (...args: number[]): number => args.reduce(mul);

/** Math functions */
export const mod = (n: number) => (x: number): number => x % n;

export const floor = (n: number) => Math.floor(n);

export const abs = (n: number) => Math.abs(n);

export const pow = (n: number) => (x: number): number => Math.pow(x, n);

export const pow2 = (exp: number) => 2 ** exp;

export const sign = (n: number): number => (n < 0 ? -1 : 1);

export const flipCoin = (n: number): number => Math.floor(Math.random() * Math.floor(n));

/** Sums */
export const gsum = (a1: number, r: number, n: number): number => (a1 * (1 - r ** n)) / (1 - r);
