// import { Duration } from './duration';
// import { Euclid } from './euclid';

// export enum MeterType {
//   Simple = 'simple',
//   Compound = 'compound',
//   Odd = 'odd',
// }

// export class Meter {
//   top: number;
//   bottom: number;
//   type: MeterType;
//   numOfBeats: number;
//   beat: string[];

//   getBeatValue = () =>
//     this.type == MeterType.Compound ? Duration.valueToName(this.bottom).repeat(3) : this.beat.join(' ');
//   getNumOfBeats = () => this.numOfBeats;
//   getType = () => this.type;

//   constructor(top: number, bottom: number) {
//     this.top = top;
//     this.bottom = bottom;
//     this.setType();
//   }

//   properties = () => ({
//     top: this.top,
//     bottom: this.bottom,
//     type: this.type,
//     numOfBeats: this.numOfBeats,
//     beat: this.beat,
//   });

//   setType = () => {
//     if (Meter.isCompound(this.top, this.bottom)) return this.createCompound();
//     if (Meter.isSimple(this.top, this.bottom)) return this.createSimple();
//     return this.createOdd();
//   };

//   static isCompound = (top: number, bottom: number): boolean => {
//     return top % 3 === 0 && top > 3;
//   };

//   static isSimple = (top: number, bottom: number): boolean => {
//     return top < 5;
//   };

//   createSimple = () => {
//     this.type = MeterType.Simple;
//     this.numOfBeats = this.top;
//     this.beat = [Duration.valueToName(this.bottom)];
//   };

//   createCompound = () => {
//     this.type = MeterType.Compound;
//     this.numOfBeats = this.top / 3;
//     this.beat = [Duration.valueToName(Duration.doubleValue(this.bottom)) + '.'];
//   };

//   createOdd = () => {
//     this.type = MeterType.Odd;
//     this.numOfBeats = Math.ceil(this.top / 3);
//     const name = Duration.valueToName(Duration.doubleValue(this.bottom));
//     var arr: string = Euclid(this.numOfBeats, this.top, false).join('');
//     arr = arr.replace(/100/g, name + '.').replace(/10/g, name + ' ');

//     const groups = arr.split(' ').map(group => ((group[1] || ' ') === '.' ? [group[0], '.'] : [group, '']));

//     this.beat = [arr];
//   };
// }
