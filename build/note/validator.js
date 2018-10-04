"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var theory_1 = require("./theory");
var helpers_1 = require("../helpers");
var Validator = /** @class */ (function () {
    function Validator() {
    }
    Validator.isKey = function (key) { return helpers_1.isMember(theory_1.Theory.KEYS, key); };
    Validator.isName = function (name) {
        var tokens = theory_1.Theory.parse(name);
        if (!tokens)
            return false;
        var letter = tokens.letter, accidental = tokens.accidental, octave = tokens.octave, rest = tokens.rest;
        return helpers_1.allTrue(Validator.isLetter(letter), Validator.isAccidental(accidental), Validator.isOctave(octave));
    };
    Validator.isLetter = function (letter) { return helpers_1.isMember(theory_1.Theory.LETTERS, letter); };
    Validator.isAccidental = function (accidental) {
        if (helpers_1.isEmpty(accidental))
            return true;
        if (!helpers_1.madeOfChar(accidental))
            return false;
        return '#b'.indexOf(helpers_1.firstLetter(accidental)) > -1;
    };
    Validator.isOctave = function (octave) { return helpers_1.allTrue(!helpers_1.isEmpty(octave), helpers_1.isInt(+octave)); };
    Validator.isPc = function (pc) { return (pc.length === 1 ? Validator.isLetter(pc) : helpers_1.allTrue(Validator.isLetter(pc[0]), Validator.isAccidental(pc.substring(1)))); };
    Validator.isStep = function (step) { return helpers_1.isInt(step) && helpers_1.inside(0, 6, step); };
    Validator.isAlteration = function (alteration) { return helpers_1.isInt(alteration); };
    Validator.isChroma = function (chroma) { return helpers_1.isInt(chroma) && helpers_1.inside(0, 11, chroma); };
    Validator.isMidi = function (midi) { return helpers_1.isInt(midi); };
    Validator.isFrequency = function (freq) { return helpers_1.isNum(freq); };
    return Validator;
}());
exports.Validator = Validator;
//# sourceMappingURL=validator.js.map