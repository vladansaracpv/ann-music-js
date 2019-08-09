// import { Grammar, Rule } from './grammar';

// enum Token {
//   Terminal,
//   NonTerminal,
// }

// interface Node {
//   type: Token;
//   value: string;
//   rules: Rule[];
//   expanded: Rule;
//   children: Node[];
// }

// interface TimeSignature {
//   top: number;
//   bottom: number;
// }

// interface AST {
//   grammar?: Grammar;
//   ts: TimeSignature;
//   root: Node;
// }

// class Node implements Node {
//   type: Token;
//   value: string;
//   rules: Rule[];
//   expanded: Rule;
//   children: Node[];

//   constructor(type: Token, rules: Rule[], value?: string) {
//     this.type = type;
//     this.value = value;
//     this.rules = rules;
//   }

//   createChildren = () => {};
// }

// export class Tree implements AST {
//   root: Node;
//   ts: TimeSignature;
//   grammar: Grammar;

//   constructor(ts: TimeSignature, grammar: Grammar) {
//     this.ts = ts;
//     this.grammar = grammar;
//     // this.root = new Node(Token.NonTerminal, grammar.rules['startRule']);
//   }
// }
