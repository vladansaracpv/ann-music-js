/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                        PARSER                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

interface Rule {
  name: string;
  expansion: string;
  isTerminal: boolean;
  expand: () => string;
}

class Duration {
  public static NAMES = ['w', 'h', 'q', 'e', 's', 't'];
  public static VALUES = [1, 2, 4, 8, 16, 32];
  public static TYPES = ['n', 'r', 't'];

  public static nameToValue = (name: string) => {
    const i = Duration.NAMES.indexOf(name);
    return Duration.VALUES[i];
  };

  public static valueToName = (value: number) => {
    const i = Duration.VALUES.indexOf(value);
    return Duration.NAMES[i];
  };
}

class Grammar {
  public rules: Record<string, Rule> = {};

  public static createRule = (name: string, expansion: string, isTerminal: boolean): Rule => {
    const expand = () => {
      const rules = expansion.split(' | ');
      const i = Math.floor(Math.random() * rules.length);
      return rules[i];
    };

    return {
      name,
      expansion,
      isTerminal,
      expand,
    };
  };

  public static createRuleForDuration = (duration: string | number, isTerminal = false): Rule => {
    let name, value;

    if (typeof duration == 'string') {
      name = duration;
      value = Duration.nameToValue(duration);
    } else {
      value = duration;
      name = Duration.valueToName(duration);
    }

    const createTypes = (type: string) => (type === 't' ? type + value * 2 : type + value);
    const createNext = (name: string) => {
      const i = Duration.NAMES.indexOf(name);
      const next = i < Duration.NAMES.length - 1 ? Duration.NAMES[i + 1] : '';
      return next ? next + ' ' + next + ' | ' : '';
    };

    const types = createNext(name) + Duration.TYPES.map(createTypes).join(' | ');
    return Grammar.createRule(name, types, isTerminal);
  };

  public constructor(rules: Rule[] | Record<string, Rule>) {
    if (Array.isArray(rules)) {
      rules.forEach(rule => this.addRule(rule));
    } else {
      this.rules = rules;
    }
  }

  public addRule = (rule: Rule) => {
    this.rules[rule.name] = rule;
  };
}

const createGrammar = (longest: string, shortest: string, ts: number[]) => {
  let rules: Rule[] = [];
  const [li, si] = [Duration.NAMES.indexOf(longest), Duration.NAMES.indexOf(shortest)];
  const notes = Duration.NAMES.slice(li, si + 1);
  rules = [...rules, ...notes.map(note => Grammar.createRuleForDuration(note))];
  return rules;
};

const r = createGrammar('h', 'e', [3, 4]);
r;
// console.log(r);

const Parser = (grammar: Record<string, Rule>) => {
  const sequence = [grammar.startRule];
  const sentence = [];

  const measure = (notes: string) => `| ${notes} |`;

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

const startRule = Grammar.createRule('startRule', 'q q q q', false);
const q = Grammar.createRule('q', 'e e | n4 | r4 | t8 ', false);
const e = Grammar.createRule('e', 'n8 | r8 | t16', false);
const n4 = Grammar.createRule('n4', '', true);
const r4 = Grammar.createRule('r4', '', true);
const t8 = Grammar.createRule('t8', '', true);
const n8 = Grammar.createRule('n8', '', true);
const r8 = Grammar.createRule('r8', '', true);
const t16 = Grammar.createRule('t16', '', true);

const rules = { startRule, q, e, n4, r4, t8, n8, r8, t16 };
const grammar = new Grammar(rules);

const a = Parser(grammar.rules);
a;
