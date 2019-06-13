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

export class Duration {
  public static NAMES = ['w', 'h', 'q', 'e', 's', 't'];
  public static VALUES = [1, 2, 4, 8, 16, 32];
  public static TYPES = ['n', 'r', 't'];

  public static nameToValue = (name: string) => {
    // const _name = (name[1] || '') === '.' ? name[0] :
    const i = Duration.NAMES.indexOf(name);
    return Duration.VALUES[i] || undefined;
  };

  public static valueToName = (value: number) => {
    const i = Duration.VALUES.indexOf(value);
    return Duration.NAMES[i] || undefined;
  };

  private static valueIndex = (value: number) => {
    return Duration.VALUES.indexOf(value);
  };

  public static splitValue = (value: number) => {
    const i = Duration.valueIndex(value);
    return i > -1 ? Duration.VALUES[i + 1] : undefined;
  };

  public static doubleValue = (value: number) => {
    const i = Duration.valueIndex(value);
    return i > -1 ? Duration.VALUES[i - 1] : undefined;
  };

  private static nameIndex = (name: string) => {
    return Duration.NAMES.indexOf(name);
  };

  public static splitName = (name: string) => {
    const i = Duration.nameIndex(name);
    return i > -1 ? Duration.NAMES[i + 1] : undefined;
  };

  public static doubleName = (name: string) => {
    const i = Duration.nameIndex(name);
    return i > -1 ? Duration.NAMES[i - 1] : undefined;
  };

  public static toDuration = (value: number, duration: number) => {
    if (value > duration) return undefined;
    const [oldname, newName] = [Duration.valueToName(value), Duration.valueToName(duration)];
    const places = duration / value - 1;
    return oldname.concat('-'.repeat(places));
  };

  public static toDurationN = (value: string, duration: string) => {
    const nDuration = Duration.nameToValue(duration);
    const values = value
      .split('')
      .map(val => Duration.nameToValue(val))
      .map(val => Duration.toDuration(val, nDuration))
      .join('');
    return values;
  };
}

enum MeterType {
  Simple = 'simple',
  Compound = 'compound',
  Odd = 'odd',
}

export class Meter {
  private top: number;
  private bottom: number;
  private type: MeterType;
  private numOfBeats: number;
  private beat: [string, string];

  public getBeatValue = () =>
    this.type == MeterType.Compound ? Duration.valueToName(this.bottom).repeat(3) : this.beat.join('');
  public getNumOfBeats = () => this.numOfBeats;

  public constructor(top: number, bottom: number) {
    this.top = top;
    this.bottom = bottom;
    this.setType();
  }

  private setType = () => {
    if (Meter.isCompound(this.top, this.bottom)) return this.createCompound();
    if (Meter.isSimple(this.top, this.bottom)) return this.createSimple();
    return this.createOdd();
  };

  public static isCompound = (top: number, bottom: number): boolean => {
    return top % 3 === 0 && top > 3 ? true : false;
  };

  public static isSimple = (top: number, bottom: number): boolean => {
    return top < 5 ? true : false;
  };

  private createSimple = () => {
    this.type = MeterType.Simple;
    this.numOfBeats = this.top;
    this.beat = [Duration.valueToName(this.bottom), ''];
  };

  private createCompound = () => {
    this.type = MeterType.Compound;
    this.numOfBeats = this.top / 3;
    this.beat = [Duration.valueToName(Duration.doubleValue(this.bottom)), '.'];
  };

  private createOdd = () => {
    this.type = MeterType.Odd;
    this.numOfBeats = Math.ceil(this.top / 3);
    this.beat = ['', ''];
  };
}

export class Measure {
  private meter: Meter;
  private level: string; // counting level - in quarters, or eighths...
  private notes: string[];
  private bar: string;

  public constructor(meter: Meter, level?: string, notes?: string[]) {
    this.meter = meter;
    const beat = this.meter.getBeatValue();
    this.level = level ? level : beat;
    this.notes = notes ? notes : Array(this.meter.getNumOfBeats()).fill(beat);
    this.bar = this.notes.map(note => Duration.toDurationN(note, this.level)).join(' ');
  }
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
