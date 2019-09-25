/** Functional Programming */

export const curry = (fn: Function) => {
  function curried(cargs: any[]) {
    return cargs.length >= fn.length ? fn.apply(this, cargs) : (...args: any[]) => curried([...cargs, ...args]);
  }

  return curried([]);
};

export const partial = (fn: Function, ...head) => (...tail) => fn(...head, ...tail);

/** Compose functions */
export const compose2 = (f: Function, g: Function) => (...args: any[]) => f(g(...args));
export const compose = (...fns: Function[]) => fns.reduce(compose2);

/** Pipe functions */
export const pipe = (...fns: Function[]) => fns.reduceRight(compose2);
export const pipeDebug = (...fns: Function[]) => (value: any) => {
  debugger;
  return fns.reduce((currentValue, currentFunction) => {
    debugger;
    return currentFunction(currentValue);
  }, value);
};

/** Trace function */
export const trace = (label: string) => (value: any) => {
  console.log(`${label}: ${value}`);
  return value;
};

/** Mapping functions */
type FunctionMap = (currentValue: any, index?: any, array?: any[]) => any[];
export const map = (fn: FunctionMap) => (mappable: any[]) => mappable.map(fn);
