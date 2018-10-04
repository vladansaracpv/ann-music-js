"use strict";
exports.__esModule = true;
var helpers_1 = require("../helpers");
var theory_1 = require("./theory");
var validator_1 = require("./validator");
var factory_1 = require("./factory");
var Properties = /** @class */ (function () {
    function Properties() {
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
    Properties.props = function (noteName) {
        var tokens = theory_1.Theory.parse(noteName);
        if (!tokens)
            return theory_1.Theory.EMPTY_NOTE;
        var letter = tokens.letter, accidental = tokens.accidental, octave = tokens.octave, rest = tokens.rest;
        if (letter === '' || rest !== '')
            return theory_1.Theory.EMPTY_NOTE;
        var note = theory_1.Theory.EMPTY_NOTE;
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
    Properties.property = helpers_1.curry(function (name, note) { return Properties.props(note)[name]; });
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
    Properties.simplify = function (note, sameAcc) {
        if (sameAcc === void 0) { sameAcc = true; }
        var ifMidi = validator_1.Validator.isMidi(Properties.property('midi', note));
        var hasSharps = Properties.property('alteration', note) > -1;
        var useSharps = (sameAcc ? hasSharps : !hasSharps);
        var fromMidi = function (note) { return factory_1.NAME.fromMidi(note, useSharps); };
        var nameFromMidi = helpers_1.compose(fromMidi, Properties.property('midi'))(note);
        var nameFromPc = helpers_1.compose(Properties.property('pc'), fromMidi, Properties.property('chroma'))(note);
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
    Properties.enharmonic = function (note) { return Properties.simplify(note, false); };
    return Properties;
}());
exports.Properties = Properties;
// Getters for note properties
exports.name = function (note) { return Properties.props(note).name; };
exports.letter = function (note) { return Properties.props(note).letter; };
exports.accidental = function (note) { return Properties.props(note).accidental; };
exports.octave = function (note) { return Properties.props(note).octave; };
exports.pc = function (note) { return Properties.props(note).pc; };
exports.step = function (note) { return Properties.props(note).step; };
exports.alteration = function (note) { return Properties.props(note).alteration; };
exports.chroma = function (note) { return Properties.props(note).chroma; };
exports.midi = function (note) { return Properties.props(note).midi; };
exports.frequency = function (note) { return Properties.props(note).frequency; };
