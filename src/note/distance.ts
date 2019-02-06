import { midi } from './properties';

export const distance = (...args) => {
  const [from, to, fn = midi] = args;
  if (args.length == 1) return (to, f = fn) => distance(from, to, f);
  if (args.length == 2) return distance(from, to, fn);

  return Math.abs(fn(from) - fn(to));
};
