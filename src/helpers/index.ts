import { name } from '../note/properties';

// Functional programming methods
export const compose = (...fns) => (...args) =>
  fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

export const curry = fn => {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
};

// Array methods
export const mapNTimes = (f, a, n) =>
  n == 0 ? a : mapNTimes(f, a.map(f), n - 1);

export const callNTimes = (f, a, n) =>
  n == 0 ? a : callNTimes(f, f(a), n - 1);

export const fillStr = (s: string, n: number) => Array(Math.abs(n) + 1).join(s);

export const splitArr = condition => arr => arr.map(q => q.split(condition));
export const joinArr = condition => arr => arr.map(q => q.join(condition));
export const flatArray = arr => arr.reduce((el, acc) => acc.concat(...el), []);

// Boolean methods
export const madeOfChar = el => el[0].repeat(el.length) === el;
export const memberOf = (X: string | string[], el) =>
  !isEmpty(el) && X.indexOf(el) > -1;
export const inside = (a, b, x) => a <= x && x <= b;
export const isInt = x => Number.isInteger(x);
export const isNum = x => typeof x === 'number';
export const isEmpty = x => x.length === 0;
export const either = (f, g, c) => (c ? f : g);
export const allTrue = (...args) => args.reduce((acc, x) => acc && x);
export const atLeast = (...args) => args.reduce((acc, x) => acc || x);

// Operation methods
export const add = a => b => a + b;
export const add2 = (a, b) => a + b;
export const diff = ([a, b]) => a - b;
export const diff2 = (a, b) => a - b;

// Transformation methods
export const rest = (x, n = 1) => x.substring(n, x.length - 1);
export const flatten = X => [...[].concat(...[X])];
export const glue = (...args) => args.reduce((acc, el) => acc + el);
export const id = x => x;
export const firstLetter = n => n[0];
export const withTick = arr => arr.map(el => `'${el}'`);
export const or = (args, hasTick = false) => {
  const argsWithTick = hasTick ? args : withTick(args);
  return argsWithTick.join(' / ');
};
export const and = (args, hasTick = false) => {
  const argsWithTick = hasTick ? args : withTick(args);
  return `[ ${argsWithTick.join(', ')} ]`;
};

// export const fillStr = (s, n) => Array(Math.abs(n) + 1).join(s);
export const flipCoin = n => Math.floor(Math.random() * n);

// ascending range (-2, 4) = [-2, -1, 0, 1]
const rangeUp = (start, l) =>
  Array(l)
    .fill(start)
    .map((v, i) => v + i);

// descending range (2, 4) = [2, 1, 0, -1]
const rangeDown = (start, l) =>
  Array(l)
    .fill(start)
    .map((v, i) => v - i);

export const range = (a, b) => {
  if (a === null || b === null) return [];
  return a < b ? rangeUp(a, b - a + 1) : rangeDown(a, a - b + 1);
};

export const rotate = (n, arr) => {
  const len = arr.length;
  const i = ((n % len) + len) % len;
  return arr.slice(i, len).concat(arr.slice(0, i));
};

export const compact = arr => arr.filter(n => n === 0 || n);

// const height = name => {
//   const m = props(name).midi;
//   return m !== null ? m : props(name + '-100').midi;
// };

// export const sort = src =>
//   compact(src.map(name)).sort((a, b) => height(a) > height(b));

// export const unique = arr =>
//   sort(arr).filter((n, i, a) => i === 0 || n !== a[i - 1]);

export const shuffle = (arr, rnd = Math.random) => {
  let i, t;
  let m = arr.length;
  while (m) {
    i = (rnd() * m--) | 0;
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
};

export const permutations = arr => {
  if (arr.length === 0) return [[]];
  return permutations(arr.slice(1)).reduce(function (acc, perm) {
    return acc.concat(
      arr.map(function (e, pos) {
        var newPerm = perm.slice();
        newPerm.splice(pos, 0, arr[0]);
        return newPerm;
      })
    );
  }, []);
};
