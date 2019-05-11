export const GRAMMAR = {
  start: '#pattern#',
  pattern: ['#cell#', '#pattern# #cell#'],
  cell: ['#dupleCell#', '#tripleCell#'],
  dupleCell: ['#n8# #n8#', '#n4#'],
  tripleCell: ['#n8# #n8# #n8#', '#n8# #n4#', '#n4# #n8#'],
  n4: ['4n', '4r'],
  n8: ['8n', '8r'],
};

export class Parser {
  private grammar;
  private regex = /^(?<next>((#\w+#)|(\w+)))(?<rest>.*)/;
  private sequence: string;
  private pattern: string;
  private duration: number;

  public constructor(grammar = GRAMMAR) {
    this.grammar = grammar;
    this.sequence = '';
    this.pattern = this.grammar.start;
  }

  private randIn = (rules: number): number => Math.floor(Math.random() * rules);
  private isAtomic = (s: string): boolean => /^(4n|8n|4r|8r)$/.test(s);

  public expand = (rule: string): string => {
    if (this.isAtomic(rule)) {
      this.sequence += rule;
      return '';
    }
    const rules = this.grammar[rule];
    const i = this.randIn(rules.length);
    return rules[i];
  };

  public generate = (): string => {
    if (!this.pattern) return this.sequence;

    const { next, rest } = this.pattern.trim().match(this.regex)['groups'];
    const rule = next.replace(/#/g, '');

    this.pattern = this.expand(rule) + rest;

    return this.generate();
  };
}

/**
 * exp(#pattern)
 * expand(#cell#pattern)
 * expand(#cell) + expand(#pattern)
 * expand(#dupleCell) + expand(#cell)
 * expand(#n4) + expand(#n8#n8)
 */