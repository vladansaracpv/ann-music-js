import { curry } from './functional';
/**
 * Arithmetic operations
 *
 * {op}2 := binary
 * {op}c := curried
 * {op}N := n-ary)
 */

/** Addition */
export const add2 = (a: number, b: number): number => a + b;
export const addN = (...args: number[]): number => args.reduce(add2);
export const addC = (b: number) => (a: number): number => a + b;
export const inc = (n: number): number => n + 1;

/** Subtraction */
export const sub2 = (a: number, b: number): number => a - b;
export const subN = (...args: number[]): number => args.reduce(sub2);
export const subC = (b: number) => (a: number): number => a - b;
export const dec = (n: number): number => n - 1;

/** Division */
export const div2 = (a: number, b: number): number => a / b;
export const divN = (...args: number[]): number => args.reduce(div2);
export const divC = (b: number) => (a: number): number => a / b;

/** Multiplication */
export const mul2 = (a: number, b: number): number => a * b;
export const mulN = (...args: number[]): number => args.reduce(mul2);
export const mulC = (b: number) => (a: number): number => a * b;

/** Math functions */
export const mod2 = (n: number, a: number): number => a % n;
export const modC = (b: number) => (a: number): number => a % b;

export const floor = (n: number): number => Math.floor(n);

export const ceil = (n: number): number => Math.ceil(n);

export const abs = (n: number): number => Math.abs(n);

export const pow = (n: number) => (a: number): number => Math.pow(a, n);

export const pow2 = (n: number): number => 2 ** n;

export const sign = (n: number): number => (n < 0 ? -1 : 1);

export const flipCoin = (n: number): number => Math.floor(Math.random() * Math.floor(n));

/** Sums */
export const gsum = (a1: number, r: number, n: number): number => 2 * a1 * (1 - r ** n);
