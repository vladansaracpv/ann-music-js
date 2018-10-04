"use strict";
exports.__esModule = true;
var properties_1 = require("./properties");
var helpers_1 = require("../helpers");
var Distance = /** @class */ (function () {
    function Distance() {
    }
    Distance.metric = helpers_1.curry(function (fn, arr) { return arr.map(fn); });
    Distance.distance = function (a, b, fn) {
        if (fn === void 0) { fn = properties_1.midi; }
        return helpers_1.compose(Math.abs, helpers_1.diff, Distance.metric(fn))([a, b]);
    };
    return Distance;
}());
exports.Distance = Distance;
