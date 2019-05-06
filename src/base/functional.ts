/** Functional Programming */

const id = (x: any): any => x;
const applyFn = (res: any[], fn) => [fn.call(null, ...res)];

export const compose = (...fns) => (...args) => {
  return fns.reduceRight(applyFn, args)[0];
};

export const curry = (fn, ...args) => {
  return (..._arg) => {
    return fn(...args, ..._arg);
  };
};

export const pipe = (...fns) => (...args) => fns.reduce(applyFn, args)[0];

export const pipeDebug = (...functions) => value => {
  debugger;
  return functions.reduce((currentValue, currentFunction) => {
    debugger;
    return currentFunction(currentValue);
  }, value);
};
