"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const distance_1 = require("./distance");
const operators_1 = require("./operators");
const properties_1 = require("./properties");
const transpose_1 = require("./transpose");
const helpers_1 = require("../helpers");
const factory_1 = require("./factory");
class Note {
    constructor(name) {
        this.distanceFrom = (n, fn = properties_1.midi) => distance_1.Distance.distance(this.name, n.name, fn);
        this.gt = (other, f = properties_1.midi) => operators_1.Operators.gt(this.name, other.name, f);
        this.geq = (other, f = properties_1.midi) => operators_1.Operators.geq(this.name, other.name, f);
        this.eq = (other, f = properties_1.midi) => operators_1.Operators.eq(this.name, other.name, f);
        this.lt = (other, f = properties_1.midi) => operators_1.Operators.lt(this.name, other.name, f);
        this.leq = (other, f = properties_1.midi) => operators_1.Operators.leq(this.name, other.name, f);
        this.inInterval = (a, b, f = properties_1.midi) => operators_1.Operators.inInterval(a.name, b.name, this.name, f);
        this.inSegment = (a, b, f = properties_1.midi) => operators_1.Operators.inSegment(a.name, b.name, this.name, f);
        this.transpose = (amount) => transpose_1.Transpose.transpose(this.name, amount);
        this.next = (n = 1) => transpose_1.Transpose.next(this.name, n);
        this.prev = (n = 1) => transpose_1.Transpose.prev(this.name, n);
        helpers_1.compose(Object.freeze, Object.assign)(this, { enharmonic: properties_1.Properties.enharmonic(name) }, properties_1.Properties.props(name));
    }
    static create(withValue, fromProp = 'name') {
        const name = factory_1.NOTE_PROP_FACTORY('name', fromProp, withValue);
        if (!name)
            return undefined;
        return new Note(name);
    }
}
exports.Note = Note;
//# sourceMappingURL=index.js.map