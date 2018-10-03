export namespace Beats {

    class Grammar {
      terminals = ['w', 'h', 'q'];
      tokens = ['W', 'H', 'Q'];
      durations = {
        w: 4,
        h: 2,
        q: 1
      };
      rules = {
        W: ['w', 'HH'],
        H: ['h', 'QQ'],
        Q: ['q']
      };

    }

    class Note {
      duration: number;
      rules: string[];

      constructor(duration, rules) {
        this.duration = duration;
        this.rules = rules;
      }
    }

    class Data {
      sentence: string;
      parse: string;

      constructor(sentence, parse) {
        this.sentence = sentence;
        this.parse = parse;
      }
    }

    class Node {
      data: Data;
      left: undefined;
      right: undefined;

      constructor(data: Data) {
        this.data = data;
      }

      print = () => console.log(`Generated: ${this.data.sentence}, Parsing: ${this.data.parse}`);
    }

    class Parser {
      root: Node;
      list: string[];

      constructor(root: Node) {

      }
    }

}

export class Beat {
  unit: number;
  beats: number;

  constructor(beats: number, unit: number) {
    this.unit = unit;
    this.beats = beats;
  }

  print = () => console.log(`Time signature: ${this.beats}/${this.unit}`);
  sheet = () => {
    const s = `
      1   2   3   4     1   2   3   4
    +---+---+---+---+ +---+---+---+---+
    | o |   | o |   | |   |   |   |   |
    +---+---+---+---+ +---+---+---+---+
    | 1 | & | 2 | & | | 3 | & | 4 | & |
    +---+---+---+---+ +---+---+---+---+
    `;
    console.log(s);
  }

}

const c = new Beat(4, 4);
// c.print();
// c.sheet();
