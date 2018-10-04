"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Beats;
(function (Beats) {
    var Grammar = /** @class */ (function () {
        function Grammar() {
            this.terminals = ['w', 'h', 'q'];
            this.tokens = ['W', 'H', 'Q'];
            this.durations = {
                w: 4,
                h: 2,
                q: 1
            };
            this.rules = {
                W: ['w', 'HH'],
                H: ['h', 'QQ'],
                Q: ['q']
            };
        }
        return Grammar;
    }());
    var Note = /** @class */ (function () {
        function Note(duration, rules) {
            this.duration = duration;
            this.rules = rules;
        }
        return Note;
    }());
    var Data = /** @class */ (function () {
        function Data(sentence, parse) {
            this.sentence = sentence;
            this.parse = parse;
        }
        return Data;
    }());
    var Node = /** @class */ (function () {
        function Node(data) {
            var _this = this;
            this.print = function () { return console.log("Generated: " + _this.data.sentence + ", Parsing: " + _this.data.parse); };
            this.data = data;
        }
        return Node;
    }());
    var Parser = /** @class */ (function () {
        function Parser(root) {
        }
        return Parser;
    }());
})(Beats = exports.Beats || (exports.Beats = {}));
var Beat = /** @class */ (function () {
    function Beat(beats, unit) {
        var _this = this;
        this.print = function () { return console.log("Time signature: " + _this.beats + "/" + _this.unit); };
        this.sheet = function () {
            var s = "\n      1   2   3   4     1   2   3   4\n    +---+---+---+---+ +---+---+---+---+\n    | o |   | o |   | |   |   |   |   |\n    +---+---+---+---+ +---+---+---+---+\n    | 1 | & | 2 | & | | 3 | & | 4 | & |\n    +---+---+---+---+ +---+---+---+---+\n    ";
            console.log(s);
        };
        this.unit = unit;
        this.beats = beats;
    }
    return Beat;
}());
exports.Beat = Beat;
var c = new Beat(4, 4);
// c.print();
// c.sheet();
//# sourceMappingURL=index.js.map