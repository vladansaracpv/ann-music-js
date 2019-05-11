type TSTop = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
type TSBottom = 2 | 4 | 8 | 16;

interface TS {
  top: TSTop;
  bottom: TSBottom;
}

type BeatGroup = 'duple' | 'triple' | 'quadruple';
type BeatDivision = 'simple' | 'compound';

export class TimeSignature {
  private top: TSTop;
  private bottom: TSBottom;
  private grouping: BeatGroup;
  private division: BeatDivision;

  public constructor(top: TSTop, bottom: TSBottom) {
    this.top = top;
    this.bottom = bottom;
    this.setMeter();
  }

  private setMeter = () => {
    this.setGrouping();
    this.setDivision();
  };

  public setGrouping = () => {
    switch (this.top) {
      case 2:
        this.grouping = 'duple';
        break;
      case 3:
        this.grouping = 'triple';
        break;
      case 4:
        this.grouping = 'quadruple';
        break;

      default:
        break;
    }
  };

  public setDivision = () => {
    if (this.top <= 4) this.division = 'simple';
    if (this.top >= 6 && this.top % 3 === 0) this.division = 'compound';
  };

  public getMeterType = () => `${this.division} ${this.grouping}`;
}

// const meterFromTimeSignature = (ts: TimeSignature) => {};

// const isDupleMeter = (ts: TimeSignature) => ts.top == 2;
// const isTripleMeter = (ts: TimeSignature) => ts.top == 3;
// const isQuadrupleMeter = (ts: TimeSignature) => ts.top == 4;

// const isSimpleMeter = (ts: TimeSignature) => ts.top <= 4;
// const isCompoundMeter = (ts: TimeSignature) => ts.top >= 6 && ts.top % 3 === 0;

// const meterByBeatNumber = ['single', 'duple', 'triple', 'quadruple'];
// const meterByBeatDivision = ['simple', 'compound'];

// const meter = (ts: TimeSignature) => {
//   if (isSimpleMeter(ts)) return 'simple';
//   if (isCompoundMeter(ts)) return 'compound';
//   return null;
// };

// import { NoteValueType, NoteValueModel, NoteValueFactory } from './duration';

// interface MeterType {
//     top: number;
//     bottom: number;
//     type: string;
//     unit: string;
//     groups: number[];
//     name: string;
// }

// type Meter = MeterType;

// enum Meters {
//     SIMPLE = 'simple',
//     COMPOUND = 'compound',
//     ODD = 'odd'
// };

// const GROUPS = ['-', '-', 'duple', 'triple', 'quadruple'];

// const meterType = (beats: number): string => {
//     if (beats < 5) return Meters.SIMPLE;
//     if ([6, 9, 12].includes(beats)) return Meters.COMPOUND;
//     return Meters.ODD;
// }

// const SimpleMeterFactory = (top: number, bottom: number): MeterType => {
//     return Object.freeze({
//         top,
//         bottom,
//         type: Meters.SIMPLE,
//         unit: `${bottom}n`,
//         groups: Array(top).fill(top / top),
//         name: `${Meters.SIMPLE} ${GROUPS[top]}`,
//     });
// }

// const CompoundMeterFactory = (top: number, bottom: number): MeterType => {
//     const beats = top / 3;
//     const groups = Array(beats).fill(top / beats);
//     const type = Meters.COMPOUND;
//     const unit = `${bottom / 2}n.`;
//     const name = `${type} ${GROUPS[beats]}`;
//     return Object.freeze({
//         top,
//         bottom,
//         type,
//         unit,
//         groups,
//         name,
//     });
// }

// const OddMeterFactory = (top: number, bottom: number): MeterType => {

//     const odd = (beats: number): number[] => {
//         if (beats === 5) return [2, 3];

//         return meterType(beats - 2) === Meters.ODD
//             ? [2, ...odd(beats - 2)]
//             : [...odd(beats - 3), 3];
//     }

//     return Object.freeze({
//         top,
//         bottom,
//         type: Meters.ODD,
//         unit: '',
//         groups: odd(top),
//         name: Meters.ODD,
//     });
// }

// const MeterFactory = (top: number, bottom: number): MeterType => {
//     const meter = meterType(top);
//     if (meter === Meters.SIMPLE) return SimpleMeterFactory(top, bottom);
//     if (meter === Meters.COMPOUND) return CompoundMeterFactory(top, bottom);
//     return OddMeterFactory(top, bottom);
// }

// const makeCount = (level: number) => (beat: number) => {
//     const marks = ['', '-', '-&-', '-e-&-a-']

//     return `${beat}${marks[level]}`;
// }

// const countBeat = (top: number, bottom: number) => {
//     return Array(top)
//         .fill(0)
//         .map((v, i) => (i + 1));
// }

// const sheet = (top: number, bottom: string, level: number) => {

//     const { relative, kind, dots, short } = NoteValueModel(bottom);

//     const _meter = countBeat(top, relative);

//     const count = _meter.map(makeCount(level)).join('');
//     const meter = _meter.map((v, i) => short + '-'.repeat(2 ** level - 1)).join('');

//     return [meter, count];

// }

// const euclid = function (onNotes, totalNotes) {
//     var groups = [];
//     for (var i = 0; i < totalNotes; i++) groups.push([Number(i < onNotes)]);

//     var l;
//     while (l = groups.length - 1) {
//         var start = 0, first = groups[0];
//         while (start < l && compareArrays(first, groups[start])) start++;
//         if (start === l) break;

//         var end = l, last = groups[l];
//         while (end > 0 && compareArrays(last, groups[end])) end--;
//         if (end === 0) break;

//         var count = Math.min(start, l - end);
//         groups = groups
//             .slice(0, count)
//             .map(function (group, i) { return group.concat(groups[l - i]); })
//             .concat(groups.slice(count, -count));
//     }
//     return [].concat.apply([], groups);
// };

// function compareArrays(a, b) {
//     // TODO: optimize
//     return JSON.stringify(a) === JSON.stringify(b);
// };

// export {
//     Meter,
//     MeterType,
//     MeterFactory,
//     countBeat,
//     sheet
// }
