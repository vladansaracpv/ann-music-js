"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
const theory_1 = require("./theory");
const validator_1 = require("./validator");
const factory_1 = require("./factory");
class Properties {
}
/**
 *  Create note object by parsing note string
 *
 *  @function
 *
 *  @param {string} note        Note string
 *
 *  @return {object}            Note object
 *
 */
Properties.props = (noteName) => {
    const tokens = theory_1.Theory.parse(noteName);
    if (!tokens)
        return theory_1.Theory.EMPTY_NOTE;
    const { letter, accidental, octave, rest } = tokens;
    if (letter === '' || rest !== '')
        return theory_1.Theory.EMPTY_NOTE;
    const note = theory_1.Theory.EMPTY_NOTE;
    note.letter = letter.toUpperCase();
    note.accidental = accidental;
    note.octave = (octave ? Number.parseInt(octave) : 4);
    note.pc = helpers_1.glue(note.letter, note.accidental);
    note.name = helpers_1.glue(note.pc, note.octave);
    note.step = theory_1.Theory.LETTERS.indexOf(letter);
    note.alteration = (note.accidental.indexOf('b') > -1 ? -accidental.length : accidental.length);
    note.chroma = (theory_1.Theory.SEMI[note.step] + note.alteration + 120) % 12;
    note.midi = theory_1.Theory.SEMI[note.step] + note.alteration + 12 * (note.octave + 1);
    note.frequency = note.midi ? factory_1.FREQUENCY.fromMidi(note.midi) : undefined;
    return note;
};
/**
 *  Create note object by parsing note string
 *
 *  @function
 *
 *  @param {string} property    Note property
 *  @param {string} note        Note string
 *
 *  @return {any}               Note property
 *
 */
Properties.property = helpers_1.curry((name, note) => Properties.props(note)[name]);
/**
 *  Return note in simplified notation if possible.
 *
 *  @function
 *
 *  @param {string}  note               Note frequency
 *  @param {boolean} [sameAcc = true]   Should the note be created with sharps
 *
 *  @return {any}                       Note object
 *
 */
Properties.simplify = (note, sameAcc = true) => {
    const ifMidi = validator_1.Validator.isMidi(Properties.property('midi', note));
    const hasSharps = Properties.property('alteration', note) > -1;
    const useSharps = (sameAcc ? hasSharps : !hasSharps);
    const fromMidi = note => factory_1.NAME.fromMidi(note, useSharps);
    const nameFromMidi = helpers_1.compose(fromMidi, Properties.property('midi'))(note);
    const nameFromPc = helpers_1.compose(Properties.property('pc'), fromMidi, Properties.property('chroma'))(note);
    return helpers_1.either(nameFromMidi, nameFromPc, ifMidi);
};
/**
 *  Return enharmonic note of given note
 *
 *  @function
 *
 *  @param {string}  note               Note string
 *
 *  @return {string}                    Note object
 *
 */
Properties.enharmonic = (note) => Properties.simplify(note, false);
exports.Properties = Properties;
// Getters for note properties
exports.name = note => Properties.props(note).name;
exports.letter = note => Properties.props(note).letter;
exports.accidental = note => Properties.props(note).accidental;
exports.octave = note => Properties.props(note).octave;
exports.pc = note => Properties.props(note).pc;
exports.step = note => Properties.props(note).step;
exports.alteration = note => Properties.props(note).alteration;
exports.chroma = note => Properties.props(note).chroma;
exports.midi = note => Properties.props(note).midi;
exports.frequency = note => Properties.props(note).frequency;
//# sourceMappingURL=properties.js.map