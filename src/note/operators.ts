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

export const equal = (...args) => {
  const [a, b, fn = midi] = args;

  if (args.length == 1) return (other, f = fn) => equal(a, other, f);
  if (args.length == 2) return equal(a, b, fn);

  return fn(a) === fn(b);
};

export const higherThan = (...args) => {
  const [a, b, fn = midi] = args;
  return equal(a, higher(...args)) && !equal(...args);
};

export const lowerThan = (...args) => {
  const [a, b, fn = midi] = args;
  return equal(a, lower(...args)) && !equal(...args);
};

export const higherEq = (...args) => {
  const [a, b, fn = midi] = args;
  return equal(a, higher(...args)) || equal(...args);
};

export const lowerEq = (...args) => {
  const [a, b, fn = midi] = args;
  return equal(a, lower(...args)) || equal(...args);
};

export const inInterval = (...args) => {
  const [a, b, note, fn = midi] = args;

  if (args.length === 1) return (b, note, f = fn) => inInterval(a, b, note, f);
  if (args.length === 2) return (n, f = fn) => inInterval(a, b, n, f);
  if (args.length === 3) return inInterval(a, b, note, fn);

  return allTrue(lowerThan(a, note), lowerThan(note, b, fn));
};

export const inSegment = (...args) => {
  const [a, b, note, fn = midi] = args;

  if (args.length === 1) return (b, note, f = fn) => inSegment(a, b, note, f);
  if (args.length === 2) return (n, f = fn) => inSegment(a, b, n, f);
  if (args.length === 3) return inSegment(a, b, note, fn);

  return allTrue(lowerEq(a, note), lowerEq(note, b, fn));
};
