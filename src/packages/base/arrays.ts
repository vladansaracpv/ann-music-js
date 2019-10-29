// /** Array methods */
import { eq, neq, lt } from './relations';
import { add, sub, abs } from './math';
import { either, some } from './boolean';
import { isInteger, isUndefinedOrNull } from './typings';

export const fillStr = (s: string, n: number) => Array(Math.abs(n) + 1).join(s);

export const split = (by: string) => (str: string): string[] => str.split(by);
export const splitArrays = (by: string) => (array: string[]): string[][] => array.map(split(by));

export const join = (by: string) => (array: any[]): string => array.join(by);
export const joinArrays = (by: string) => (array: any[][]): string[] => array.map(join(by));

export const concat = (a: any[], b: any[]): any[] => [...a, ...b];
export const concatN = (...args: any[]): any[] => args.reduce(concat);

const notNull = n => !isUndefinedOrNull(n);
export const compact = (array: any[]) => array.filter(notNull);

export const toBinary = (n: number) => n.toString(2);

export const sort = (src: any[], fn = n => n) => compact(src).sort((a, b) => fn(a) - fn(b));

const uniqueLocal = (n: any, i: number, a: any[]) => eq(i, 0) || neq(n, a[--i]);
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
  if (some(!isInteger(a), !isInteger(b))) return [];

  return either(rangeUp(a, abs(b - a + 1)), rangeDown(a, abs(a - b + 1)), lt(a, b));
};

export const shuffle = (array: any[], rnd = Math.random) => {
  let [i, n] = [0, array.length];

  while (n) {
    i = (rnd() * n--) | 0;
    swap(array, n, i);
  }

  return array;
};

export const permutations = (array: any[]) => {
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
  let arr = array.slice();
  while (n--) {
    arr = arr.map(fn);
  }
  return arr;
};
