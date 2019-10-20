import { curry } from './functional';
/**
 * Arithmetic operations
 *
 * {op}2 := binary
 * {op}c := curried
 * {op}N := n-ary)
 */

/** Addition */
export const add = (a: number, b: number): number => a + b;
export const addN = (...args: number[]): number => args.reduce(add);
export const addC = (b: number) => (a: number) => a - b;
export const inc = (n: number): number => n + 1;

/** Subtraction */
export const sub = (a: number, b: number): number => a - b;
export const subN = (...args: number[]): number => args.reduce(sub);
export const subC = (b: number) => (a: number) => a - b;
export const dec = (n: number): number => n - 1;

/** Division */
export const div = (a: number, b: number): number => a / b;
export const divN = (...args: number[]): number => args.reduce(div);
export const divC = (b: number) => (a: number) => a / b;

/** Multiplication */
export const mul = (a: number, b: number): number => a * b;
export const mulN = (...args: number[]): number => args.reduce(mul);
export const mulC = curry(mul);

/** Math functions */
export const mod = (n: number, a: number): number => a % n;
export const modC = curry(mod);

export const floor = (n: number): number => Math.floor(n);
export const ceil = (n: number): number => Math.ceil(n);
export const abs = (n: number): number => Math.abs(n);
export const pow = (n: number) => (a: number): number => Math.pow(a, n);
export const pow2 = (n: number): number => 2 ** n;
export const sign = (n: number): number => (n < 0 ? -1 : 1);

export const random = (n: number): number => Math.floor(Math.random() * Math.floor(n));

/** Sums */
export const gsum = (a1: number, r: number, n: number): number => 2 * a1 * (1 - r ** n);
