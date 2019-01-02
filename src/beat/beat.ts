import { compose } from '../helpers';

const flipCoin = n => Math.floor(Math.random() * n);

const division = {
  h: ['h', 'q-q', 'q.-e'],
  q: ['q', 'e-e', 'e.-s'],
  e: ['e', 's-s', 's.-t'],
  s: ['s', 't-t', 't-t'],
  'q.': ['e-e-e', 'q-e', 'e-q'],
  'e.': ['s-s-s', 'e-s', 's-e'],
  's.': ['t-t-t', 's-t', 't-s']
};

const divide = (note, chance) => division[note][chance];
const randDivide = bar => bar.map(ch => divide(ch, flipCoin(3)));
const mapRandDivide = arr => arr.map(q => randDivide(q));
const flatArray = arr => arr.reduce((el, acc) => acc.concat(...el), []);
const printBar = bar => bar.reduce((acc, el, i) => `| ${el} ${acc}`, '|');
const splitArr = by => arr => arr.map(q => q.split(by));
const joinArr = by => arr => arr.map(q => q.join(by));
const shuffleBeat = arr => {
  return compose(
    joinArr('-'),
    mapRandDivide,
    splitArr('-')
  )(arr);
};

const mapNTimes = (fn, arr, n) => {
  return n == 0 ? arr : mapNTimes(fn, arr.map(fn), n - 1);
};

const callNTimes = (fn, arr, n) => {
  return n == 0 ? arr : callNTimes(fn, fn(arr), n - 1);
};

const bar = ['q', 'q', 'q', 'q'];

const result = shuffleBeat(bar);
console.log(printBar(callNTimes(shuffleBeat, bar, 2)));

const sheet = () => {
  console.log(`
    1   2   3   4   1   2   3   4
  +---+---+---+---+---+---+---+---+
  | o |   | o |   | o |   | o |   |
  +---+---+---+---+---+---+---+---+
  | 1 | & | 2 | & | 3 | & | 4 | & |
  +---+---+---+---+---+---+---+---+
  `);
};

export {
  flipCoin,
  divide,
  randDivide,
  mapRandDivide,
  flatArray,
  printBar,
  splitArr,
  joinArr,
  shuffleBeat,
  mapNTimes,
  callNTimes
};
