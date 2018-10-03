"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Functional programming methods
exports.compose = (...fns) => (...args) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];
exports.curry = (fn) => {
    const arity = fn.length;
    return function $curry(...args) {
        if (args.length < arity) {
            return $curry.bind(null, ...args);
        }
        return fn.call(null, ...args);
    };
};
// Boolean methods
exports.madeOfChar = el => el[0].repeat(el.length) === el;
exports.isMember = (X, k) => !exports.isEmpty(k) && X.indexOf(k) > -1;
exports.inside = (a, b, x) => a <= x && x <= b;
exports.isInt = x => Number.isInteger(x);
exports.isNum = x => typeof (x) === 'number';
exports.isEmpty = x => x.length === 0;
exports.either = (f, g, c) => c ? f : g;
exports.allTrue = (...args) => args.reduce((acc, x) => acc && x);
exports.somethingTrue = (...args) => args.reduce((acc, x) => acc || x);
// Operation methods
exports.add = a => b => a + b;
exports.add2 = (a, b) => a + b;
exports.diff = ([a, b]) => a - b;
exports.diff2 = (a, b) => a - b;
// Transformation methods
exports.rest = (x, n = 1) => x.substring(n, x.length - 1);
exports.flatten = X => [...[].concat(...[X])];
exports.glue = (...args) => args.reduce((acc, el) => acc + el);
exports.id = x => x;
exports.firstLetter = n => n[0];
exports.withTick = arr => arr.map(el => `'${el}'`);
exports.or = (args, hasTick = false) => {
    const argsWithTick = hasTick ? args : exports.withTick(args);
    return argsWithTick.join(' / ');
};
exports.and = (args, hasTick = false) => {
    const argsWithTick = hasTick ? args : exports.withTick(args);
    return `[ ${argsWithTick.join(', ')} ]`;
};
exports.fillStr = (s, n) => Array(Math.abs(n) + 1).join(s);
//# sourceMappingURL=index.js.map