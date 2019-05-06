import { gsum } from '../../base/math';
import { tokenize } from '../../base/strings';

/**
 * Note Value Model
 *
 * @short     {string} name without @type: <key><?dots>
 * @value       {string} duration value string: w|h|q|e|s|t
 * @relative  {number} quotient in respect to whole note. 2 - means half, 4 - means quarter, etc
 * @type      {string}  n | ttt | p | value kind can represent note, triplet or pause
 * @dots      {string} dotted part
 * @length     relative duration. 2n = 0.5, 4n = 0.25, 2n. = 0.75
 */
interface DurationProps {
  short: string; // h.
  value: string; // h
  relative: number; // 2
  type: string; // 'n'
  dots: string; // '.'
  length: number; // 0.75
}

interface Duration {
  props: DurationProps;
  half(): DurationProps;
  double(): DurationProps;
}

const DURATION_TYPES = {
  n: 'note',
  tr: 'triplet',
  p: 'rest',
};

const NOTE_VALUE_REGEX = /^(?<kind>([whqest]|1|2|4|8|16|32){1})(?<dots>\.{0,2})(?<type>:(n|tr|p){1})$/;
const NOTE_DURATION_KEYS = 'w h q e s t'.split(' ');
const NOTE_DURATION_VALUES = [1, 2, 4, 8, 16, 32];

export const isValidDuration = (note: string): boolean => NOTE_VALUE_REGEX.test(note);

export const DurationProps = (note: string): DurationProps => {
  if (!isValidDuration(note)) return null;

  const tokens = tokenize(note, NOTE_VALUE_REGEX);
  const { kind, dots, type } = tokens;
  const value = Number.parseInt(kind) ? NOTE_DURATION_KEYS[NOTE_DURATION_VALUES.indexOf(+kind)] : kind;
  const relative = Number.parseInt(kind) ? +kind : NOTE_DURATION_VALUES[NOTE_DURATION_KEYS.indexOf(kind)];
  const short = '' + relative + type.slice(1) + dots;
  const length = gsum(1 / relative, 1 / 2, tokens.dots.length + 1);

  return Object.freeze({
    short,
    value,
    relative,
    type: type.slice(1),
    dots,
    length,
  });
};

export const Duration = (note: string | DurationProps): Duration => {
  const props = typeof note === 'string' ? DurationProps(note) : note;

  const half = () => DurationProps(`${props.relative * 2}${props.dots}:${props.type}`);
  const double = () => DurationProps(`${props.relative / 2}${props.dots}:${props.type}`);

  return Object.freeze({ props, half, double });
};
