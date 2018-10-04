"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var theory_1 = require("./theory");
var helpers_1 = require("../helpers");
var properties_1 = require("./properties");
var error_1 = require("../error");
var index_1 = require("../helpers/index");
var dict = error_1.FactoryError.errorDict;
var LETTER = /** @class */ (function () {
    function LETTER() {
    }
    LETTER.fromLetter = function (letter) { return letter; };
    LETTER.fromName = function (name) { return helpers_1.firstLetter(name); };
    LETTER.fromPc = function (pc) { return helpers_1.firstLetter(pc); };
    LETTER.fromChroma = function (chroma) { return helpers_1.compose(LETTER.fromPc, PC.FACTORY('chroma'))(chroma); };
    LETTER.fromMidi = function (midi) { return LETTER.fromChroma(midi % 12); };
    LETTER.fromFreq = function (freq) { return helpers_1.compose(LETTER.fromMidi, MIDI.FACTORY('freq'))(freq); };
    LETTER.fromStep = function (step) { return theory_1.Theory.LETTERS[step]; };
    LETTER.fromAcc = function (acc) { return error_1.FactoryError.NO_FACT_FOR_PARAM('letter', 'accidental', acc); };
    LETTER.fromAlt = function (alt) { return error_1.FactoryError.NO_FACT_FOR_PARAM('letter', 'alteration', alt); };
    LETTER.fromOct = function (oct) { return error_1.FactoryError.NO_FACT_FOR_PARAM('letter', 'octave', oct); };
    LETTER.FROM = {
        letter: LETTER.fromLetter,
        name: LETTER.fromName,
        pc: LETTER.fromPc,
        step: LETTER.fromStep,
        chroma: LETTER.fromChroma,
        midi: LETTER.fromMidi,
        frequency: LETTER.fromFreq,
        accidental: LETTER.fromAcc,
        alteration: LETTER.fromAlt,
        octave: LETTER.fromOct
    };
    LETTER.FACTORY = helpers_1.curry(function (fromProp, withValue) { return LETTER.FROM[fromProp](withValue); });
    return LETTER;
}());
exports.LETTER = LETTER;
var STEP = /** @class */ (function () {
    function STEP() {
    }
    STEP.fromLetter = function (letter) { return theory_1.Theory.LETTERS.indexOf(letter); };
    STEP.fromName = function (name) { return helpers_1.compose(STEP.fromLetter, helpers_1.firstLetter)(name); };
    STEP.fromPc = function (pc) { return helpers_1.compose(STEP.fromLetter, helpers_1.firstLetter)(pc); };
    STEP.fromChroma = function (chroma) { return helpers_1.compose(STEP.fromPc, PC.FACTORY('chroma'))(chroma); };
    STEP.fromMidi = function (midi) { return STEP.fromChroma(midi % 12); };
    STEP.fromFreq = function (freq) { return helpers_1.compose(STEP.fromMidi, MIDI.FACTORY('freq'))(freq); };
    STEP.fromStep = function (step) { return theory_1.Theory.LETTERS[step]; };
    STEP.fromAcc = function (acc) { return error_1.FactoryError.NO_FACT_FOR_PARAM('step', 'accidental', acc); };
    STEP.fromAlt = function (alt) { return error_1.FactoryError.NO_FACT_FOR_PARAM('step', 'alteration', alt); };
    STEP.fromOct = function (oct) { return error_1.FactoryError.NO_FACT_FOR_PARAM('step', 'octave', oct); };
    STEP.FROM = {
        letter: STEP.fromLetter,
        name: STEP.fromName,
        pc: STEP.fromPc,
        step: STEP.fromStep,
        chroma: STEP.fromChroma,
        midi: STEP.fromMidi,
        frequency: STEP.fromFreq,
        accidental: STEP.fromAcc,
        alteration: STEP.fromAlt,
        octave: STEP.fromOct
    };
    STEP.FACTORY = helpers_1.curry(function (fromProp, withValue) { return STEP.FROM[fromProp](withValue); });
    return STEP;
}());
exports.STEP = STEP;
var ACCIDENTAL = /** @class */ (function () {
    function ACCIDENTAL() {
    }
    ACCIDENTAL.fromName = function (name) { return name.length === 1 ? '' : name.substring(1); };
    ACCIDENTAL.fromAccidental = function (acc) { return acc; };
    ACCIDENTAL.fromPc = function (pc) { return ACCIDENTAL.fromName(pc); };
    ACCIDENTAL.fromAlt = function (alt) { return alt < 0 ? 'b'.repeat(alt) : '#'.repeat(alt); };
    ACCIDENTAL.fromChroma = function (chroma) { return helpers_1.compose(ACCIDENTAL.fromName, PC.FACTORY('chroma'))(chroma); };
    ACCIDENTAL.fromMidi = function (midi) { return helpers_1.compose(ACCIDENTAL.fromPc, PC.FACTORY('midi'))(midi); };
    ACCIDENTAL.fromFreq = function (freq) { return helpers_1.compose(ACCIDENTAL.fromMidi, MIDI.FACTORY('freq'))(freq); };
    ACCIDENTAL.fromLetter = function (letter) { return error_1.FactoryError.NO_FACT_FOR_PARAM('accidental', 'letter', letter); };
    ACCIDENTAL.fromStep = function (step) { return error_1.FactoryError.NO_FACT_FOR_PARAM('accidental', 'step', step); };
    ACCIDENTAL.fromOct = function (oct) { return error_1.FactoryError.NO_FACT_FOR_PARAM('accidental', 'octave', oct); };
    ACCIDENTAL.FROM = {
        accidental: ACCIDENTAL.fromAccidental,
        name: ACCIDENTAL.fromName,
        pc: ACCIDENTAL.fromPc,
        alteration: ACCIDENTAL.fromAlt,
        chroma: ACCIDENTAL.fromChroma,
        midi: ACCIDENTAL.fromMidi,
        frequency: ACCIDENTAL.fromFreq,
        letter: ACCIDENTAL.fromLetter,
        step: ACCIDENTAL.fromStep,
        octave: ACCIDENTAL.fromOct,
    };
    ACCIDENTAL.FACTORY = helpers_1.curry(function (fromProp, withValue) { return ACCIDENTAL.FROM[fromProp](withValue); });
    return ACCIDENTAL;
}());
exports.ACCIDENTAL = ACCIDENTAL;
var ALTERATION = /** @class */ (function () {
    function ALTERATION() {
    }
    ALTERATION.fromAccidental = function (acc) { return helpers_1.firstLetter(acc + " ") === '#' ? acc.length : -acc.length; };
    ALTERATION.fromName = function (name) { return name.length === 1 ? 0 : ALTERATION.fromAccidental(name.substring(1)); };
    ALTERATION.fromPc = function (pc) { return ALTERATION.fromName(pc); };
    ALTERATION.fromAlt = function (alt) { return alt; };
    ALTERATION.fromChroma = function (chroma) { return helpers_1.compose(ALTERATION.fromName, PC.FACTORY('chroma'))(chroma); };
    ALTERATION.fromMidi = function (midi) { return helpers_1.compose(ALTERATION.fromPc, PC.FACTORY('midi'))(midi); };
    ALTERATION.fromFreq = function (freq) { return helpers_1.compose(ALTERATION.fromMidi, MIDI.FACTORY('freq'))(freq); };
    ALTERATION.fromLetter = function (letter) { return error_1.FactoryError.NO_FACT_FOR_PARAM('alteration', 'letter', letter); };
    ALTERATION.fromStep = function (step) { return error_1.FactoryError.NO_FACT_FOR_PARAM('alteration', 'step', step); };
    ALTERATION.fromOct = function (oct) { return error_1.FactoryError.NO_FACT_FOR_PARAM('alteration', 'octave', oct); };
    ALTERATION.FROM = {
        accidental: ALTERATION.fromAccidental,
        name: ALTERATION.fromName,
        pc: ALTERATION.fromPc,
        alteration: ALTERATION.fromAlt,
        chroma: ALTERATION.fromChroma,
        midi: ALTERATION.fromMidi,
        frequency: ALTERATION.fromFreq,
        letter: ALTERATION.fromLetter,
        step: ALTERATION.fromStep,
        octave: ALTERATION.fromOct,
    };
    ALTERATION.FACTORY = helpers_1.curry(function (fromProp, withValue) { return ALTERATION.FROM[fromProp](withValue); });
    return ALTERATION;
}());
exports.ALTERATION = ALTERATION;
var PC = /** @class */ (function () {
    function PC() {
    }
    PC.fromName = function (name) { return name(name); };
    PC.fromPc = function (pc) { return pc; };
    PC.fromChroma = function (chroma) { return theory_1.Theory.SHARPS[chroma]; };
    PC.fromMidi = function (midi) { return PC.fromChroma(midi % 12); };
    PC.fromFreq = function (freq) { return helpers_1.compose(PC.fromMidi, MIDI.FACTORY('freq')); };
    PC.fromLetter = function (letter) { return error_1.FactoryError.NEED_MORE_ARGS('pc', 'letter', letter, helpers_1.or(['accidental', 'alteration'])); };
    PC.fromStep = function (step) { return error_1.FactoryError.NEED_MORE_ARGS('pc', 'step', step, helpers_1.or(['accidental', 'alteration'])); };
    PC.fromAcc = function (acc) { return error_1.FactoryError.NEED_MORE_ARGS('pc', 'octave', acc, helpers_1.or(['letter', 'step'])); };
    PC.fromAlt = function (alt) { return error_1.FactoryError.NEED_MORE_ARGS('pc', 'octave', alt, helpers_1.or(['letter', 'step'])); };
    PC.fromOct = function (oct) { return error_1.FactoryError.NO_FACT_FOR_PARAM('pc', 'octave', oct); };
    PC.FROM = {
        pc: PC.fromPc,
        name: PC.fromName,
        chroma: PC.fromChroma,
        midi: PC.fromMidi,
        frequency: PC.fromFreq,
        letter: PC.fromLetter,
        step: PC.fromStep,
        accidental: PC.fromAcc,
        alteration: PC.fromAlt,
        octave: PC.fromOct
    };
    PC.FACTORY = helpers_1.curry(function (fromProp, withValue) { return PC.FROM[fromProp](withValue); });
    return PC;
}());
exports.PC = PC;
var CHROMA = /** @class */ (function () {
    function CHROMA() {
    }
    CHROMA.fromPc = function (pc) { return pc.indexOf('#') > 0 ? theory_1.Theory.SHARPS.indexOf(pc) : theory_1.Theory.FLATS.indexOf(pc); };
    CHROMA.fromName = function (name) { return properties_1.chroma(name); };
    CHROMA.fromChroma = function (chroma) { return chroma; };
    CHROMA.fromMidi = function (midi) { return CHROMA.fromChroma(midi % 12); };
    CHROMA.fromFreq = function (freq) { return helpers_1.compose(CHROMA.fromMidi, MIDI.FACTORY('freq')); };
    CHROMA.fromLetter = function (letter) { return error_1.FactoryError.NEED_MORE_ARGS('chroma', 'letter', letter, helpers_1.or(['accidental', 'alteration'])); };
    CHROMA.fromStep = function (step) { return error_1.FactoryError.NEED_MORE_ARGS('chroma', 'step', step, helpers_1.or(['accidental', 'alteration'])); };
    CHROMA.fromAcc = function (acc) { return error_1.FactoryError.NEED_MORE_ARGS('chroma', 'octave', acc, helpers_1.or(['letter', 'step'])); };
    CHROMA.fromAlt = function (alt) { return error_1.FactoryError.NEED_MORE_ARGS('chroma', 'octave', alt, helpers_1.or(['letter', 'step'])); };
    CHROMA.fromOct = function (oct) { return error_1.FactoryError.NO_FACT_FOR_PARAM('chroma', 'octave', oct); };
    CHROMA.FROM = {
        pc: CHROMA.fromPc,
        name: CHROMA.fromName,
        chroma: CHROMA.fromChroma,
        midi: CHROMA.fromMidi,
        frequency: CHROMA.fromFreq,
        letter: CHROMA.fromLetter,
        step: CHROMA.fromStep,
        accidental: CHROMA.fromAcc,
        alteration: CHROMA.fromAlt,
        octave: CHROMA.fromOct
    };
    CHROMA.FACTORY = helpers_1.curry(function (fromProp, withValue) { return PC.FROM[fromProp](withValue); });
    return CHROMA;
}());
exports.CHROMA = CHROMA;
var MIDI = /** @class */ (function () {
    function MIDI() {
    }
    MIDI.fromName = function (name) { return properties_1.midi(name); };
    MIDI.fromMidi = function (midi) { return midi; };
    MIDI.fromFreq = function (freq, tuning) {
        if (tuning === void 0) { tuning = 440; }
        return Math.ceil(12 * Math.log2(freq / tuning) + 69);
    };
    MIDI.fromLetter = function (letter) { return error_1.FactoryError.NEED_MORE_ARGS('midi', 'letter', letter, helpers_1.and([helpers_1.or(['alteration', 'accidental']), helpers_1.or(['octave'])], true)); };
    MIDI.fromStep = function (step) { return error_1.FactoryError.NEED_MORE_ARGS('midi', 'step', step, helpers_1.and([helpers_1.or(['alteration', 'accidental']), helpers_1.or(['octave'])], true)); };
    MIDI.fromAccidental = function (acc) { return error_1.FactoryError.NEED_MORE_ARGS('midi', 'accidental', acc, helpers_1.and([helpers_1.or(['letter', 'step']), helpers_1.or(['octave'])], true)); };
    MIDI.fromAlteration = function (alt) { return error_1.FactoryError.NEED_MORE_ARGS('midi', 'alteration', alt, helpers_1.and([helpers_1.or(['letter', 'step']), helpers_1.or(['octave'])], true)); };
    MIDI.fromPc = function (pc) { return error_1.FactoryError.NEED_MORE_ARGS('midi', 'pc', pc, helpers_1.and(['octave'])); };
    MIDI.fromChroma = function (chroma) { return error_1.FactoryError.NEED_MORE_ARGS('midi', 'chroma', chroma, helpers_1.and(['octave'])); };
    MIDI.fromOctave = function (oct) { return error_1.FactoryError.NEED_MORE_ARGS('midi', 'octave', oct, helpers_1.and([helpers_1.or(['letter', 'step']), helpers_1.or(['alteration', 'accidental'])], true)); };
    MIDI.FROM = {
        midi: MIDI.fromMidi,
        frequency: MIDI.fromFreq,
        name: MIDI.fromName,
        letter: MIDI.fromLetter,
        step: MIDI.fromStep,
        accidental: MIDI.fromAccidental,
        alteration: MIDI.fromAlteration,
        pc: MIDI.fromPc,
        chroma: MIDI.fromChroma,
        octave: MIDI.fromOctave
    };
    MIDI.FACTORY = helpers_1.curry(function (fromProp, withValue) { return MIDI.FROM[fromProp](withValue); });
    return MIDI;
}());
exports.MIDI = MIDI;
var FREQUENCY = /** @class */ (function () {
    function FREQUENCY() {
    }
    FREQUENCY.fromMidi = function (midi, tuning) {
        if (tuning === void 0) { tuning = 440; }
        return Math.pow(2, ((midi - 69) / 12)) * tuning;
    };
    FREQUENCY.fromName = function (name) { return properties_1.frequency(name); };
    FREQUENCY.fromFreq = function (freq, tuning) {
        if (tuning === void 0) { tuning = 440; }
        return freq;
    };
    FREQUENCY.fromLetter = function (letter) { return error_1.FactoryError.NEED_MORE_ARGS('frequency', 'letter', letter, helpers_1.and([helpers_1.or(['alteration', 'accidental']), helpers_1.or(['octave'])], true)); };
    FREQUENCY.fromStep = function (step) { return error_1.FactoryError.NEED_MORE_ARGS('frequency', 'step', step, helpers_1.and([helpers_1.or(['alteration', 'accidental']), helpers_1.or(['octave'])], true)); };
    FREQUENCY.fromAccidental = function (acc) { return error_1.FactoryError.NEED_MORE_ARGS('frequency', 'accidental', acc, helpers_1.and([helpers_1.or(['letter', 'step']), helpers_1.or(['octave'])], true)); };
    FREQUENCY.fromAlteration = function (alt) { return error_1.FactoryError.NEED_MORE_ARGS('frequency', 'alteration', alt, helpers_1.and([helpers_1.or(['letter', 'step']), helpers_1.or(['octave'])], true)); };
    FREQUENCY.fromPc = function (pc) { return error_1.FactoryError.NEED_MORE_ARGS('frequency', 'pc', pc, helpers_1.and(['octave'])); };
    FREQUENCY.fromChroma = function (chroma) { return error_1.FactoryError.NEED_MORE_ARGS('frequency', 'chroma', chroma, helpers_1.and(['octave'])); };
    FREQUENCY.fromOctave = function (oct) { return error_1.FactoryError.NEED_MORE_ARGS('frequency', 'octave', oct, helpers_1.and([helpers_1.or(['letter', 'step']), helpers_1.or(['alteration', 'accidental'])], true)); };
    FREQUENCY.FROM = {
        midi: FREQUENCY.fromMidi,
        frequency: FREQUENCY.fromFreq,
        name: FREQUENCY.fromName,
        letter: FREQUENCY.fromLetter,
        step: FREQUENCY.fromStep,
        accidental: FREQUENCY.fromAccidental,
        alteration: FREQUENCY.fromAlteration,
        pc: FREQUENCY.fromPc,
        chroma: FREQUENCY.fromChroma,
        octave: FREQUENCY.fromOctave
    };
    FREQUENCY.FACTORY = helpers_1.curry(function (fromProp, withValue) { return FREQUENCY.FROM[fromProp](withValue); });
    return FREQUENCY;
}());
exports.FREQUENCY = FREQUENCY;
var OCTAVE = /** @class */ (function () {
    function OCTAVE() {
    }
    OCTAVE.fromName = function (name) { return properties_1.octave(name); };
    OCTAVE.fromOctave = function (octave) { return octave; };
    OCTAVE.fromMidi = function (midi) { return Math.floor(midi / 12) - 1; };
    OCTAVE.fromFreq = function (freq) { return helpers_1.compose(OCTAVE.fromMidi, MIDI.FACTORY('freq'))(freq); };
    OCTAVE.fromLetter = function (letter) { return error_1.FactoryError.NO_FACT_FOR_PARAM('octave', 'letter', letter); };
    OCTAVE.fromAcc = function (acc) { return error_1.FactoryError.NO_FACT_FOR_PARAM('octave', 'accidental', acc); };
    OCTAVE.fromPc = function (pc) { return error_1.FactoryError.NO_FACT_FOR_PARAM('octave', 'pc', pc); };
    OCTAVE.fromStep = function (step) { return error_1.FactoryError.NO_FACT_FOR_PARAM('octave', 'step', step); };
    OCTAVE.fromAlt = function (alt) { return error_1.FactoryError.NO_FACT_FOR_PARAM('octave', 'alteration', alt); };
    OCTAVE.fromChroma = function (chroma) { return error_1.FactoryError.NO_FACT_FOR_PARAM('octave', 'chroma', chroma); };
    OCTAVE.FROM = {
        octave: OCTAVE.fromOctave,
        name: OCTAVE.fromName,
        midi: OCTAVE.fromMidi,
        frequency: OCTAVE.fromFreq,
        letter: OCTAVE.fromLetter,
        accidental: OCTAVE.fromAcc,
        pc: OCTAVE.fromPc,
        step: OCTAVE.fromStep,
        alteration: OCTAVE.fromAlt,
        chroma: OCTAVE.fromChroma,
    };
    OCTAVE.FACTORY = helpers_1.curry(function (fromProp, withValue) { return OCTAVE.FROM[fromProp](withValue); });
    return OCTAVE;
}());
exports.OCTAVE = OCTAVE;
var NAME = /** @class */ (function () {
    function NAME() {
    }
    NAME.fromName = function (name) { return name; };
    NAME.fromOct = function (oct) { return error_1.FactoryError.NEED_MORE_ARGS('name', 'octave', oct, helpers_1.and(['pc'], true)); };
    NAME.fromMidi = function (midi, useSharps) {
        if (useSharps === void 0) { useSharps = true; }
        var _midi_ = Math.round(midi) % 12;
        var _midi = Math.round(midi) / 12;
        var pc = index_1.either(theory_1.Theory.SHARPS[_midi_], theory_1.Theory.FLATS[_midi_], useSharps);
        var o = Math.floor(_midi) - 1;
        return pc + o;
    };
    NAME.fromFreq = function (freq) { return helpers_1.compose(NAME.fromMidi, MIDI.FACTORY('freq'))(freq); };
    NAME.fromLetter = function (letter) { return error_1.FactoryError.NEED_MORE_ARGS('name', 'letter', letter, helpers_1.and([helpers_1.or(['alteration', 'accidental']), helpers_1.or(['octave'])], true)); };
    NAME.fromStep = function (step) { return error_1.FactoryError.NEED_MORE_ARGS('name', 'step', step, helpers_1.and([helpers_1.or(['alteration', 'accidental']), helpers_1.or(['octave'])], true)); };
    NAME.fromAcc = function (acc) { return error_1.FactoryError.NEED_MORE_ARGS('name', 'accidental', acc, helpers_1.and([helpers_1.or(['letter', 'step']), helpers_1.or(['octave'])], true)); };
    NAME.fromAlt = function (alt) { return error_1.FactoryError.NEED_MORE_ARGS('name', 'alteration', alt, helpers_1.and([helpers_1.or(['letter', 'step']), helpers_1.or(['octave'])], true)); };
    NAME.fromPc = function (pc) { return error_1.FactoryError.NEED_MORE_ARGS('name', 'pc', pc, helpers_1.and(['octave'], true)); };
    NAME.fromChroma = function (chroma) { return error_1.FactoryError.NEED_MORE_ARGS('name', 'chroma', chroma, helpers_1.and(['octave'], true)); };
    NAME.FROM = {
        name: NAME.fromName,
        midi: NAME.fromMidi,
        frequency: NAME.fromFreq,
        letter: NAME.fromLetter,
        accidental: NAME.fromAcc,
        octave: NAME.fromOct,
        pc: NAME.fromPc,
        step: NAME.fromStep,
        alteration: NAME.fromAlt,
        chroma: NAME.fromChroma,
    };
    NAME.FACTORY = helpers_1.curry(function (fromProp, withValue) { return NAME.FROM[fromProp](withValue); });
    return NAME;
}());
exports.NAME = NAME;
var NOTE_PROP_FACTORY_DICT = {
    name: NAME.FACTORY,
    letter: LETTER.FACTORY,
    accidental: ACCIDENTAL.FACTORY,
    octave: OCTAVE.FACTORY,
    pc: PC.FACTORY,
    step: STEP.FACTORY,
    alteration: ALTERATION.FACTORY,
    chroma: CHROMA.FACTORY,
    midi: MIDI.FACTORY,
    frequency: FREQUENCY.FACTORY
};
exports.NOTE_PROP_FACTORY = helpers_1.curry(function (whatProp, fromProp, withValue) {
    return NOTE_PROP_FACTORY_DICT[whatProp](fromProp, withValue);
});
//# sourceMappingURL=factory.js.map