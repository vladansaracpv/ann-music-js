"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var theory_1 = require("./theory");
var index_1 = require("../helpers/index");
var Properties = /** @class */ (function () {
    function Properties() {
    }
    Properties.props = function (str) {
        if (typeof str !== 'string')
            return theory_1.Theory.NO_INTERVAL;
        return Properties.cache[str] || (Properties.cache[str] = Properties.properties(str));
    };
    Properties.properties = function (str) {
        var t = theory_1.Theory.tokenize(str);
        if (!t)
            return theory_1.Theory.NO_INTERVAL;
        var p = { num: +t[0], quality: t[1] };
        p['step'] = theory_1.Theory.numToStep(p.num);
        p['type'] = theory_1.Theory.TYPES[p['step']];
        if (p['type'] === 'M' && p.quality === 'P')
            return theory_1.Theory.NO_INTERVAL;
        p['name'] = "" + p.num + p.quality;
        p['direction'] = p.num < 0 ? -1 : 1;
        p['simple'] = p.num === 8 || p.num === -8 ? p.num : p['direction'] * (p['step'] + 1);
        p['alteration'] = theory_1.Theory.qToAlt(p['type'], p.quality);
        p['octave'] = Math.floor((Math.abs(p.num) - 1) / 7);
        p['semitones'] = p['direction'] * (theory_1.Theory.SIZES[p['step']] + p['alteration'] + 12 * p['octave']);
        p['chroma'] = ((p['direction'] * (theory_1.Theory.SIZES[p['step']] + p['alteration'])) % 12 + 12) % 12;
        return Object.freeze(p);
    };
    Properties.cache = {};
    Properties.property = index_1.curry(function (name, note) { return Properties.props(note)[name]; });
    Properties.ic = function (ivl) {
        var _ivl = ivl;
        if (typeof ivl === 'string')
            _ivl = Properties.props(_ivl).chroma;
        return typeof ivl === 'number' ? theory_1.Theory.CLASSES[_ivl % 12] : undefined;
    };
    Properties.simplify = function (str) {
        var p = Properties.props(str);
        if (p === theory_1.Theory.NO_INTERVAL)
            return undefined;
        return p.simple + p.quality;
    };
    Properties.build = function (_a) {
        var _b = _a === void 0 ? { num: num, step: step, alteration: alteration, octave: octave, direction: direction } : _a, num = _b.num, step = _b.step, alteration = _b.alteration, _c = _b.octave, octave = _c === void 0 ? 1 : _c, direction = _b.direction;
        var _num_ = num;
        if (step !== undefined)
            _num_ = step + 1 + 7 * octave;
        if (_num_ === undefined)
            return undefined;
        var d = direction < 0 ? '-' : '';
        var type = theory_1.Theory.TYPES[theory_1.Theory.numToStep(_num_)];
        return d + _num_ + theory_1.Theory.altToQ(type, alteration);
    };
    Properties.invert = function (str) {
        var p = Properties.props(str);
        if (p === theory_1.Theory.NO_INTERVAL)
            return undefined;
        var _step = (7 - p.step) % 7;
        var _alteration = p.type === 'P' ? -p.alteration : -(p.alteration + 1);
        return Properties.build({ num: undefined, step: _step, alteration: _alteration, octave: p.octave, direction: p.direction });
    };
    Properties.fromSemitones = function (num) {
        var d = num < 0 ? -1 : 1;
        var n = Math.abs(num);
        var c = n % 12;
        var o = Math.floor(n / 12);
        return d * (theory_1.Theory.IN[c] + 7 * o) + theory_1.Theory.IQ[c];
    };
    return Properties;
}());
exports.Properties = Properties;
exports.num = function (interval) { return Properties.props(interval).num; };
exports.quality = function (interval) { return Properties.props(interval).quality; };
exports.step = function (interval) { return Properties.props(interval).step; };
exports.type = function (interval) { return Properties.props(interval).type; };
exports.tonal = function (interval) { return Properties.props(interval).tonal; };
exports.short = function (interval) { return Properties.props(interval).short; };
exports.direction = function (interval) { return Properties.props(interval).direction; };
exports.simple = function (interval) { return Properties.props(interval).simple; };
exports.alteration = function (interval) { return Properties.props(interval).alteration; };
exports.semitones = function (interval) { return Properties.props(interval).semitones; };
exports.chroma = function (interval) { return Properties.props(interval).chroma; };
//# sourceMappingURL=properties.js.map