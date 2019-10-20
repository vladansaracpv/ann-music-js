// /** Array methods */
import { eq, neq, lt } from './relations';
import { add, sub, abs } from './math';
import { either } from './boolean';
import { isInteger, isUndefinedOrNull } from './typings';
import { or } from './logical';

const id = n => n;
const notNull = n => !isUndefinedOrNull(n);
const uniqueLocal = (n: any, i: number, a: any[]) => eq(i, 0) || neq(n, a[--i]);

export const fillStr = (s: string, n: number) => Array(Math.abs(n) + 1).join(s);

export const split = (condition: string) => (str: string): string[] => str.split(condition);
export const splitC = (condition: string) => (array: string[]): string[][] => array.map(split(condition));

export const join = (condition: string) => (array: any[]): string => array.join(condition);
export const joinC = (condition: string) => (array: any[]): string[] => array.map(join(condition));

export const concat = (a: any[], b: any[]): any[] => [...a, ...b];
export const concatN = (...args: any[]): any[] => args.reduce(concat);

export const flatten = (array, depth = 2) => array.flat(depth);

export const compact = (array: any[]) => array.filter(notNull);

export const toBinary = (n: number) => n.toString(2);

export const sort = (src: any[], fn = id) => compact(src.map(id)).sort((a, b) => fn(a) - fn(b));

export const unique = (array: any[]) => sort(array).filter(uniqueLocal);

export const rangeUp = (start: number, l: number): number[] => {
  return Array(l)
    .fill(start)
    .map(add);
};
export const rangeDown = (start: number, l: number): number[] => {
  return Array(l)
    .fill(start)
    .map(sub);
};

export const swap = (arr: any[], a: number, b: number) => ([arr[a], arr[b]] = [arr[b], arr[a]]);

export const range = (a: number, b: number): number[] => {
  if (or(!isInteger(a), !isInteger(b))) return [];

  return either(rangeUp(a, abs(b - a + 1)), rangeDown(a, abs(a - b + 1)), lt(a, b));
};

export const shuffle = (array, rnd = Math.random) => {
  let [i, n] = [0, array.length];

  while (n) {
    i = (rnd() * n--) | 0;
    swap(array, n, i);
  }

  return array;
};

export const permutations = array => {
  if (array.length === 0) return [[]];
  return permutations(array.slice(1)).reduce((acc, perm) => {
    return acc.concat(
      array.map((e, pos) => {
        const newPerm = [...perm];
        newPerm.splice(pos, 0, array[0]);
        return newPerm;
      }),
    );
  }, []);
};

export const rotate = (n: number, array: any[]): any[] => {
  const { length } = array;
  const i = n % length;
  return concat(array.slice(i, length), array.slice(0, i));
};

export const mapN = (fn: any, array: any[], n: number) => {
  return either(array, mapN(fn, array.map(fn), n - 1), eq(0, n));
};

export const callN = (fn: any, array: any[], n: number) => {
  return either(array, callN(fn, array.map(fn), n - 1), eq(0, n));
};
