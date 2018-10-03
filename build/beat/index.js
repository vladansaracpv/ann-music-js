"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Beats;
(function (Beats) {
    class Grammar {
        constructor() {
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
    }
    class Note {
        constructor(duration, rules) {
            this.duration = duration;
            this.rules = rules;
        }
    }
    class Data {
        constructor(sentence, parse) {
            this.sentence = sentence;
            this.parse = parse;
        }
    }
    class Node {
        constructor(data) {
            this.print = () => console.log(`Generated: ${this.data.sentence}, Parsing: ${this.data.parse}`);
            this.data = data;
        }
    }
    class Parser {
        constructor(root) {
        }
    }
})(Beats = exports.Beats || (exports.Beats = {}));
class Beat {
    constructor(beats, unit) {
        this.print = () => console.log(`Time signature: ${this.beats}/${this.unit}`);
        this.sheet = () => {
            const s = `
      1   2   3   4     1   2   3   4
    +---+---+---+---+ +---+---+---+---+
    | o |   | o |   | |   |   |   |   |
    +---+---+---+---+ +---+---+---+---+
    | 1 | & | 2 | & | | 3 | & | 4 | & |
    +---+---+---+---+ +---+---+---+---+
    `;
            console.log(s);
        };
        this.unit = unit;
        this.beats = beats;
    }
}
exports.Beat = Beat;
const c = new Beat(4, 4);
// c.print();
// c.sheet();
//# sourceMappingURL=index.js.map