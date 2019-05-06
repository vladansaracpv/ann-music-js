/** String methods */

export const EMPTY = '';

export const rest = (x: string, n = 1) => x.substring(n);

export const glue = (...args) => args.reduce((acc, el) => acc + el);

export const charAt = (i: number) => (n: string) => n[0];

// export const capitalize = (str: string): string => glue('from', str[0].toUpperCase(), rest(str));

export const len = (str: string) => str.length;

export const tokenize = (str: string, regex: string | RegExp) => (str.match(regex) ? str.match(regex)['groups'] : null);

export const capitalize = (l: string) => l.toUpperCase();
export const substitute = (str: string, regex: RegExp, char: string) => str.replace(regex, char);
