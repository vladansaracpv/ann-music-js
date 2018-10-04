"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var distance_1 = require("./distance");
var operators_1 = require("./operators");
var properties_1 = require("./properties");
var transpose_1 = require("./transpose");
var helpers_1 = require("../helpers");
var factory_1 = require("./factory");
var Note = /** @class */ (function () {
    function Note(name) {
        var _this = this;
        this.distanceFrom = function (n, fn) {
            if (fn === void 0) { fn = properties_1.midi; }
            return distance_1.Distance.distance(_this.name, n.name, fn);
        };
        this.gt = function (other, f) {
            if (f === void 0) { f = properties_1.midi; }
            return operators_1.Operators.gt(_this.name, other.name, f);
        };
        this.geq = function (other, f) {
            if (f === void 0) { f = properties_1.midi; }
            return operators_1.Operators.geq(_this.name, other.name, f);
        };
        this.eq = function (other, f) {
            if (f === void 0) { f = properties_1.midi; }
            return operators_1.Operators.eq(_this.name, other.name, f);
        };
        this.lt = function (other, f) {
            if (f === void 0) { f = properties_1.midi; }
            return operators_1.Operators.lt(_this.name, other.name, f);
        };
        this.leq = function (other, f) {
            if (f === void 0) { f = properties_1.midi; }
            return operators_1.Operators.leq(_this.name, other.name, f);
        };
        this.inInterval = function (a, b, f) {
            if (f === void 0) { f = properties_1.midi; }
            return operators_1.Operators.inInterval(a.name, b.name, _this.name, f);
        };
        this.inSegment = function (a, b, f) {
            if (f === void 0) { f = properties_1.midi; }
            return operators_1.Operators.inSegment(a.name, b.name, _this.name, f);
        };
        this.transpose = function (amount) { return transpose_1.Transpose.transpose(_this.name, amount); };
        this.next = function (n) {
            if (n === void 0) { n = 1; }
            return transpose_1.Transpose.next(_this.name, n);
        };
        this.prev = function (n) {
            if (n === void 0) { n = 1; }
            return transpose_1.Transpose.prev(_this.name, n);
        };
        helpers_1.compose(Object.freeze, Object.assign)(this, { enharmonic: properties_1.Properties.enharmonic(name) }, properties_1.Properties.props(name));
    }
    Note.create = function (withValue, fromProp) {
        if (fromProp === void 0) { fromProp = 'name'; }
        var name = factory_1.NOTE_PROP_FACTORY('name', fromProp, withValue);
        if (!name)
            return undefined;
        return new Note(name);
    };
    return Note;
}());
exports.Note = Note;
//# sourceMappingURL=index.js.map