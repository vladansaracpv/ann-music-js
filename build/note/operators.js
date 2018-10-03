"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const properties_1 = require("./properties");
const helpers_1 = require("../helpers");
class Operators {
}
// x > y
Operators.gt = helpers_1.curry((x, y, f = properties_1.midi) => f(x) > f(y));
// x > y ? x : y
Operators.greater = helpers_1.curry((x, y, f = properties_1.midi) => Operators.gt(x, y) ? x : y);
// x >= y
Operators.geq = helpers_1.curry((x, y, f = properties_1.midi) => f(x) >= f(y));
// x === y
Operators.eq = helpers_1.curry((x, y, f = properties_1.midi) => f(x) === f(y));
// x < y
Operators.lt = helpers_1.curry((x, y, f = properties_1.midi) => f(x) < f(y));
// x < y ? x : y
Operators.less = helpers_1.curry((x, y, f = properties_1.midi) => Operators.lt(x, y) ? x : y);
// x <= y
Operators.leq = helpers_1.curry((x, y, f = properties_1.midi) => f(x) <= f(y));
// x < n < y
Operators.inInterval = helpers_1.curry((x, y, n, f = properties_1.midi) => helpers_1.allTrue(Operators.lt(x, n, f), Operators.lt(n, y, f)));
// x <= n <= y
Operators.inSegment = helpers_1.curry((x, y, n, f = properties_1.midi) => helpers_1.allTrue(Operators.leq(x, n, f), Operators.leq(n, y, f)));
exports.Operators = Operators;
//# sourceMappingURL=operators.js.map