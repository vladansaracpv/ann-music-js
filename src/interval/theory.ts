import { fillStr } from '../helpers/index';

export class Theory {

  static KEYS = [
    'num',
    'quality',
    'step',
    'type',
    'tonal',
    'short',
    'direction',
    'simple',
    'alteration',
    'semitones',
    'chroma',
  ];

  static EMPTY_INTERVAL = {
    num: undefined,
    quality: undefined,
    step: undefined,
    type: undefined,
    tonal: undefined,
    short: undefined,
    direction: undefined,
    simple: undefined,
    alteration: undefined,
    semitones: undefined,
    chroma: undefined,
  };

  static NO_INTERVAL = Object.freeze({
    num: undefined,
    quality: undefined,
    step: undefined,
    type: undefined,
    name_tonal: undefined,
    name_short: undefined,
    direction: undefined,
    simple: undefined,
    alteration: undefined,
    semitones: undefined,
    chroma: undefined,
  });

  static INTERVAL_TONAL = '([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})';
  static INTERVAL_SHORT = '(AA|A|P|M|m|d|dd)([-+]?\\d+)';
  static REGEX = `${Theory.INTERVAL_TONAL}|${Theory.INTERVAL_SHORT}$`;
  static INTERVAL_PATTERN = new RegExp(Theory.REGEX);
  static SIZES = [0, 2, 4, 5, 7, 9, 11];
  static TYPES = 'PMMPPMM';
  static CLASSES = [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];
  static IN = [1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7];
  static IQ = 'P m M m M P d P m M m M'.split(' ');
  static NAMES = '1P 2m 2M 3m 3M 4P 4A 5P 6m 6M 7m 7M'.split(' ');
  static NAMES_TONAL = '1P 2m 2M 3m 3M 4P 4A 5P 6m 6M 7m 7M'.split(' ');
  static NAMES_SHORT = 'P1 m2 M2 m3 M3 P4 A4 P5 m6 M6 m7 M7'.split(' ');

  static tokenize = (s) => {

    const props = Theory.INTERVAL_PATTERN.exec(s);
    if (!props) return undefined;
    return props[1] ? [props[1], props[2]] : [props[4], props[3]];
  }

  static qToAlt = (type, q) => {
    if (q === 'M' && type === 'M') return 0;
    if (q === 'P' && type === 'P') return 0;
    if (q === 'm' && type === 'M') return -1;
    if (/^A+$/.test(q)) return q.length;
    if (/^d+$/.test(q)) return type === 'P' ? -q.length : -q.length - 1;
    return undefined;
  }

  static altToQ = (type, alt) => {
    if (alt === 0) return type === 'M' ? 'M' : 'P';
    if (alt === -1 && type === 'M') return 'm';
    if (alt > 0) return fillStr('A', alt);
    if (alt < 0) return fillStr('d', type === 'P' ? alt : alt + 1);

    return undefined;
  };

  static numToStep = num => (Math.abs(num) - 1) % 7;
}
