import { Theory } from './theory';
import { curry } from '../helpers/index';

export class Properties {

  static properties = (str) => {
    const t = Theory.tokenize(str);
    if (!t) return Theory.NO_INTERVAL;

    const p = { num: +t[0], quality: t[1] };
    p['step'] = Theory.numToStep(p.num);
    p['type'] = Theory.TYPES[p['step']];
    if (p['type'] === 'M' && p.quality === 'P') return Theory.NO_INTERVAL;

    p['name'] = `${p.num}${p.quality}`;
    p['direction'] = p.num < 0 ? -1 : 1;
    p['simple'] = p.num === 8 || p.num === -8 ? p.num : p['direction'] * (p['step'] + 1);
    p['alteration'] = Theory.qToAlt(p['type'], p.quality);
    p['octave'] = Math.floor((Math.abs(p.num) - 1) / 7);
    p['semitones'] = p['direction'] * (Theory.SIZES[p['step']] + p['alteration'] + 12 * p['octave']);
    p['chroma'] = ((p['direction'] * (Theory.SIZES[p['step']] + p['alteration'])) % 12 + 12) % 12;
    return Object.freeze(p);
  };

  static cache = {};

  static props(str) {
    if (typeof str !== 'string') return Theory.NO_INTERVAL;
    return Properties.cache[str] || (Properties.cache[str] = Properties.properties(str));
  }

  static property = curry((name, note) => Properties.props(note)[name]);

  static ic = (ivl) => {
    let _ivl = ivl;
    if (typeof ivl === 'string') _ivl = Properties.props(_ivl).chroma;
    return typeof ivl === 'number' ? Theory.CLASSES[_ivl % 12] : undefined;
  };

  static simplify = (str) => {
    const p = Properties.props(str);
    if (p === Theory.NO_INTERVAL) return undefined;
    return p.simple + p.quality;
  };

  static build = ({ num, step, alteration, octave = 1, direction } = { num, step, alteration, octave, direction }) => {
    let _num_ = num;
    if (step !== undefined) _num_ = step + 1 + 7 * octave;
    if (_num_ === undefined) return undefined;

    const d = direction < 0 ? '-' : '';
    const type = Theory.TYPES[Theory.numToStep(_num_)];
    return d + _num_ + Theory.altToQ(type, alteration);
  };

  static invert = (str) => {
    const p = Properties.props(str);
    if (p === Theory.NO_INTERVAL) return undefined;
    const _step = (7 - p.step) % 7;
    const _alteration = p.type === 'P' ? -p.alteration : -(p.alteration + 1);
    return Properties.build({ num: undefined,  step: _step, alteration: _alteration, octave: p.octave, direction: p.direction });
  };

  static fromSemitones = (num) => {
    const d = num < 0 ? -1 : 1;
    const n = Math.abs(num);
    const c = n % 12;
    const o = Math.floor(n / 12);
    return d * (Theory.IN[c] + 7 * o) + Theory.IQ[c];
  };
}

export const num = interval => Properties.props(interval).num;
export const quality = interval => Properties.props(interval).quality;
export const step = interval => Properties.props(interval).step;
export const type = interval => Properties.props(interval).type;
export const tonal = interval => Properties.props(interval).tonal;
export const short = interval => Properties.props(interval).short;
export const direction = interval => Properties.props(interval).direction;
export const simple = interval => Properties.props(interval).simple;
export const alteration = interval => Properties.props(interval).alteration;
export const semitones = interval => Properties.props(interval).semitones;
export const chroma = interval => Properties.props(interval).chroma;

