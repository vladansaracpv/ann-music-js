import { property, fromMidi } from './properties';
import { compose, curry } from '../helpers';

const midi = property('midi');

export const metric = curry((fn, arr) => arr.map(fn));
export const diff = ([a, b]) => a - b;
export const add = a => b => a + b;
export const distance = (a, b, fn = midi) => compose(Math.abs, diff, metric(fn))([a, b]);
export const next = (x, n = 1) => compose(fromMidi, compose(add(n), midi))(x);
export const prev = (x, n = 1) => next(x, -n);
export const id = x => x;

