
/**
 *  Note durations. 
 *  Can be either: 
 *  - 1/1:  w(hole)
 *  - 1/2:  h(alf)
 *  - 1/4:  q(uarter)
 *  - 1/8:  e(ighth)
 *  - 1/16: s(ixteenth)
 *  - 1/32: t(hirtysecondth)
 */
class Duration {
  static VALUES = 'whqest'.split('');

  value: string;    // base value (without dots)
  level: number;    // division (exponent) level. q = 2 <=> 1/4 = 2 ** -2
  withDot: boolean; // is it dotted value
  simple: string;   // duration in most simple form (with dot). Ex: 'q.', 'w', ...
  numeric: number;  // integer value. Ex: q = 0.25, h. = 0.75, ...

  /**
   *  Return this duration in terms of other duration
   *  Ex1: 'h.'.in('q') = 3. As 'h.' = 'qqq'
   *  Ex2: 'q.'.in('h') = 0.75, because 3/8 : 4/8 = 3:4 == .75
   */
  in = (value: string): number => {
    const i = this.numeric;
    const iv = new Duration(value).numeric;
    return i / iv;
  }

  half = (): string => Duration.VALUES[this.level + 1] + (this.withDot ? '.' : '');
  double = (): string => Duration.VALUES[this.level - 1] + (this.withDot ? '.' : '');

  /**
   *  Return duration from numeric value.
   *  Ex1: Duration(0.0625) = 's'
   *  Ex2: Duration(0.1875) = 'e.'
   */
  static fromNumber = (value: number): Duration => {
    const isDotted = Number.isInteger(Math.log2(value / 3));
    const type = isDotted ? -Math.log2(value * 2 / 3) : -Math.log2(value);
    if (!Number.isInteger(type)) return null;
    const duration = Duration.VALUES[type];
    return new Duration(duration + (isDotted ? '.' : ''));
  }

  /**
   *  Returns duration from {string} value.
   *  Ex: Duration('q')
   */
  static fromString = (value: string): Duration => new Duration(value);

  static from = (value: number | string): Duration => {
    if (['number', 'string'].indexOf(typeof value) < 0) return null;
    if (typeof value === 'number') return Duration.fromNumber(value);
    return Duration.fromString(value);
  }

  private constructor(value: string) {
    this.value = value[0];
    this.withDot = value[1] === '.' ? true : false;
    this.simple = this.withDot ? value : this.value;
    this.level = Duration.VALUES.indexOf(this.value);
    this.numeric = this.withDot ? 3 * 2 ** -(this.level + 1) : 2 ** -this.level;
  }

}

class Beat {
  values: Duration[];
  simple: string;
  numeric: number;

  in = (value: string): number[] => this.values.map(duration => duration.in(value));

  print = (sheet: string) => {
    // this.values.map(val => val.in(sheet)).reduce((val, acc) => )
  }

  static from = (value: string | string[]) => {
    // if (typeof value === 'string') return Beat.fromString(value);
    // return new Beat(value);
  }

  constructor(value: string) {
    this.simple = value;
    this.values = Array.from(value.split('-'), note => Duration.from(note));
    this.numeric = this.values.map(duration => duration.numeric).reduce((val, acc) => acc + val);
  }
}

class TimeSignature {
  num: number;
  value: number;
  type: Duration;
  numeric: number;

  toString = () => `${this.num}/${this.value}`;

  constructor(beats: number, value: number) {
    this.num = beats;
    this.value = value;
    this.type = Duration.from(1 / value);
    this.numeric = beats / value;
  }
}

class Tempo {
  bpm: number;
  beat: string;
  type: Duration;

  toString = (): string => `${this.bpm}:${this.beat}`;

  duration = (notes: string): number => {
    const beat = new Beat(notes);
    const valueInType = beat.numeric / this.type.numeric;
    return valueInType * 60 / this.bpm;
  }

  constructor(bpm: number, beat: string) {
    this.bpm = bpm;
    this.beat = beat;
    this.type = Duration.from(this.beat);
  }
}


class Bar {
  beats: Beat[];
  meter: TimeSignature;
  sheetLevel: string;
  simple: string;

  in = (value: string): any => {
    return this.beats
      .map(beat => beat.in(value))
      .reduce((val, acc) => [...val, ...acc])
    // .reduce((acc, val, i, arr) => i === arr.length - 1 ? acc : [...acc, acc[i] + val], [0]);
    // .map((val, i) => console.log(`${i}:${val}`))
  }

  // [ 2, 2, 4, 1, 1, 1, 1, 1, 1, 2 ] 

  print = (level: string) => {
    const inDuration = this.in(level);
    const noLines = inDuration.map(v => v - 1);
    const notes = this.simple.split('-');
    const sheet = notes.map((note, i) => `${notes[i]}${'-'.repeat(noLines[i])}`);
    console.log(sheet.join(''));
    // console.log(places);
  }

  constructor(beats: Beat[], meter: TimeSignature, sheetLevel: string = 'q') {
    this.beats = beats;
    this.meter = meter;
    this.simple = this.beats.map(beat => beat.simple).join('-');
    this.sheetLevel = sheetLevel;
  }
}

const b1 = new Beat('e-e');
const b2 = new Beat('q');
const b3 = new Beat('s-s-s-s');
const b4 = new Beat('s-s-e');

const ts = new TimeSignature(4, 4);
const b = new Bar([b1, b2, b3, b4], ts);
b.print('t')
// console.log(b.in('s'));
// console.log(b.simple);
// console.log(b.in('t'));


// const c = new TimeSignature(4, 4);
// c.sheet(16);
// console.log(c.sheet());

// class Bar {
//   meter: TimeSignature;
//   beats: Beat[];

//   constructor(meter: TimeSignature, beats: Beat[]) {
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
