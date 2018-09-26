import { Theory } from './theory';
import { curry } from '../helpers/index';

export class Properties {
    
  static properties = str => {
    const t = Theory.tokenize(str);
    if (!t) return Theory.NO_INTERVAL;

    const p = { number: +t[0], quality: t[1] };
    p['step'] = Theory.numToStep(p.number);
    p['type'] = Theory.TYPES[p['step']];
    if (p['type'] === 'M' && p.quality === 'P') return Theory.NO_INTERVAL;
      
    p['name'] = '' + p.number + p.quality;
    p['direction'] = p.number < 0 ? -1 : 1;
    p['simple'] = p.number === 8 || p.number === -8 ? p.number : p['direction'] * (p['step'] + 1);
    p['alteration'] = Theory.qToAlt(p['type'], p.quality);
    p['octave'] = Math.floor((Math.abs(p.number) - 1) / 7);
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

  static ic = ivl => {
    if (typeof ivl === 'string') ivl = Properties.props(ivl).chroma;
    return typeof ivl === 'number' ? Theory.CLASSES[ivl % 12] : undefined;
  };

  static simplify = str => {
    const p = Properties.props(str);
    if (p === Theory.NO_INTERVAL) return undefined;
    return p.simple + p.quality;
  };

  static build = ({ number, step, alteration, octave = 1, direction } = {number, step, alteration, octave, direction}) => {
    if (step !== undefined) number = step + 1 + 7 * octave;
    if (number === undefined) return null;
      
    const d = direction < 0 ? "-" : "";
    const type = Theory.TYPES[Theory.numToStep(number)];
    return d + number + Theory.altToQ(type, alteration);
  };
      
  static invert = str => {
    const p = Properties.props(str);
    if (p === Theory.NO_INTERVAL) return undefined;
    const step = (7 - p.step) % 7;
    const alteration = p.type === "P" ? -p.alteration : -(p.alteration + 1);
    return Properties.build({ number: undefined, step, alteration, octave: p.octave, direction: p.direction });
  };
            
  static fromSemitones = num => {
    const d = num < 0 ? -1 : 1;
    const n = Math.abs(num);
    const c = n % 12;
    const o = Math.floor(n / 12);
    return d * (Theory.IN[c] + 7 * o) + Theory.IQ[c];
  };
}

export const number = interval => Properties.props(interval).number;
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

console.log(Properties.invert('M3'));
