import sdata from '../scale/scales.json';
import cdata from '../chord/chords.json';
import { chroma } from '../pc/index';

export const dictionary = raw => {
  const keys = Object.keys(raw).sort();
  const data = [];
  const index = [];

  const add = (name, ivls, chroma) => {
    data[name] = ivls;
    index[chroma] = index[chroma] || [];
    index[chroma].push(name);
  };

  keys.forEach(key => {
    const ivls = raw[key][0].split(' ');
    const alias = raw[key][1];
    const chr = chroma(ivls);

    add(key, ivls, chr);
    if (alias) alias.forEach(a => add(a, ivls, chr));
  });
  const allKeys = Object.keys(data).sort();

  const dict = name => data[name];
  dict.names = p => {
    if (typeof p === 'string') return (index[p] || []).slice();
    else return (p === true ? allKeys : keys).slice();
  };
  return dict;
};

export const combine = (a, b) => {
  const dict = name => a(name) || b(name);
  dict.names = p => a.names(p).concat(b.names(p));
  return dict;
};

/**
 * A dictionary of scales: a function that given a scale name (without tonic)
 * returns an array of intervals
 *
 * @function
 * @param {string} name
 * @return {Array} intervals
 * @example
 * import { scale } from "tonal-dictionary"
 * scale("major") // => ["1P", "2M", ...]
 * scale.names(); // => ["major", ...]
 */
export const scale = dictionary(sdata);

/**
 * A dictionary of chords: a function that given a chord type
 * returns an array of intervals
 *
 * @function
 * @param {string} type
 * @return {Array} intervals
 * @example
 * import { chord } from "tonal-dictionary"
 * chord("Maj7") // => ["1P", "3M", ...]
 * chord.names(); // => ["Maj3", ...]
 */
export const chord = dictionary(cdata);
export const pcset = combine(scale, chord);
