"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Theory = /** @class */ (function () {
    function Theory() {
    }
    // Note properties
    Theory.KEYS = [
        'name',
        'letter',
        'accidental',
        'octave',
        'pc',
        'step',
        'alteration',
        'chroma',
        'midi',
        'frequency'
    ];
    Theory.EMPTY_NOTE = {
        name: undefined,
        letter: undefined,
        accidental: undefined,
        octave: undefined,
        pc: undefined,
        step: undefined,
        alteration: undefined,
        chroma: undefined,
        midi: undefined,
        frequency: undefined
    };
    Theory.NO_NOTE = Object.freeze({
        name: undefined,
        letter: undefined,
        accidental: undefined,
        octave: undefined,
        pc: undefined,
        step: undefined,
        alteration: undefined,
        chroma: undefined,
        midi: undefined,
        frequency: undefined
    });
    // Regular expression for parsing notes. Note => [letter, accidental, octave, rest]
    Theory.REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;
    // Letters used for tone note names
    Theory.LETTERS = 'CDEFGAB';
    // Accidentals symbols. # - sharps, b - flats
    Theory.ACCIDENTALS = '# b'.split(' ');
    // All note names. Both sharps and flats
    Theory.ALL_NOTES = 'C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B'.split(' ');
    // Only sharp notes
    Theory.SHARPS_ONLY = Theory.ALL_NOTES.filter(function (x) { return x.includes('#'); });
    // Only flat notes
    Theory.FLATS_ONLY = Theory.ALL_NOTES.filter(function (x) { return x.includes('b'); });
    // Only natural notes (without sharps or flats)
    Theory.NATURALS_ONLY = Theory.ALL_NOTES.filter(function (x) { return x.length === 1; });
    // Natural + Sharps
    Theory.SHARPS = Theory.ALL_NOTES.filter(function (x) { return Theory.FLATS_ONLY.indexOf(x) === -1; });
    // Natural + Flats
    Theory.FLATS = Theory.ALL_NOTES.filter(function (x) { return Theory.SHARPS_ONLY.indexOf(x) === -1; });
    // Natural notes positions in C chromatic scale
    Theory.SEMI = [0, 2, 4, 5, 7, 9, 11];
    /**
     *  Parse note from string
     *
     *  @function
     *
     *  @param {string} note        Note string
     *
     *  @return {object}            Object of { letter, accidental, octave, rest }
     *
     */
    Theory.parse = function (note) {
        if (note === void 0) { note = ''; }
        var props = Theory.REGEX.exec(note);
        if (!props || props[4] !== '')
            return undefined;
        return {
            letter: props[1].toUpperCase(),
            accidental: props[2].replace(/x/g, '##'),
            octave: props[3],
            rest: props[4]
        };
    };
    return Theory;
}());
exports.Theory = Theory;
//# sourceMappingURL=theory.js.map