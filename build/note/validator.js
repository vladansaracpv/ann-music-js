"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const theory_1 = require("./theory");
const helpers_1 = require("../helpers");
class Validator {
}
Validator.isKey = key => helpers_1.isMember(theory_1.Theory.KEYS, key);
Validator.isName = (name) => {
    const tokens = theory_1.Theory.parse(name);
    if (!tokens)
        return false;
    const { letter, accidental, octave, rest } = tokens;
    return helpers_1.allTrue(Validator.isLetter(letter), Validator.isAccidental(accidental), Validator.isOctave(octave));
};
Validator.isLetter = letter => helpers_1.isMember(theory_1.Theory.LETTERS, letter);
Validator.isAccidental = (accidental) => {
    if (helpers_1.isEmpty(accidental))
        return true;
    if (!helpers_1.madeOfChar(accidental))
        return false;
    return '#b'.indexOf(helpers_1.firstLetter(accidental)) > -1;
};
Validator.isOctave = octave => helpers_1.allTrue(!helpers_1.isEmpty(octave), helpers_1.isInt(+octave));
Validator.isPc = pc => (pc.length === 1 ? Validator.isLetter(pc) : helpers_1.allTrue(Validator.isLetter(pc[0]), Validator.isAccidental(pc.substring(1))));
Validator.isStep = step => helpers_1.isInt(step) && helpers_1.inside(0, 6, step);
Validator.isAlteration = alteration => helpers_1.isInt(alteration);
Validator.isChroma = chroma => helpers_1.isInt(chroma) && helpers_1.inside(0, 11, chroma);
Validator.isMidi = midi => helpers_1.isInt(midi);
Validator.isFrequency = freq => helpers_1.isNum(freq);
exports.Validator = Validator;
//# sourceMappingURL=validator.js.map