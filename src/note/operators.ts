import { property } from './properties';
import { compose, curry } from '../helpers';

export const midi = property('midi');

// x > y
export const gt = curry((x, y, f = midi) => f(x) > f(y));

// x >= y
export const geq = curry((x, y, f = midi) => f(x) >= f(y));
​
// x === y
export const eq = curry((x, y, f = midi) => f(x) === f(y));
​
// x < y
export const lt = curry((x, y, f = midi) => f(x) < f(y));
​
// x <= y
export const leq = curry((x, y, f = midi) => f(x) <= f(y));

// x < n < y
export const inInterval = curry((x, y, n, f = midi): any => lt(x, n, f) && lt(n, y, f));
​
// x <= n <= y
export const inSegment = curry((x, y, n, f = midi): any => leq(x, n, f) && leq(n, y, f));



