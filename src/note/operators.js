"use strict";
exports.__esModule = true;
var properties_1 = require("./properties");
var helpers_1 = require("../helpers");
var Operators = /** @class */ (function () {
    function Operators() {
    }
    // x > y
    Operators.gt = helpers_1.curry(function (x, y, f) {
        if (f === void 0) { f = properties_1.midi; }
        return f(x) > f(y);
    });
    // x > y ? x : y
    Operators.greater = helpers_1.curry(function (x, y, f) {
        if (f === void 0) { f = properties_1.midi; }
        return Operators.gt(x, y) ? x : y;
    });
    // x >= y
    Operators.geq = helpers_1.curry(function (x, y, f) {
        if (f === void 0) { f = properties_1.midi; }
        return f(x) >= f(y);
    });
    // x === y
    Operators.eq = helpers_1.curry(function (x, y, f) {
        if (f === void 0) { f = properties_1.midi; }
        return f(x) === f(y);
    });
    // x < y
    Operators.lt = helpers_1.curry(function (x, y, f) {
        if (f === void 0) { f = properties_1.midi; }
        return f(x) < f(y);
    });
    // x < y ? x : y
    Operators.less = helpers_1.curry(function (x, y, f) {
        if (f === void 0) { f = properties_1.midi; }
        return Operators.lt(x, y) ? x : y;
    });
    // x <= y
    Operators.leq = helpers_1.curry(function (x, y, f) {
        if (f === void 0) { f = properties_1.midi; }
        return f(x) <= f(y);
    });
    // x < n < y
    Operators.inInterval = helpers_1.curry(function (x, y, n, f) {
        if (f === void 0) { f = properties_1.midi; }
        return helpers_1.allTrue(Operators.lt(x, n, f), Operators.lt(n, y, f));
    });
    // x <= n <= y
    Operators.inSegment = helpers_1.curry(function (x, y, n, f) {
        if (f === void 0) { f = properties_1.midi; }
        return helpers_1.allTrue(Operators.leq(x, n, f), Operators.leq(n, y, f));
    });
    return Operators;
}());
exports.Operators = Operators;
