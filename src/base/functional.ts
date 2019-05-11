/** Functional Programming */

const id = (x: any): any => x;
const applyFn = (res: any[], fn) => [fn.call(null, ...res)];

export const compose = (...fns) => (...args) => fns.reduceRight(applyFn, args)[0];

export const curry = fn =>
  (function curried(cargs) {
    return cargs.length >= fn.length ? fn.apply(this, cargs) : (...args) => curried([...cargs, ...args]);
  })([]);

export const pipe = (...fns) => (...args) => fns.reduce(applyFn, args)[0];

export const partial = (fn, first) => (...rest) => fn(first, ...rest);

export const pipeDebug = (...fns) => value => {
  debugger;
  return fns.reduce((currentValue, currentFunction) => {
    debugger;
    return currentFunction(currentValue);
  }, value);
};
