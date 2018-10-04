"use strict";
exports.__esModule = true;
var properties_1 = require("./properties");
var helpers_1 = require("../helpers");
var factory_1 = require("./factory");
var Transpose = /** @class */ (function () {
    function Transpose() {
    }
    Transpose.semitones = function (note, semitones) { return helpers_1.compose(factory_1.NAME.fromMidi, helpers_1.add2)(properties_1.midi(note), semitones); };
    Transpose.tones = function (note, tones) { return Transpose.semitones(note, 2 * tones); };
    Transpose.octaves = function (note, octaves) { return Transpose.semitones(note, 12 * octaves); };
    Transpose.parseAmount = function (amount) {
        var OCTAVE_REGEX = /^(octaves|octave|oct|o)?$/;
        var STEPS_REGEX = /^(steps|step|s)?$/;
        var SEMI_REGEX = /^(halfsteps|halves|half|semi|h)$/;
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
    Transpose.transpose = function (note, amount) {
        var amountVal = amount.split(' ');
        var n = Number.parseInt(helpers_1.firstLetter(amountVal));
        var k = Transpose.parseAmount(amountVal[1] || '');
        return Transpose.semitones(note, n * k);
    };
    Transpose.next = function (x, n) {
        if (n === void 0) { n = 1; }
        return helpers_1.compose(factory_1.NAME.fromMidi, helpers_1.compose(helpers_1.add(n), properties_1.midi))(x);
    };
    Transpose.prev = function (x, n) {
        if (n === void 0) { n = 1; }
        return Transpose.next(x, -n);
    };
    return Transpose;
}());
exports.Transpose = Transpose;
