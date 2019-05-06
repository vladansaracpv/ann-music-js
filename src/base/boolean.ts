/** Boolean methods */

export const both = (first, second): boolean => first && second;

export const isIn = str => n => str.includes(n[1]);

export const isEither = (f, g, c) => {
  return c ? f : g;
};

export const either = (f: any, g: any, cond: boolean): any => (cond ? f : g);

export const charAtEq = (position: number, eqTo: string, str: string): boolean =>
  str.length >= position && str[position] === eqTo;
