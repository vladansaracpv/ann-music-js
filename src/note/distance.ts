import { midi } from './properties';
import { curry } from '../helpers';

const noteDistance = (fn, firstNote, secondNote) => {
  return Math.abs(fn(firstNote) - fn(secondNote))
}


export const distance = curry(noteDistance);
