"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const properties_1 = require("./properties");
const helpers_1 = require("../helpers");
const factory_1 = require("./factory");
class Transpose {
}
Transpose.semitones = (note, semitones) => helpers_1.compose(factory_1.NAME.fromMidi, helpers_1.add2)(properties_1.midi(note), semitones);
Transpose.tones = (note, tones) => Transpose.semitones(note, 2 * tones);
Transpose.octaves = (note, octaves) => Transpose.semitones(note, 12 * octaves);
Transpose.parseAmount = (amount) => {
    const OCTAVE_REGEX = /^(octaves|octave|oct|o)?$/;
    const STEPS_REGEX = /^(steps|step|s)?$/;
    const SEMI_REGEX = /^(halfsteps|halves|half|semi|h)$/;
    if (amount.length === 0)
        return 1;
    if (OCTAVE_REGEX.test(amount))
        return 12;
    if (STEPS_REGEX.test(amount))
        return 6;
    if (SEMI_REGEX.test(amount))
        return 1;
    return 0;
};
Transpose.transpose = (note, amount) => {
    const amountVal = amount.split(' ');
    const n = Number.parseInt(helpers_1.firstLetter(amountVal));
    const k = Transpose.parseAmount(amountVal[1] || '');
    return Transpose.semitones(note, n * k);
};
Transpose.next = (x, n = 1) => helpers_1.compose(factory_1.NAME.fromMidi, helpers_1.compose(helpers_1.add(n), properties_1.midi))(x);
Transpose.prev = (x, n = 1) => Transpose.next(x, -n);
exports.Transpose = Transpose;
//# sourceMappingURL=transpose.js.map