/** Functional Programming */

export const partial = (fn, ...first) => (...rest) => fn(...first, ...rest);

export const curry = fn =>
  (function curried(cargs) {
    return cargs.length >= fn.length ? fn.apply(this, cargs) : (...args) => curried([...cargs, ...args]);
  })([]);

export const compose2 = (f, g) => (...args) => f(g(...args));
export const compose = (...fns) => fns.reduce(compose2);
export const pipe = (...fns) => fns.reduceRight(compose2);

export const pipeDebug = (...fns) => value => {
  debugger;
  return fns.reduce((currentValue, currentFunction) => {
    debugger;
    return currentFunction(currentValue);
  }, value);
};

export const trace = label => value => {
  console.log(`${label}: ${value}`);
  return value;
};

export const map = fn => mappable => mappable.map(fn);
export const log = (...args) => console.log(...args);

/*
  const arr = [1, 2, 3, 4];
  const isEven = n => n % 2 === 0;
  const stripe = n => isEven(n) ? 'dark' : 'light';
  const stripeAll = map(stripe);
  const striped = stripeAll(arr); 
  log(striped);
  // => ["light", "dark", "light", "dark"]
  const double = n => n * 2;
  const doubleAll = map(double);
  const doubled = doubleAll(arr);
  log(doubled);
  // => [2, 4, 6, 8]
*/
