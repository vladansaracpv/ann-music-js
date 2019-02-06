import { midi } from './properties';
import { allTrue } from '../helpers';

export const higher = (...args) => {
  const [a, b, fn = midi] = args;

  if (args.length == 1) return (other, f = midi) => higher(a, other, f);
  if (args.length == 2) return higher(a, b, midi);

  return fn(a) > fn(b) ? a : b;
};

export const lower = (...args) => {
  const [a, b, fn = midi] = args;

  if (args.length == 1) return (other, f = fn) => lower(a, other, f);
  if (args.length == 2) return lower(a, b, fn);

  return fn(a) < fn(b) ? a : b;
};

export const isEqual = (...args) => {
  const [a, b, fn = midi] = args;

  if (args.length == 1) return (other, f = fn) => isEqual(a, other, f);
  if (args.length == 2) return isEqual(a, b, fn);

  return fn(a) === fn(b);
};

export const higherThan = (...args) => {
  const [a, b, fn = midi] = args;
  return isEqual(a, higher(...args)) && !isEqual(...args);
};

export const lowerThan = (...args) => {
  const [a, b, fn = midi] = args;
  return isEqual(a, lower(...args)) && !isEqual(...args);
};

export const higherOrEqual = (...args) => {
  const [a, b, fn = midi] = args;
  return isEqual(a, higher(...args)) || isEqual(...args);
};

export const lowerOrEqual = (...args) => {
  const [a, b, fn = midi] = args;
  return isEqual(a, lower(...args)) || isEqual(...args);
};

export const isBetween = (...args) => {
  const [a, b, note, fn = midi] = args;

  if (args.length === 1) return (b, note, f = fn) => isBetween(a, b, note, f);
  if (args.length === 2) return (n, f = fn) => isBetween(a, b, n, f);
  if (args.length === 3) return isBetween(a, b, note, fn);

  return allTrue(lowerThan(a, note), lowerThan(note, b, fn));
};

export const isInSegment = (...args) => {
  const [a, b, note, fn = midi] = args;

  if (args.length === 1) return (b, note, f = fn) => isInSegment(a, b, note, f);
  if (args.length === 2) return (n, f = fn) => isInSegment(a, b, n, f);
  if (args.length === 3) return isInSegment(a, b, note, fn);

  return allTrue(lowerOrEqual(a, note), lowerOrEqual(note, b, fn));
};
