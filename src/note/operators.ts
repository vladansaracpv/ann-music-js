// import { midi } from './properties';
// import { andN } from '../helpers';

// export const higher = (...args) => {
//   const [thanNote, whatNote, fn = midi] = args;
//   const { length } = args;

//   if (length == 1) return (other: string, f) => higher(thanNote, other, f);
//   if (length == 2) return higher(thanNote, whatNote, fn);

//   return fn(thanNote) > fn(whatNote) ? thanNote : whatNote;
// };

// export const lower = (...args) => {
//   const [firstNote, secondNote, fn = midi] = args;
//   const { length } = args;

//   if (length == 1) return (other: string, f = fn) => lower(firstNote, other, f);
//   if (length == 2) return lower(firstNote, secondNote, fn);

//   return fn(firstNote) < fn(secondNote) ? firstNote : secondNote;
// };

// export const isEqual = (...args) => {
//   const [firstNote, secondNote, fn = midi] = args;
//   const { length } = args;

//   if (length == 1) return (other: string, f = fn) => isEqual(firstNote, other, f);
//   if (length == 2) return isEqual(firstNote, secondNote, fn);

//   return fn(firstNote) === fn(secondNote);
// };

// export const higherThan = (...args) => {
//   const [firstNote] = args;
//   return isEqual(firstNote, higher(...args));
// };

// export const lowerThan = (...args) => {
//   const [firstNote] = args;
//   return isEqual(firstNote, lower(...args)) && !isEqual(...args);
// };

// export const higherOrEqual = (...args) => {
//   const [firstNote] = args;
//   return isEqual(firstNote, higher(...args)) || isEqual(...args);
// };

// export const lowerOrEqual = (...args) => {
//   const [firstNote] = args;
//   return isEqual(firstNote, lower(...args)) || isEqual(...args);
// };

// export const isBetween = (...args) => {
//   const [firstNote, secondNote, note, fn = midi] = args;
//   const { length } = args;

//   if (length === 1) return (second: string, note: string, f = fn) => isBetween(firstNote, second, note, f);
//   if (length === 2) return (n: string, f = fn) => isBetween(firstNote, secondNote, n, f);
//   if (length === 3) return isBetween(firstNote, secondNote, note, fn);

//   return andN(lowerThan(firstNote, note, fn), lowerThan(note, secondNote, fn));
// };

// export const isInSegment = (...args) => {
//   const [firstNote, secondNote, note, fn = midi] = args;
//   const { length } = args;

//   if (length === 1) return (second: string, note: string, f = fn) => isInSegment(firstNote, second, note, f);
//   if (length === 2) return (n: string, f = fn) => isInSegment(firstNote, secondNote, n, f);
//   if (length === 3) return isInSegment(firstNote, secondNote, note, fn);

//   return andN(lowerOrEqual(firstNote, note, fn), lowerOrEqual(note, secondNote, fn));
// };
