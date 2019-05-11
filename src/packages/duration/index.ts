// import { Duration, NoteValue, NoteType } from './duration';

const allTypes = 'whqest'.split('');
const level = (type: string) => allTypes.indexOf(type);
const typeValue = (type: string) => 2 ** -level(type);

const half = (type: string) => allTypes[level(type) + 1];
const quarter = (type: string) => allTypes[level(type) + 2];

const dotValue = (type: string) => typeValue(type) + typeValue(half(type));

const remainder = (type: string, value: number) => typeValue(type) - value;

const less = (type: string, dotValues = false) => {
  const simple = allTypes.slice(level(type) + 1, allTypes.length);
  const dotted = simple.map(val => [val + '.', val]);
  return dotValues ? dotted.reduce((acc, val) => [...acc, ...val], []) : simple;
};

const greater = (type: string, dotValues = false) => {
  const simple = allTypes.slice(0, level(type));
  const dotted = simple.map(val => [val + '.', val]);
  return dotValues ? dotted.reduce((acc, val) => [...acc, ...val], []) : simple;
};

console.log(less('q', true));

const divide = (type: string, division: number) => {
  if (division === 0) return type;
  if (division === 1) return [half(type), half(type)].join('-');
  return [half(type) + '.', quarter(type)].join('-');
};

console.log(divide('h', 0));

const types = {
  w: [1, 1.5],
  h: [0.5, 0.75],
  q: [0.25, 0.375],
  e: [0.125, 0.1875],
  s: [0.0625, 0.09375],
  t: [0.03125, 0],
};

const values = [1.5, 1, 0.75, 0.5, 0.375, 0.25, 0.1875, 0.125, 0.09375, 0.0625, 0.03125];
