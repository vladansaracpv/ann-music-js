import { values } from "ramda";

class Duration {
  static VALUES = 'whqes'.split('');
  static partition = ['simple', 'compound'];

  value: string;
  withDot: boolean;
  simple: string;

  divide = (compound = false): Duration[] => {
    const divisionLevel = Duration.VALUES.indexOf(this.value) + 1;
    const halfValue = Duration.VALUES[divisionLevel];
    const willContainDot = this.withDot && compound;
    const parts = willContainDot ? 2 : (this.withDot ? 3 : 2);
    return halfValue.repeat(parts).split('').map(value => new Duration(value, willContainDot));
  }

  constructor(value: string, withDot = false) {
    this.value = value;
    this.withDot = withDot;
    this.simple = this.value + (this.withDot ? '.' : '');
  }

}

class Beat {
  value: Duration[] = [];

  formated = () => this.value.map(val => val.simple).join('-');

  split = (compound = false) => this.value.map(duration => duration.divide(compound)).reduce((acc, val) => [...acc, ...val]);

  constructor(value: Duration[]) {
    this.value = value;
  }
}

class Bar {
  beats: Beat[];
  meter: Meter;
  sheetLevel: string;

  constructor(beats: Beat[], meter: Meter, sheetLevel: string = 'q') {
    this.beats = beats;
    this.meter = meter;
    this.sheetLevel = sheetLevel;
  }
}


class Meter {
  beats: number;
  value: number;

  print = () => console.log(`${this.beats} / ${this.value}`);

  sheet = (level: number = 4) => {
    const width = level / this.value;
    const suffix = width === 2 ? '&' : width === 1 ? '' : '&ea';
    const tap = [1, 2, 3, 4].map(val => ` ${val}${suffix}`).join('') + '\n';
    const beat = `|o${' '.repeat(width - 1)}`;
    const rhytm = beat.repeat(this.beats) + '|\n';

    const top = `+${'-'.repeat(width)}`.repeat(this.beats) + '+\n';
    const bottom = `+${'-'.repeat(width)}`.repeat(this.beats) + '+\n';
    // const bottom = '+----'.repeat(this.beats) + '+\n';

    console.log(tap + top + rhytm + bottom);
  }

  constructor(beats: number, value: number) {
    this.beats = beats;
    this.value = value;
  }
}

const c = new Meter(4, 4);
c.sheet(16);
// console.log(c.sheet());

// class Bar {
//   meter: Meter;
//   beats: Beat[];

//   constructor(meter: Meter, beats: Beat[]) {
//     this.meter = meter;
//     this.beats = beats;
//   }
// }


// /**
//  * Returns partition level of a note. w:1 0, h: 1, q: 2, ...
//  * 
//  * @param {string} duration - note duration: w, h, q, ...
//  * 
//  */
// const valueLevel = (duration: string): number => beatValue.indexOf(duration);

// /**
//  * Returns note value for current level of partition
//  * 
//  * @param {number} level - partition level. 0: w, 1: h, 2: q, ...
//  * 
//  */
// const levelValue = (level: number): string => beatValue[level];


// const division = (value: string, parts: number): string => {
//   return value.repeat(parts).split('').join('-');
// }

// const subdivision = (note: string, parts: number): string => {
//   if (parts === 1) return note;
//   const level = valueLevel(note);
//   const dividedNote = levelValue(level + 1);
//   return division(dividedNote, parts);
// }

// /**
//  * Returns array of note values for given @bar
//  * 
//  * @param {string} bar - string represented bar. Ex: 'h-h-h'
//  * 
//  */
// const barToNotes = (bar: string): string[] => bar.split('-');

// /**
//  * Returns string representation of a bar for given array of note values
//  * 
//  * @param notes 
//  * 
//  */
// const notesToBar = (notes: string[]): string => notes.join('-');

// /**
//  * All possible subdivision on next level for given note value
//  * 
//  * @param note 
//  * 
//  */
// const subdivisions = (note: string): string[] => {
//   return partitions.map((parts) => subdivision(note, parts));
// }

// const subdivisionsOnDepth = (note: string, level: number): string[] => {

// }

// console.log(subdivisions('h'));



// // const divide = (note, chance) => division[note][chance];
// // const randDivide = bar => bar.map(ch => divide(ch, flipCoin(3)));
// // const mapRandDivide = arr => arr.map(q => randDivide(q));
// // const printBar = bar => bar.reduce((acc, el, i) => `| ${el} ${acc}`, '|');
// // const shuffleBeat = arr =>
// //   compose(
// //     joinC('-'),
// //     mapRandDivide,
// //     splitC('-')
// //   )(arr);

// // const bar = ['q', 'q', 'q', 'q'];

// // /**
// //  *  [w   |h h |qqqq|]
// //  */

// // const sheet = () => {
// //   console.log(`
// //     1   2   3   4   1   2   3   4
// //   +---+---+---+---+---+---+---+---+
// //   | o |   | o |   | o |   | o |   |
// //   +---+---+---+---+---+---+---+---+
// //   | 1 | & | 2 | & | 3 | & | 4 | & |
// //   +---+---+---+---+---+---+---+---+
// //   `);
// // };

// // const noteValues = { w: 1, h: 2, q: 4, e: 8, s: 16, t: 32 };

// // const setNoteValuesForTempo = (note, t) => {
// //   let noteTypes = 'whqest'.split('');
// //   let duration = noteValues[note] * t;

// //   let relativeDuration = noteTypes.map((el, i) => ({
// //     [el]: duration / noteValues[el]
// //   }));
// //   return relativeDuration.reduce((acc, el, i) => Object.assign({}, acc, el));
// // };

// // const tempo = (bpm, note) => ({
// //   bpm,
// //   note,
// //   beatValue: 60.0 / bpm,
// //   noteValues: setNoteValuesForTempo(note, this.beatValue)
// // });

// // export { divide, randDivide, mapRandDivide, printBar, shuffleBeat, tempo };
