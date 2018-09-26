import { midi } from './properties';
import { compose, curry, diff, diff2 } from '../helpers';
import { NAME } from './factory';

export class Distance {

  static metric = curry((fn, arr) => arr.map(fn));
  static distance = (a, b, fn = midi) => compose(Math.abs, diff, Distance.metric(fn))([a, b]);

}
