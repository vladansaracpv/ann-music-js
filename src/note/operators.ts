import { midi } from './properties';
import { allTrue } from '../helpers';

/** Return higher of two notes */
export const higher = (...args) => {
  const [firstNote, secondNote, fn = midi] = args;

  if (args.length == 1) return (other, f = midi) => higher(firstNote, other, f);
  if (args.length == 2) return higher(firstNote, secondNote, midi);

  return fn(firstNote) > fn(secondNote) ? firstNote : secondNote;
};

/** Return lower of two notes */
export const lower = (...args) => {
  const [firstNote, secondNote, fn = midi] = args;

  if (args.length == 1) return (other, f = fn) => lower(firstNote, other, f);
  if (args.length == 2) return lower(firstNote, secondNote, fn);

  return fn(firstNote) < fn(secondNote) ? firstNote : secondNote;
};

/** Check if two notes are equal */
export const isEqual = (...args) => {
  const [firstNote, secondNote, fn = midi] = args;

  if (args.length == 1) return (other, f = fn) => isEqual(firstNote, other, f);
  if (args.length == 2) return isEqual(firstNote, secondNote, fn);

  return fn(firstNote) === fn(secondNote);
};

/** Check if firstNote is strictly higher than secondNote */
export const higherThan = (...args) => {
  const [firstNote] = args;
  return isEqual(firstNote, higher(...args));
};

/** Check if firstNote is strictly lower than secondNote */
export const lowerThan = (...args) => {
  const [firstNote] = args;
  return isEqual(firstNote, lower(...args)) && !isEqual(...args);
};

/** Check if firstNote is higher or equal than secondNote */
export const higherOrEqual = (...args) => {
  const [firstNote] = args;
  return isEqual(firstNote, higher(...args)) || isEqual(...args);
};

/** Check if firstNote is lower or equal than secondNote */
export const lowerOrEqual = (...args) => {
  const [firstNote] = args;
  return isEqual(firstNote, lower(...args)) || isEqual(...args);
};

/** Check if firstNote < note < secondNote */
export const isBetween = (...args) => {
  const [firstNote, secondNote, note, fn = midi] = args;

  if (args.length === 1) return (second, note, f = fn) => isBetween(firstNote, second, note, f);
  if (args.length === 2) return (n, f = fn) => isBetween(firstNote, secondNote, n, f);
  if (args.length === 3) return isBetween(firstNote, secondNote, note, fn);

  return allTrue(lowerThan(firstNote, note, fn), lowerThan(note, secondNote, fn));
};

/** Check if firstNote <= note <= secondNote */
export const isInSegment = (...args) => {
  const [firstNote, secondNote, note, fn = midi] = args;

  if (args.length === 1) return (second, note, f = fn) => isInSegment(firstNote, second, note, f);
  if (args.length === 2) return (n, f = fn) => isInSegment(firstNote, secondNote, n, f);
  if (args.length === 3) return isInSegment(firstNote, secondNote, note, fn);

  return allTrue(lowerOrEqual(firstNote, note, fn), lowerOrEqual(note, secondNote, fn));
};
