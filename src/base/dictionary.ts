import { pcset } from '../packages/pc';

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
    const chr = pcset(ivls);

    add(key, ivls, chr);
    if (alias) alias.forEach(a => add(a, ivls, chr));
  });
  const allKeys = Object.keys(data).sort();

  const dict = name => data[name];
  dict.names = (p?) => {
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

// export const pcset = combine(scale, chord);
const memo = (fn, cache = {}) => str => cache[str] || (cache[str] = fn(str));
