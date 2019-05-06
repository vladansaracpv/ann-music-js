export interface IvlProps {
  name: string;
  num: number;
  quality: string;
  alteration: number;
  step: number;
  direction: number;
  type: string;
  simple: number;
  semitones: number;
  chroma: number;
  octave: number;
  ic: number;
}

export const KEYS = [
  'name',
  'num',
  'quality',
  'step',
  'alteration',
  'direction',
  'type',
  'simple',
  'semitones',
  'chroma',
  'octave',
  'ic',
];

export const EMPTY_INTERVAL = {
  name: undefined,
  num: undefined,
  quality: undefined,
  step: undefined,
  alteration: undefined,
  direction: undefined,
  type: undefined,
  simple: undefined,
  semitones: undefined,
  chroma: undefined,
  octave: undefined,
  ic: undefined,
};

export const NO_INTERVAL = Object.freeze(EMPTY_INTERVAL);

export enum Quality {
  PERFECT = 'P',
  MAJOR = 'M',
  MINOR = 'm',
  AUGMENTED = 'A',
  DIMINISHED = 'd',
}

export const AUGMENTED_REGEX = /^A+$/;
export const DIMINISHED_REGEX = /^d+$/;

export const INTERVAL_TONAL = '(?<tn>[-+]?\\d+)(?<tq>d{1,4}|m|M|P|A{1,4})';
export const INTERVAL_QUALITY = '(?<qq>d{1,4}|m|M|P|A{1,4})(?<qn>[-+]?\\d+)';
export const REGEX = new RegExp(`^${INTERVAL_TONAL}|${INTERVAL_QUALITY}$`);

// 0 2 4 5 7 9 11
// C D E F G A B
export const INTERVAL_SIZES = [0, 2, 4, 5, 7, 9, 11];

// 0 2 4 5 7 9 11
// C D E F G A B
// P M M P P M M
export const INTERVAL_TYPES = 'PMMPPMM';

export const INTERVAL_CLASSES = [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0];

// '1P-2m-2M-3m-3M-4P-A4-5P-6m-6M-7m-7M-8P'
// 'C -Db-D -Eb- E-F -Gb-G -Ab-A -Bb-B -C '
// 'C -C#-D -D#- E-F -F#-G -G#-A -A#-B -C '
/**
 * Interval names notation
 */
export const INTERVAL_NAMES = '1P 2m 2M 3m 3M 4P A4 5P 6m 6M 7m 7M 8P'.split(' ');
export const INTERVAL_NUMBERS = [1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7];
export const INTERVAL_QUALITIES = 'P m M m M P d P m M m M'.split(' ');

const tokenize = (str: string, regex: string | RegExp) => (str.match(regex) ? str.match(regex)['groups'] : null);

/**
 * Parse Interval string
 * @param interval
 * @returns Object { num, quality }
 */
export const parseInterval = (interval: string) => {
  const tokens = tokenize(interval, REGEX);
  const num = +tokens['tn'] || +tokens['qn'];
  const quality = tokens['tq'] || tokens['qq'];
  if (!num && !quality) return null;

  return {
    num,
    quality,
  };
};
