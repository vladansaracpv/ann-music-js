"use strict";
exports.__esModule = true;
var helpers_1 = require("../helpers");
var FactoryError = /** @class */ (function () {
    function FactoryError() {
    }
    FactoryError.NEED_MORE_ARGS = helpers_1.curry(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var dict = FactoryError.errorDict(args);
        console.log("Couldn't create NOTE." + dict.forProp + " just from NOTE." + dict.fromProp + ": '" + dict.withValue + "'. Try with " + dict.need + " included.");
        return undefined;
    });
    FactoryError.NO_FACT_FOR_PARAM = helpers_1.curry(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var dict = FactoryError.errorDict(args);
        console.log("Couldn't create NOTE." + dict.forProp + " from NOTE." + dict.fromProp + ": '" + dict.withValue + "'");
        return undefined;
    });
    FactoryError.errorDict = function (args) {
        return { forProp: args[0], fromProp: args[1], withValue: args[2], need: args.length === 4 ? args[3] : '' };
    };
    return FactoryError;
}());
exports.FactoryError = FactoryError;
