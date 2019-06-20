import { Grammar, Rule } from './grammar';
/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                        PARSER                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

export const Parser = (grammar: Record<string, Rule>) => {
  const sequence = [grammar.startRule];
  const sentence = [];

  const measure = (notes: string) => `| ${notes} |`;

  const parse = () => {
    while (sequence.length > 0) {
      const currentRule: Rule = sequence.pop();
      const expandedRule = currentRule
        .expand()
        .split(' ')
        .map(rule => grammar[rule]);

      sequence.push(...expandedRule.filter(rule => rule && !rule.isTerminal));
      sentence.push(...expandedRule.filter(rule => rule && rule.isTerminal).map(rule => rule.name));
    }

    return measure(sentence.join(' - '));
  };

  return { parse };
};

export const test = () => {
  const r = Grammar.createGrammar('h', 'e', [3, 4]);

  var rules = {
    startRule: Rule.createRule('startRule', 'q q q q', false),
    q: Rule.createRule('q', 'e e | n4 | r4 | t8', false),
    e: Rule.createRule('e', 'n8 | r8 | t16', false),
    n4: Rule.createRule('n/4', '', true),
    r4: Rule.createRule('r/4', '', true),
    t8: Rule.createRule('t/8', '', true),
    n8: Rule.createRule('n/8', '', true),
    r8: Rule.createRule('r/8', '', true),
    t16: Rule.createRule('t/16', '', true),
  };
  const grammar = new Grammar(rules);

  const a = Parser(grammar.rules);
  console.log(a.parse());
};
