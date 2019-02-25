
/**
 * 
 * Functional Programming
 * 
 */
const id = (x: any): any => x;
const applyFn = (res, fn) => [fn.call(null, ...res)]

export const compose = (...fns) => (...args) => {
  return fns.reduceRight(applyFn, args)[0];
}

export const curry = fn => {
  const arity = fn.length;

  return function $curry(...args) {
    return isEither(
      $curry.bind(null, ...args),
      fn.call(null, ...args),
      lt(arity, args.length)
    )
  };
};

export const pipe = (...fns) => x => fns.reduce((v, fn) => fn(v), x);





/** 
 * 
 * Arithmetic operations (binary, C-urried, N-ary) 
 * 
 */

/** Addition */
export const add = (a: number, b: number): number => a + b;

export const addC = (b: number) => (a: number): number => a + b;

export const addN = (...args: number[]): number => args.reduce(add);


/** Subtraction */
export const sub = (a: number, b: number): number => a - b;

export const subC = (b: number) => (a: number): number => a - b;

export const decrement = subC(1);

export const subN = (...args: number[]): number => args.reduce(sub);


/** Division */
export const div = (a: number, b: number): number => a / b;

export const divC = (n: number) => (x: number): number => x / n;

export const divN = (...args: number[]): number => args.reduce(div);


/** Multiplication */
export const mul = (a: number, b: number): number => a * b;

export const mulC = (n: number) => (x: number): number => x * n;

export const mulN = (...args: number[]): number => args.reduce(mul);





/** 
 * 
 * Math functions
 * 
 */
export const mod = (n: number) => (x: number): number => x % n;

export const floor = (n: number) => Math.floor(n);

export const abs = (n: number) => Math.abs(n);

export const pow = (n: number) => (x: number): number => Math.pow(x, n);

export const pow2 = (exp: number) => 2 ** exp;

export const flipCoin = (n: number): number => Math.floor(Math.random() * Math.floor(n));

export const normalize = divC(12);




/** 
 * 
 * Relational operators 
 * 
 */
export const gt = (n: any, x: any): boolean => x > n;

export const geq = (n: any, x: any): boolean => x >= n;

export const lt = (n: any, x: any): boolean => x < n;

export const leq = (n: any, x: any): boolean => x <= n;

export const eq = (n: any, x: any): boolean => x === n;

export const neq = (n: any, x: any): boolean => x !== n;





/** 
 * 
 * Logical operators 
 * 
 */

/** AND */
export const land = (a: boolean, b: boolean): boolean => a && b;

export const andN = (...args: boolean[]): boolean => args.reduce(land);


/** OR */
export const lor = (a: boolean, b: boolean): boolean => a || b;

export const orN = (...args: boolean[]): boolean => args.reduce(lor);





/** 
 * 
 * Boolean methods 
 * 
 */
export const isInteger = (x: number): boolean => Number.isInteger(x);

export const isPositive = (x: number): boolean => geq(0, x);

export const isNumber = (x: any): boolean => typeof x === 'number';

export const isString = (x: any): boolean => typeof x === 'string';

export const isArray = (x: any): boolean => Array.isArray(x);

export const isEmpty = (x: string | any[]) => eq(0, x.length);

export const isMemberOf = (X: string | string[], el: any): boolean => andN(!isEmpty(el), geq(0, X.indexOf(el)));

export const isIn = str => n => str.includes(n[1]);

export const isMadeOfChar = (el: string): boolean => fillStr(el[0], el.length) === el;

export const isInside = (a: number, b: number, x: number): boolean => andN(lt(x, a), gt(x, b));

export const isBetween = (a: number, b: number, x: number): boolean => andN(leq(x, a), geq(x, b));

export const isEither = (f, g, c) => { return c ? f : g };





/** 
 * 
 * Array methods 
 * 
 */
const name = id;
const notNull = n => n === 0 || n;
const uniqueLocal = (n: any, i: number, a: any[]) => eq(i, 0) || neq(n, a[--i]);

export const fillStr = (s: string, n: number) => Array(Math.abs(n) + 1).join(s);

export const split = (condition: string) => (str: string): string[] => str.split(condition);
export const splitC = (condition: string) => (array: string[]): string[][] => array.map(split(condition));

export const join = (condition: string) => (array: any[]): string => array.join(condition)
export const joinC = (condition: string) => (array: any[]): string[] => array.map(join(condition));

export const concat = (a: any[], b: any[]): any[] => [...a, ...b];
export const concatN = (...args: any[]): any[] => args.reduce(concat);

export const flatten = (array, depth = 2) => array.flat(depth);

export const compact = (array: number[]) => array.filter(notNull);

export const sort = (src: any[], fn = id) => compact(src.map(name)).sort((a, b) => fn(a) - fn(b));

export const unique = (array: any[]) => sort(array).filter(uniqueLocal);

export const swap = (arr: any[], a: number, b: number) => [arr[a], arr[b]] = [arr[b], arr[a]];

export const rangeUp = (start: number, l: number): number[] => Array(l).fill(start).map(add);
export const rangeDown = (start: number, l: number): number[] => Array(l).fill(start).map(sub);
export const range = (a: number, b: number): number[] => {
  if (lor(!isInteger(a), !isInteger(b))) return [];

  return isEither(
    rangeUp(a, abs(b - a + 1)),
    rangeDown(a, abs(a - b + 1)),
    gt(a, b)
  );
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
      })
    );
  }, []);
};

export const rotate = (n: number, array: any[]): any[] => {
  const { length } = array;
  const i = n % length;
  return concat(array.slice(i, length), array.slice(0, i));
};

export const mapN = (fn: any, array: any[], n: number) => {
  return isEither(
    array,
    mapN(fn, array.map(fn), n - 1),
    eq(0, n)
  )
}

export const callN = (fn: any, array: any[], n: number) => {
  return isEither(
    array,
    callN(fn, array.map(fn), n - 1),
    eq(0, n)
  )
}





/** 
 * 
 * String methods 
 * 
 */
export const rest = (x: string, n = 1) => x.substring(n);

export const glue = (...args) => args.reduce((acc, el) => acc + el);

export const charAt = (i: number) => (n: string) => n[0];

export const capitalize = (str: string): string => glue('from', str[0].toUpperCase(), rest(str));





/** 
 * 
 * Transformation methods 
 * 
 */
export const withTick = array => array.map(el => `'${el}'`);

export const or = (args, hasTick = false) => {
  const argsWithTick = hasTick ? args : withTick(args);
  return argsWithTick.join(' / ');
};

export const and = (args, hasTick = false) => {
  const argsWithTick = hasTick ? args : withTick(args);
  return `[ ${argsWithTick.join(', ')} ]`;
};
