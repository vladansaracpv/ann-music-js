/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import { Grammar, Rule } from './index';

enum Token {
  Terminal,
  NonTerminal,
}

interface Node {
  value?: string;
  type: Token;
  children: Node[];
}

interface TimeSignature {
  top: number;
  bottom: number;
}

interface AST {
  grammar?: Grammar;
  ts: TimeSignature;
  root: Node;
}

class Node implements Node {
  value?: string;
  type: Token;
  rule: Rule;
  children: Node[];

  constructor(type: Token, rule: Rule, value?: string) {
    this.value = value;
    this.type = type;
    this.rule = rule;
  }

  createChildren = () => {};
}

export class Tree implements AST {
  public root: Node;
  public ts: TimeSignature;
  public grammar: Grammar;

  public constructor(ts: TimeSignature, grammar: Grammar) {
    this.ts = ts;
    this.grammar = grammar;
    this.root = new Node(Token.NonTerminal, grammar.rules['startRule']);
  }
}

const startRule = Grammar.createRule('startRule', 'q q q q', false);

const grammar = {
  q: Grammar.createRule('q', 'e e | n4 | r4 | t8', false),
  e: Grammar.createRule('e', 'n8 | r8 | t16', false),
  n4: Grammar.createRule('n/4', '', true),
  r4: Grammar.createRule('r/4', '', true),
  t8: Grammar.createRule('t/8', '', true),
  n8: Grammar.createRule('n/8', '', true),
  r8: Grammar.createRule('r/8', '', true),
  t16: Grammar.createRule('t/16', '', true),
};
