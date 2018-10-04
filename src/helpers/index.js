"use strict";
exports.__esModule = true;
// Functional programming methods
exports.compose = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return fns.reduceRight(function (res, fn) { return [fn.call.apply(fn, [null].concat(res))]; }, args)[0];
    };
};
exports.curry = function (fn) {
    var arity = fn.length;
    return function $curry() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length < arity) {
            return $curry.bind.apply($curry, [null].concat(args));
        }
        return fn.call.apply(fn, [null].concat(args));
    };
};
// Boolean methods
exports.madeOfChar = function (el) { return el[0].repeat(el.length) === el; };
exports.isMember = function (X, k) { return !exports.isEmpty(k) && X.indexOf(k) > -1; };
exports.inside = function (a, b, x) { return a <= x && x <= b; };
exports.isInt = function (x) { return Number.isInteger(x); };
exports.isNum = function (x) { return typeof (x) === 'number'; };
exports.isEmpty = function (x) { return x.length === 0; };
exports.either = function (f, g, c) { return c ? f : g; };
exports.allTrue = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.reduce(function (acc, x) { return acc && x; });
};
exports.somethingTrue = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.reduce(function (acc, x) { return acc || x; });
};
// Operation methods
exports.add = function (a) { return function (b) { return a + b; }; };
exports.add2 = function (a, b) { return a + b; };
exports.diff = function (_a) {
    var a = _a[0], b = _a[1];
    return a - b;
};
exports.diff2 = function (a, b) { return a - b; };
// Transformation methods
exports.rest = function (x, n) {
    if (n === void 0) { n = 1; }
    return x.substring(n, x.length - 1);
};
exports.flatten = function (X) { return [].concat.apply([], [X]).slice(); };
exports.glue = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.reduce(function (acc, el) { return acc + el; });
};
exports.id = function (x) { return x; };
exports.firstLetter = function (n) { return n[0]; };
exports.withTick = function (arr) { return arr.map(function (el) { return "'" + el + "'"; }); };
exports.or = function (args, hasTick) {
    if (hasTick === void 0) { hasTick = false; }
    var argsWithTick = hasTick ? args : exports.withTick(args);
    return argsWithTick.join(' / ');
};
exports.and = function (args, hasTick) {
    if (hasTick === void 0) { hasTick = false; }
    var argsWithTick = hasTick ? args : exports.withTick(args);
    return "[ " + argsWithTick.join(', ') + " ]";
};
exports.fillStr = function (s, n) { return Array(Math.abs(n) + 1).join(s); };
