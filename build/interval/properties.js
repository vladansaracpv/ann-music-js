"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const theory_1 = require("./theory");
const index_1 = require("../helpers/index");
class Properties {
    static props(str) {
        if (typeof str !== 'string')
            return theory_1.Theory.NO_INTERVAL;
        return Properties.cache[str] || (Properties.cache[str] = Properties.properties(str));
    }
}
Properties.properties = (str) => {
    const t = theory_1.Theory.tokenize(str);
    if (!t)
        return theory_1.Theory.NO_INTERVAL;
    const p = { num: +t[0], quality: t[1] };
    p['step'] = theory_1.Theory.numToStep(p.num);
    p['type'] = theory_1.Theory.TYPES[p['step']];
    if (p['type'] === 'M' && p.quality === 'P')
        return theory_1.Theory.NO_INTERVAL;
    p['name'] = `${p.num}${p.quality}`;
    p['direction'] = p.num < 0 ? -1 : 1;
    p['simple'] = p.num === 8 || p.num === -8 ? p.num : p['direction'] * (p['step'] + 1);
    p['alteration'] = theory_1.Theory.qToAlt(p['type'], p.quality);
    p['octave'] = Math.floor((Math.abs(p.num) - 1) / 7);
    p['semitones'] = p['direction'] * (theory_1.Theory.SIZES[p['step']] + p['alteration'] + 12 * p['octave']);
    p['chroma'] = ((p['direction'] * (theory_1.Theory.SIZES[p['step']] + p['alteration'])) % 12 + 12) % 12;
    return Object.freeze(p);
};
Properties.cache = {};
Properties.property = index_1.curry((name, note) => Properties.props(note)[name]);
Properties.ic = (ivl) => {
    let _ivl = ivl;
    if (typeof ivl === 'string')
        _ivl = Properties.props(_ivl).chroma;
    return typeof ivl === 'number' ? theory_1.Theory.CLASSES[_ivl % 12] : undefined;
};
Properties.simplify = (str) => {
    const p = Properties.props(str);
    if (p === theory_1.Theory.NO_INTERVAL)
        return undefined;
    return p.simple + p.quality;
};
Properties.build = ({ num, step, alteration, octave = 1, direction } = { num, step, alteration, octave, direction }) => {
    let _num_ = num;
    if (step !== undefined)
        _num_ = step + 1 + 7 * octave;
    if (_num_ === undefined)
        return undefined;
    const d = direction < 0 ? '-' : '';
    const type = theory_1.Theory.TYPES[theory_1.Theory.numToStep(_num_)];
    return d + _num_ + theory_1.Theory.altToQ(type, alteration);
};
Properties.invert = (str) => {
    const p = Properties.props(str);
    if (p === theory_1.Theory.NO_INTERVAL)
        return undefined;
    const _step = (7 - p.step) % 7;
    const _alteration = p.type === 'P' ? -p.alteration : -(p.alteration + 1);
    return Properties.build({ num: undefined, step: _step, alteration: _alteration, octave: p.octave, direction: p.direction });
};
Properties.fromSemitones = (num) => {
    const d = num < 0 ? -1 : 1;
    const n = Math.abs(num);
    const c = n % 12;
    const o = Math.floor(n / 12);
    return d * (theory_1.Theory.IN[c] + 7 * o) + theory_1.Theory.IQ[c];
};
exports.Properties = Properties;
exports.num = interval => Properties.props(interval).num;
exports.quality = interval => Properties.props(interval).quality;
exports.step = interval => Properties.props(interval).step;
exports.type = interval => Properties.props(interval).type;
exports.tonal = interval => Properties.props(interval).tonal;
exports.short = interval => Properties.props(interval).short;
exports.direction = interval => Properties.props(interval).direction;
exports.simple = interval => Properties.props(interval).simple;
exports.alteration = interval => Properties.props(interval).alteration;
exports.semitones = interval => Properties.props(interval).semitones;
exports.chroma = interval => Properties.props(interval).chroma;
//# sourceMappingURL=properties.js.map