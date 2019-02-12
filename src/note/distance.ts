import { midi } from './properties';
import { curry } from '../helpers';

// const noteDistance = curry((firstNote, secondNote, fn) => {
//   return Math.abs(fn(firstNote) - fn(secondNote))
// });


// export const distanceMidi = (firstNote, secondNote) => {
//   return noteDistance(firstNote, secondNote, midi);
// }

// export const distanceFn = (firstNote, secondNote, fn) => {
//   return noteDistance(firstNote, secondNote, fn);
// }

// export const distance = first => second => (fn?) => {
//   return fn ? distanceFn(first, second, fn) : distanceMidi(first, second);
// }

export const distance = (...args) => {
  const [first, second, fn] = args;
  const len = args.length;
  if (len === 1) return (second, fn = midi) => distance(first, second, fn);
  if (len === 2) return (fn = midi) => distance(first, second, fn);
  return Math.abs(fn(first) - fn(second))

}
