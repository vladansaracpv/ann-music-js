"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const theory_1 = require("./theory");
const helpers_1 = require("../helpers");
const properties_1 = require("./properties");
const error_1 = require("../error");
const index_1 = require("../helpers/index");
const dict = error_1.FactoryError.errorDict;
class LETTER {
}
LETTER.fromLetter = letter => letter;
LETTER.fromName = name => helpers_1.firstLetter(name);
LETTER.fromPc = pc => helpers_1.firstLetter(pc);
LETTER.fromChroma = chroma => helpers_1.compose(LETTER.fromPc, PC.FACTORY('chroma'))(chroma);
LETTER.fromMidi = midi => LETTER.fromChroma(midi % 12);
LETTER.fromFreq = freq => helpers_1.compose(LETTER.fromMidi, MIDI.FACTORY('freq'))(freq);
LETTER.fromStep = step => theory_1.Theory.LETTERS[step];
LETTER.fromAcc = acc => error_1.FactoryError.NO_FACT_FOR_PARAM('letter', 'accidental', acc);
LETTER.fromAlt = alt => error_1.FactoryError.NO_FACT_FOR_PARAM('letter', 'alteration', alt);
LETTER.fromOct = oct => error_1.FactoryError.NO_FACT_FOR_PARAM('letter', 'octave', oct);
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
LETTER.FACTORY = helpers_1.curry((fromProp, withValue) => LETTER.FROM[fromProp](withValue));
exports.LETTER = LETTER;
class STEP {
}
STEP.fromLetter = letter => theory_1.Theory.LETTERS.indexOf(letter);
STEP.fromName = name => helpers_1.compose(STEP.fromLetter, helpers_1.firstLetter)(name);
STEP.fromPc = pc => helpers_1.compose(STEP.fromLetter, helpers_1.firstLetter)(pc);
STEP.fromChroma = chroma => helpers_1.compose(STEP.fromPc, PC.FACTORY('chroma'))(chroma);
STEP.fromMidi = midi => STEP.fromChroma(midi % 12);
STEP.fromFreq = freq => helpers_1.compose(STEP.fromMidi, MIDI.FACTORY('freq'))(freq);
STEP.fromStep = step => theory_1.Theory.LETTERS[step];
STEP.fromAcc = acc => error_1.FactoryError.NO_FACT_FOR_PARAM('step', 'accidental', acc);
STEP.fromAlt = alt => error_1.FactoryError.NO_FACT_FOR_PARAM('step', 'alteration', alt);
STEP.fromOct = oct => error_1.FactoryError.NO_FACT_FOR_PARAM('step', 'octave', oct);
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
STEP.FACTORY = helpers_1.curry((fromProp, withValue) => STEP.FROM[fromProp](withValue));
exports.STEP = STEP;
class ACCIDENTAL {
}
ACCIDENTAL.fromName = name => name.length === 1 ? '' : name.substring(1);
ACCIDENTAL.fromAccidental = acc => acc;
ACCIDENTAL.fromPc = pc => ACCIDENTAL.fromName(pc);
ACCIDENTAL.fromAlt = alt => alt < 0 ? 'b'.repeat(alt) : '#'.repeat(alt);
ACCIDENTAL.fromChroma = chroma => helpers_1.compose(ACCIDENTAL.fromName, PC.FACTORY('chroma'))(chroma);
ACCIDENTAL.fromMidi = midi => helpers_1.compose(ACCIDENTAL.fromPc, PC.FACTORY('midi'))(midi);
ACCIDENTAL.fromFreq = freq => helpers_1.compose(ACCIDENTAL.fromMidi, MIDI.FACTORY('freq'))(freq);
ACCIDENTAL.fromLetter = letter => error_1.FactoryError.NO_FACT_FOR_PARAM('accidental', 'letter', letter);
ACCIDENTAL.fromStep = step => error_1.FactoryError.NO_FACT_FOR_PARAM('accidental', 'step', step);
ACCIDENTAL.fromOct = oct => error_1.FactoryError.NO_FACT_FOR_PARAM('accidental', 'octave', oct);
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
ACCIDENTAL.FACTORY = helpers_1.curry((fromProp, withValue) => ACCIDENTAL.FROM[fromProp](withValue));
exports.ACCIDENTAL = ACCIDENTAL;
class ALTERATION {
}
ALTERATION.fromAccidental = acc => helpers_1.firstLetter(`${acc} `) === '#' ? acc.length : -acc.length;
ALTERATION.fromName = name => name.length === 1 ? 0 : ALTERATION.fromAccidental(name.substring(1));
ALTERATION.fromPc = pc => ALTERATION.fromName(pc);
ALTERATION.fromAlt = alt => alt;
ALTERATION.fromChroma = chroma => helpers_1.compose(ALTERATION.fromName, PC.FACTORY('chroma'))(chroma);
ALTERATION.fromMidi = midi => helpers_1.compose(ALTERATION.fromPc, PC.FACTORY('midi'))(midi);
ALTERATION.fromFreq = freq => helpers_1.compose(ALTERATION.fromMidi, MIDI.FACTORY('freq'))(freq);
ALTERATION.fromLetter = letter => error_1.FactoryError.NO_FACT_FOR_PARAM('alteration', 'letter', letter);
ALTERATION.fromStep = step => error_1.FactoryError.NO_FACT_FOR_PARAM('alteration', 'step', step);
ALTERATION.fromOct = oct => error_1.FactoryError.NO_FACT_FOR_PARAM('alteration', 'octave', oct);
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
ALTERATION.FACTORY = helpers_1.curry((fromProp, withValue) => ALTERATION.FROM[fromProp](withValue));
exports.ALTERATION = ALTERATION;
class PC {
}
PC.fromName = name => name(name);
PC.fromPc = pc => pc;
PC.fromChroma = chroma => theory_1.Theory.SHARPS[chroma];
PC.fromMidi = midi => PC.fromChroma(midi % 12);
PC.fromFreq = freq => helpers_1.compose(PC.fromMidi, MIDI.FACTORY('freq'));
PC.fromLetter = letter => error_1.FactoryError.NEED_MORE_ARGS('pc', 'letter', letter, helpers_1.or(['accidental', 'alteration']));
PC.fromStep = step => error_1.FactoryError.NEED_MORE_ARGS('pc', 'step', step, helpers_1.or(['accidental', 'alteration']));
PC.fromAcc = acc => error_1.FactoryError.NEED_MORE_ARGS('pc', 'octave', acc, helpers_1.or(['letter', 'step']));
PC.fromAlt = alt => error_1.FactoryError.NEED_MORE_ARGS('pc', 'octave', alt, helpers_1.or(['letter', 'step']));
PC.fromOct = oct => error_1.FactoryError.NO_FACT_FOR_PARAM('pc', 'octave', oct);
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
PC.FACTORY = helpers_1.curry((fromProp, withValue) => PC.FROM[fromProp](withValue));
exports.PC = PC;
class CHROMA {
}
CHROMA.fromPc = pc => pc.indexOf('#') > 0 ? theory_1.Theory.SHARPS.indexOf(pc) : theory_1.Theory.FLATS.indexOf(pc);
CHROMA.fromName = name => properties_1.chroma(name);
CHROMA.fromChroma = chroma => chroma;
CHROMA.fromMidi = midi => CHROMA.fromChroma(midi % 12);
CHROMA.fromFreq = freq => helpers_1.compose(CHROMA.fromMidi, MIDI.FACTORY('freq'));
CHROMA.fromLetter = letter => error_1.FactoryError.NEED_MORE_ARGS('chroma', 'letter', letter, helpers_1.or(['accidental', 'alteration']));
CHROMA.fromStep = step => error_1.FactoryError.NEED_MORE_ARGS('chroma', 'step', step, helpers_1.or(['accidental', 'alteration']));
CHROMA.fromAcc = acc => error_1.FactoryError.NEED_MORE_ARGS('chroma', 'octave', acc, helpers_1.or(['letter', 'step']));
CHROMA.fromAlt = alt => error_1.FactoryError.NEED_MORE_ARGS('chroma', 'octave', alt, helpers_1.or(['letter', 'step']));
CHROMA.fromOct = oct => error_1.FactoryError.NO_FACT_FOR_PARAM('chroma', 'octave', oct);
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
CHROMA.FACTORY = helpers_1.curry((fromProp, withValue) => PC.FROM[fromProp](withValue));
exports.CHROMA = CHROMA;
class MIDI {
}
MIDI.fromName = name => properties_1.midi(name);
MIDI.fromMidi = midi => midi;
MIDI.fromFreq = (freq, tuning = 440) => {
    return Math.ceil(12 * Math.log2(freq / tuning) + 69);
};
MIDI.fromLetter = letter => error_1.FactoryError.NEED_MORE_ARGS('midi', 'letter', letter, helpers_1.and([helpers_1.or(['alteration', 'accidental']), helpers_1.or(['octave'])], true));
MIDI.fromStep = step => error_1.FactoryError.NEED_MORE_ARGS('midi', 'step', step, helpers_1.and([helpers_1.or(['alteration', 'accidental']), helpers_1.or(['octave'])], true));
MIDI.fromAccidental = acc => error_1.FactoryError.NEED_MORE_ARGS('midi', 'accidental', acc, helpers_1.and([helpers_1.or(['letter', 'step']), helpers_1.or(['octave'])], true));
MIDI.fromAlteration = alt => error_1.FactoryError.NEED_MORE_ARGS('midi', 'alteration', alt, helpers_1.and([helpers_1.or(['letter', 'step']), helpers_1.or(['octave'])], true));
MIDI.fromPc = pc => error_1.FactoryError.NEED_MORE_ARGS('midi', 'pc', pc, helpers_1.and(['octave']));
MIDI.fromChroma = chroma => error_1.FactoryError.NEED_MORE_ARGS('midi', 'chroma', chroma, helpers_1.and(['octave']));
MIDI.fromOctave = oct => error_1.FactoryError.NEED_MORE_ARGS('midi', 'octave', oct, helpers_1.and([helpers_1.or(['letter', 'step']), helpers_1.or(['alteration', 'accidental'])], true));
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
MIDI.FACTORY = helpers_1.curry((fromProp, withValue) => MIDI.FROM[fromProp](withValue));
exports.MIDI = MIDI;
class FREQUENCY {
}
FREQUENCY.fromMidi = (midi, tuning = 440) => {
    return Math.pow(2, ((midi - 69) / 12)) * tuning;
};
FREQUENCY.fromName = name => properties_1.frequency(name);
FREQUENCY.fromFreq = (freq, tuning = 440) => freq;
FREQUENCY.fromLetter = letter => error_1.FactoryError.NEED_MORE_ARGS('frequency', 'letter', letter, helpers_1.and([helpers_1.or(['alteration', 'accidental']), helpers_1.or(['octave'])], true));
FREQUENCY.fromStep = step => error_1.FactoryError.NEED_MORE_ARGS('frequency', 'step', step, helpers_1.and([helpers_1.or(['alteration', 'accidental']), helpers_1.or(['octave'])], true));
FREQUENCY.fromAccidental = acc => error_1.FactoryError.NEED_MORE_ARGS('frequency', 'accidental', acc, helpers_1.and([helpers_1.or(['letter', 'step']), helpers_1.or(['octave'])], true));
FREQUENCY.fromAlteration = alt => error_1.FactoryError.NEED_MORE_ARGS('frequency', 'alteration', alt, helpers_1.and([helpers_1.or(['letter', 'step']), helpers_1.or(['octave'])], true));
FREQUENCY.fromPc = pc => error_1.FactoryError.NEED_MORE_ARGS('frequency', 'pc', pc, helpers_1.and(['octave']));
FREQUENCY.fromChroma = chroma => error_1.FactoryError.NEED_MORE_ARGS('frequency', 'chroma', chroma, helpers_1.and(['octave']));
FREQUENCY.fromOctave = oct => error_1.FactoryError.NEED_MORE_ARGS('frequency', 'octave', oct, helpers_1.and([helpers_1.or(['letter', 'step']), helpers_1.or(['alteration', 'accidental'])], true));
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
FREQUENCY.FACTORY = helpers_1.curry((fromProp, withValue) => FREQUENCY.FROM[fromProp](withValue));
exports.FREQUENCY = FREQUENCY;
class OCTAVE {
}
OCTAVE.fromName = name => properties_1.octave(name);
OCTAVE.fromOctave = octave => octave;
OCTAVE.fromMidi = midi => Math.floor(midi / 12) - 1;
OCTAVE.fromFreq = freq => helpers_1.compose(OCTAVE.fromMidi, MIDI.FACTORY('freq'))(freq);
OCTAVE.fromLetter = letter => error_1.FactoryError.NO_FACT_FOR_PARAM('octave', 'letter', letter);
OCTAVE.fromAcc = acc => error_1.FactoryError.NO_FACT_FOR_PARAM('octave', 'accidental', acc);
OCTAVE.fromPc = pc => error_1.FactoryError.NO_FACT_FOR_PARAM('octave', 'pc', pc);
OCTAVE.fromStep = step => error_1.FactoryError.NO_FACT_FOR_PARAM('octave', 'step', step);
OCTAVE.fromAlt = alt => error_1.FactoryError.NO_FACT_FOR_PARAM('octave', 'alteration', alt);
OCTAVE.fromChroma = chroma => error_1.FactoryError.NO_FACT_FOR_PARAM('octave', 'chroma', chroma);
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
OCTAVE.FACTORY = helpers_1.curry((fromProp, withValue) => OCTAVE.FROM[fromProp](withValue));
exports.OCTAVE = OCTAVE;
class NAME {
}
NAME.fromName = name => name;
NAME.fromOct = oct => error_1.FactoryError.NEED_MORE_ARGS('name', 'octave', oct, helpers_1.and(['pc'], true));
NAME.fromMidi = (midi, useSharps = true) => {
    const _midi_ = Math.round(midi) % 12;
    const _midi = Math.round(midi) / 12;
    const pc = index_1.either(theory_1.Theory.SHARPS[_midi_], theory_1.Theory.FLATS[_midi_], useSharps);
    const o = Math.floor(_midi) - 1;
    return pc + o;
};
NAME.fromFreq = freq => helpers_1.compose(NAME.fromMidi, MIDI.FACTORY('freq'))(freq);
NAME.fromLetter = letter => error_1.FactoryError.NEED_MORE_ARGS('name', 'letter', letter, helpers_1.and([helpers_1.or(['alteration', 'accidental']), helpers_1.or(['octave'])], true));
NAME.fromStep = step => error_1.FactoryError.NEED_MORE_ARGS('name', 'step', step, helpers_1.and([helpers_1.or(['alteration', 'accidental']), helpers_1.or(['octave'])], true));
NAME.fromAcc = acc => error_1.FactoryError.NEED_MORE_ARGS('name', 'accidental', acc, helpers_1.and([helpers_1.or(['letter', 'step']), helpers_1.or(['octave'])], true));
NAME.fromAlt = alt => error_1.FactoryError.NEED_MORE_ARGS('name', 'alteration', alt, helpers_1.and([helpers_1.or(['letter', 'step']), helpers_1.or(['octave'])], true));
NAME.fromPc = pc => error_1.FactoryError.NEED_MORE_ARGS('name', 'pc', pc, helpers_1.and(['octave'], true));
NAME.fromChroma = chroma => error_1.FactoryError.NEED_MORE_ARGS('name', 'chroma', chroma, helpers_1.and(['octave'], true));
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
NAME.FACTORY = helpers_1.curry((fromProp, withValue) => NAME.FROM[fromProp](withValue));
exports.NAME = NAME;
const NOTE_PROP_FACTORY_DICT = {
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
exports.NOTE_PROP_FACTORY = helpers_1.curry((whatProp, fromProp, withValue) => {
    return NOTE_PROP_FACTORY_DICT[whatProp](fromProp, withValue);
});
//# sourceMappingURL=factory.js.map