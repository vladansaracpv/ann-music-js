import { compose2, compose } from '@base/functional';
import { tokenize } from '@base/strings';
import { gsum } from '@base/math';

type DurationValue = 1 | 2 | 4 | 8 | 16 | 32 | 0;
type DurationType = 'n' | 'r' | 't' | '';

interface DurationProps {
  note: string; // 4n.
  value: DurationValue; // 4
  type: DurationType; // n
  dots: string; // .
  relative: number; // 0.375
}

const EMPTY_DURATION: DurationProps = {
  note: '',
  value: 0,
  type: '',
  dots: '',
  relative: 0,
};

const VALUES = [1, 2, 4, 8, 16, 32];
const DURATION_REGEX = /^(?<Tvalue>16|32|[1248])(?<Ttype>[nrt])(?<Tdots>\.*)$/;

export const durationFromName = (name: string) => {
  const { Tvalue, Ttype, Tdots } = tokenize(name, DURATION_REGEX);
  if (!(Tvalue && Ttype)) return EMPTY_DURATION;

  const note = name;
  const value = +Tvalue;
  const type = Ttype;
  const dots = Tdots;
  const relative = gsum(1 / value, 0.5, dots.length + 1);

  return {
    note,
    value,
    type,
    dots,
    relative,
  };
};

export const durationFromValueType = (value: number, type: string) => {
  const note = '' + value + type;
  return durationFromName(note);
};

export const Duration = (props: Partial<DurationProps>) => {
  const { note, value, type } = props;
  const name = '' + value + type;

  if (DURATION_REGEX.test(note)) return durationFromName(note);

  if (DURATION_REGEX.test(name)) return durationFromName(name);

  return EMPTY_DURATION;
};

// export class Duration {
//   static NAMES = ['w', 'h', 'q', 'e', 's', 't'];
//   static VALUES = [1, 2, 4, 8, 16, 32];
//   static TYPES = ['n', 'r', 't'];

//   static valueIndex = (value: number) => {
//     return Duration.VALUES.indexOf(value);
//   };

//   static nameIndex = (name: string) => {
//     return Duration.NAMES.indexOf(name);
//   };

//   static nameToValue = (name: string) => {
//     const i = Duration.NAMES.indexOf(name);
//     return Duration.VALUES[i] || undefined;
//   };

//   static valueToName = (value: number) => {
//     const i = Duration.valueIndex(value);
//     return Duration.NAMES[i] || undefined;
//   };

//   static splitValue = (value: number) => {
//     const i = Duration.valueIndex(value);
//     return i > -1 ? Duration.VALUES[i + 1] : undefined;
//   };

//   static splitName = (name: string) => {
//     return compose2(Duration.splitValue, Duration.nameToValue);
//   };

//   static doubleValue = (value: number) => {
//     const i = Duration.valueIndex(value);
//     return i > -1 ? Duration.VALUES[i - 1] : undefined;
//   };

//   static doubleName = (name: string) => {
//     return compose(
//       Duration.valueToName,
//       Duration.doubleValue,
//       Duration.nameToValue,
//     )(name);
//   };

//   static toDuration = (value: number, duration: number) => {
//     if (value > duration) return undefined;
//     const [oldname, newName] = [Duration.valueToName(value), Duration.valueToName(duration)];
//     const places = duration / value - 1;
//     return oldname.concat('-'.repeat(places));
//   };

//   static toDurationN = (value: string, duration: string) => {
//     const nDuration = Duration.nameToValue(duration);
//     // return Duration.toDuration(Duration.nameToValue(value), nDuration);
//     const values = value
//       .split('')
//       .map(val => Duration.nameToValue(val))
//       .map(val => Duration.toDuration(val, nDuration))
//       .join('');
//     return values;
//   };
// }
