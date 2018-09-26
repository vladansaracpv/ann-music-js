
export const compose = (...fns) => (...args) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

export const curry = (fn) => {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
};

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

export const either = (f, g, c) => c ? f : g;

export const madeOfChar = el => el[0].repeat(el.length) === el;
export const isMember = (X: string | string[], k) => !isEmpty(k) && X.indexOf(k) > -1;
export const inside = (a, b, x) => a <= x && x <= b;
export const isInt = x => Number.isInteger(x);
export const isNum = x => typeof(x) === 'number';
export const isEmpty = x => x.length === 0;
export const rest = (x, n = 1) => x.substring(n, x.length - 1);
export const allTrue = (...args) => args.reduce((acc, x) => acc && x);
export const somethingTrue = (...args) => args.reduce((acc, x) => acc || x);
export const flatten = X => [...[].concat(...[X])];
export const add = a => b => a + b;
export const add2 = (a, b) => a + b;
export const id = x => x;
export const diff = ([a, b]) => a - b;
export const diff2 = (a, b) => a - b;
export const glue = (...args) => args.reduce((acc, el) => acc.toString() + el.toString());
