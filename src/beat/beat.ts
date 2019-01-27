import { compose, splitArr, joinArr, flipCoin } from '../helpers';

const division = {
  w: ['w', 'h-h', 'h.-q'],
  h: ['h', 'q-q', 'q.-e'],
  q: ['q', 'e-e', 'e.-s'],
  e: ['e', 's-s', 's.-t'],
  s: ['s', 't-t', 't-t'],
  'h.': ['q-q-q', 'h-q', 'h.'],
  'q.': ['e-e-e', 'q-e', 'q.'],
  'e.': ['s-s-s', 'e-s', 'e.'],
  's.': ['t-t-t', 's-t', 's.']
};

const divide = (note, chance) => division[note][chance];
const randDivide = bar => bar.map(ch => divide(ch, flipCoin(3)));
const mapRandDivide = arr => arr.map(q => randDivide(q));
const printBar = bar => bar.reduce((acc, el, i) => `| ${el} ${acc}`, '|');
const shuffleBeat = arr =>
  compose(
    joinArr('-'),
    mapRandDivide,
    splitArr('-')
  )(arr);

const bar = ['q', 'q', 'q', 'q'];

/**
 *  [w   |h h |qqqq|]
 */

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

const noteValues = { w: 1, h: 2, q: 4, e: 8, s: 16, t: 32 };

const setNoteValuesForTempo = (note, t) => {
  let noteTypes = 'whqest'.split('');
  let duration = noteValues[note] * t;

  let relativeDuration = noteTypes.map((el, i) => ({
    [el]: duration / noteValues[el]
  }));
  return relativeDuration.reduce((acc, el, i) => Object.assign({}, acc, el));
};

const tempo = (bpm, note) => ({
  bpm,
  note,
  beatValue: 60.0 / bpm,
  noteValues: setNoteValuesForTempo(note, this.beatValue)
});

export { divide, randDivide, mapRandDivide, printBar, shuffleBeat, tempo };
