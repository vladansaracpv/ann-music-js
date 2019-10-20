// // import { Duration } from './duration';
// // import { Euclid } from './euclid';

// // export enum MeterType {
// //   Simple = 'simple',
// //   Compound = 'compound',
// //   Odd = 'odd',
// // }

// // export class Meter {
// //   top: number;
// //   bottom: number;
// //   type: MeterType;
// //   numOfBeats: number;
// //   beat: string[];

// //   getBeatValue = () =>
// //     this.type == MeterType.Compound ? Duration.valueToName(this.bottom).repeat(3) : this.beat.join(' ');
// //   getNumOfBeats = () => this.numOfBeats;
// //   getType = () => this.type;

// //   constructor(top: number, bottom: number) {
// //     this.top = top;
// //     this.bottom = bottom;
// //     this.setType();
// //   }

// //   properties = () => ({
// //     top: this.top,
// //     bottom: this.bottom,
// //     type: this.type,
// //     numOfBeats: this.numOfBeats,
// //     beat: this.beat,
// //   });

// //   setType = () => {
// //     if (Meter.isCompound(this.top, this.bottom)) return this.createCompound();
// //     if (Meter.isSimple(this.top, this.bottom)) return this.createSimple();
// //     return this.createOdd();
// //   };

// //   static isCompound = (top: number, bottom: number): boolean => {
// //     return top % 3 === 0 && top > 3;
// //   };

// //   static isSimple = (top: number, bottom: number): boolean => {
// //     return top < 5;
// //   };

// //   createSimple = () => {
// //     this.type = MeterType.Simple;
// //     this.numOfBeats = this.top;
// //     this.beat = [Duration.valueToName(this.bottom)];
// //   };

// //   createCompound = () => {
// //     this.type = MeterType.Compound;
// //     this.numOfBeats = this.top / 3;
// //     this.beat = [Duration.valueToName(Duration.doubleValue(this.bottom)) + '.'];
// //   };

// //   createOdd = () => {
// //     this.type = MeterType.Odd;
// //     this.numOfBeats = Math.ceil(this.top / 3);
// //     const name = Duration.valueToName(Duration.doubleValue(this.bottom));
// //     var arr: string = Euclid(this.numOfBeats, this.top, false).join('');
// //     arr = arr.replace(/100/g, name + '.').replace(/10/g, name + ' ');

// //     const groups = arr.split(' ').map(group => ((group[1] || ' ') === '.' ? [group[0], '.'] : [group, '']));

// //     this.beat = [arr];
// //   };
// // }

// const numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
// const subdivisions = {
//   1: (n: number) => `${n} `,
//   2: (n: number) => `${n} & `,
//   3: (n: number) => `${n} & a `,
//   4: (n: number) => `${n} e & a `,
// };

// const s = subdivisions[4](2);
// console.log(s.split(' '));

// const sayNumber = (n: number) => numbers[n];

// const fillStr = (s: string, n: number): string => Array(Math.abs(n) + 1).join(s);

// const add2 = (a: number, b: number): number => a + b;

// const rangeUp = (start: number, l: number): number[] => {
//   return Array(l)
//     .fill(start)
//     .map(add2);
// };

// const afterBeat = (beat: number, sheetSymbol: string, subdivision: number) => {
//   const bar = subdivisions[subdivision](beat)
//     .split(' ')
//     .join(sheetSymbol);
//   return bar;
// };

// const count = (ts: TimeSignature, subdivision = 4, sheetSymbol = '-') => {
//   const { numerator: beats, denominator: beatUnit } = ts;

//   const notes = rangeUp(1, beats);
//   // const subdivisionUnit = countUnit / beatUnit;
//   const sheet = '|' + notes.reduce((acc, cur) => acc + afterBeat(cur, sheetSymbol, subdivision), '') + '|';

//   console.log(sheet);
// };

// const ts = { numerator: 4, denominator: 4 };
// // count(ts, 4);

// const duple = `
// |       |
// |   |   |
// | 1 | 2 |
// |   |   |
// |       |
// `;
// const triple = `
// |           |
// |   |   |   |
// | 1 | 2 | 3 |
// |   |   |   |
// |           |`;
// const quadruple = `
// |               |
// |       |       |
// | 1 | 2 | 3 | 4 |
// |       |       |
// |               |
// `;

// const say = (arr: number[], interval: number) => {
//   if (arr.length == 0) return;
//   console.log(arr[0]);
//   setTimeout(() => {
//     say(arr.slice(1), 2000);
//   }, interval);
// };

// say([1, 2, 3, 4], 2000);
