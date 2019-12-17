import * as Theory from './theory';
import * as Methods from './methods';
import * as Dictionary from './dictionary';
export * from './types';
export * from './properties';

export const CHORD = {
  ...Theory,
  ...Methods,
  ...Dictionary,
};
