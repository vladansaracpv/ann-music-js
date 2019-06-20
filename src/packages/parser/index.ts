import { compose2, compose } from '@base/functional';
/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                        PARSER                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

export interface Rule {
  name: string;
  expansion: string;
  isTerminal: boolean;
  expand: () => string;
}

enum MeterType {
  Simple = 'simple',
  Compound = 'compound',
  Odd = 'odd',
}

export class Duration {
  public static NAMES = ['w', 'h', 'q', 'e', 's', 't'];
  public static VALUES = [1, 2, 4, 8, 16, 32];
  public static TYPES = ['n', 'r', 't'];

  public static valueIndex = (value: number) => {
    return Duration.VALUES.indexOf(value);
  };

  public static nameIndex = (name: string) => {
    return Duration.NAMES.indexOf(name);
  };

  public static nameToValue = (name: string) => {
    const i = Duration.NAMES.indexOf(name);
    return Duration.VALUES[i] || undefined;
  };

  public static valueToName = (value: number) => {
    const i = Duration.valueIndex(value);
    return Duration.NAMES[i] || undefined;
  };

  public static splitValue = (value: number) => {
    const i = Duration.valueIndex(value);
    return i > -1 ? Duration.VALUES[i + 1] : undefined;
  };

  public static splitName = (name: string) => {
    return compose2(Duration.splitValue, Duration.nameToValue);
  };

  public static doubleValue = (value: number) => {
    const i = Duration.valueIndex(value);
    return i > -1 ? Duration.VALUES[i - 1] : undefined;
  };

  public static doubleName = (name: string) => {
    return compose(
      Duration.valueToName,
      Duration.doubleValue,
      Duration.nameToValue,
    )(name);
  };

  public static toDuration = (value: number, duration: number) => {
    if (value > duration) return undefined;
    const [oldname, newName] = [Duration.valueToName(value), Duration.valueToName(duration)];
    const places = duration / value - 1;
    return oldname.concat('-'.repeat(places));
  };

  public static toDurationN = (value: string, duration: string) => {
    const nDuration = Duration.nameToValue(duration);
    // return Duration.toDuration(Duration.nameToValue(value), nDuration);
    const values = value
      .split('')
      .map(val => Duration.nameToValue(val))
      .map(val => Duration.toDuration(val, nDuration))
      .join('');
    return values;
  };
}

export const Euclid = (onNotes, totalNotes, grouped = false) => {
  function compareArrays(a: any[], b: any[]) {
    // TODO: optimize
    return JSON.stringify(a) === JSON.stringify(b);
  }

  var groups = [];
  for (var i = 0; i < totalNotes; i++) groups.push([Number(i < onNotes)]);

  var l;
  while ((l = groups.length - 1)) {
    var start = 0,
      first = groups[0];
    while (start < l && compareArrays(first, groups[start])) start++;
    if (start === l) break;

    var end = l,
      last = groups[l];
    while (end > 0 && compareArrays(last, groups[end])) end--;
    if (end === 0) break;

    var count = Math.min(start, l - end);
    groups = groups
      .slice(0, count)
      .map(function(group, i) {
        return group.concat(groups[l - i]);
      })
      .concat(groups.slice(count, -count));
  }
  return grouped ? groups : [].concat.apply([], groups);
};

export class Meter {
  private top: number;
  private bottom: number;
  private type: MeterType;
  private numOfBeats: number;
  private beat: string[];

  public getBeatValue = () =>
    this.type == MeterType.Compound ? Duration.valueToName(this.bottom).repeat(3) : this.beat.join(' ');
  public getNumOfBeats = () => this.numOfBeats;
  public getType = () => this.type;

  public constructor(top: number, bottom: number) {
    this.top = top;
    this.bottom = bottom;
    this.setType();
  }

  public properties = () => ({
    top: this.top,
    bottom: this.bottom,
    type: this.type,
    numOfBeats: this.numOfBeats,
    beat: this.beat,
  });

  private setType = () => {
    if (Meter.isCompound(this.top, this.bottom)) return this.createCompound();
    if (Meter.isSimple(this.top, this.bottom)) return this.createSimple();
    return this.createOdd();
  };

  public static isCompound = (top: number, bottom: number): boolean => {
    return top % 3 === 0 && top > 3;
  };

  public static isSimple = (top: number, bottom: number): boolean => {
    return top < 5;
  };

  private createSimple = () => {
    this.type = MeterType.Simple;
    this.numOfBeats = this.top;
    this.beat = [Duration.valueToName(this.bottom)];
  };

  private createCompound = () => {
    this.type = MeterType.Compound;
    this.numOfBeats = this.top / 3;
    this.beat = [Duration.valueToName(Duration.doubleValue(this.bottom)) + '.'];
  };

  private createOdd = () => {
    this.type = MeterType.Odd;
    this.numOfBeats = Math.ceil(this.top / 3);
    const name = Duration.valueToName(Duration.doubleValue(this.bottom));
    var arr: string = Euclid(this.numOfBeats, this.top, false).join('');
    arr = arr.replace(/100/g, name + '.').replace(/10/g, name + ' ');

    const groups = arr.split(' ').map(group => ((group[1] || ' ') === '.' ? [group[0], '.'] : [group, '']));

    this.beat = [arr];
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
    this.level = level || beat;
    this.notes = notes
      ? notes
      : this.meter.getType() === MeterType.Odd
      ? beat.split(' ')
      : Array(this.meter.getNumOfBeats()).fill(beat);
    this.bar =
      this.meter.getType() === MeterType.Odd
        ? ''
        : this.notes.map(note => Duration.toDurationN(note, this.level)).join(' ');
  }

  public properties = () => ({
    meter: this.meter.properties(),
    level: this.level,
    notes: this.notes,
    bar: this.bar,
  });
}

export class Grammar {
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

  public static createGrammar = (longest: string, shortest: string, ts: number[]) => {
    let rules: Rule[] = [];
    const initDuration = Duration.valueToName(ts[1]) + ' ';
    const beats = ts[0];
    const expansion = initDuration.repeat(beats).trimRight();

    const startRule = Grammar.createRule('startRule', expansion, false);
    const [li, si] = [Duration.nameIndex(longest), Duration.nameIndex(shortest)];
    const notes = Duration.NAMES.slice(li, si + 1);
    rules = [startRule, ...rules, ...notes.map(note => Grammar.createRuleForDuration(note))];
    return rules;
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
    startRule: Grammar.createRule('startRule', 'q q q q', false),
    q: Grammar.createRule('q', 'e e | n4 | r4 | t8', false),
    e: Grammar.createRule('e', 'n8 | r8 | t16', false),
    n4: Grammar.createRule('n/4', '', true),
    r4: Grammar.createRule('r/4', '', true),
    t8: Grammar.createRule('t/8', '', true),
    n8: Grammar.createRule('n/8', '', true),
    r8: Grammar.createRule('r/8', '', true),
    t16: Grammar.createRule('t/16', '', true),
  };
  const grammar = new Grammar(rules);

  const a = Parser(grammar.rules);
  console.log(a.parse());
};
