import { midi } from './properties';
import { compose, curry, allTrue } from '../helpers';


export class Operators {

    // x > y
  static gt = curry((x, y, f = midi) => f(x) > f(y));

    // x >= y
  static geq = curry((x, y, f = midi) => f(x) >= f(y));
    ​
    // x === y
  static eq = curry((x, y, f = midi) => f(x) === f(y));
    ​
    // x < y
  static lt = curry((x, y, f = midi) => f(x) < f(y));
    ​
    // x <= y
  static leq = curry((x, y, f = midi) => f(x) <= f(y));

    // x < n < y
  static inInterval = curry((x, y, n, f = midi): any => allTrue(Operators.lt(x, n, f), Operators.lt(n, y, f)));
    ​
    // x <= n <= y
  static inSegment = curry((x, y, n, f = midi): any => allTrue(Operators.leq(x, n, f), Operators.leq(n, y, f)));

}
