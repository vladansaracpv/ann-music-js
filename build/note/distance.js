"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const properties_1 = require("./properties");
const helpers_1 = require("../helpers");
class Distance {
}
Distance.metric = helpers_1.curry((fn, arr) => arr.map(fn));
Distance.distance = (a, b, fn = properties_1.midi) => helpers_1.compose(Math.abs, helpers_1.diff, Distance.metric(fn))([a, b]);
exports.Distance = Distance;
//# sourceMappingURL=distance.js.map