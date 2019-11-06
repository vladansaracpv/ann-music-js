import { BaseFunctional, BaseStrings, BaseMaths } from 'ann-music-base';

const { compose, compose2 } = BaseFunctional;
const { gsum } = BaseMaths;
const { tokenize } = BaseStrings;

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
