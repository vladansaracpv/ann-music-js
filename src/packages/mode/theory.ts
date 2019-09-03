export const MODES = ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'];

export const IONIAN_CHORDS = 'M m m M M m o'.split(' ');
export const IONIAN_STEPS = 'W W H W W W H'.split(' ');

export const MODES_CHORDS = {
  ionian: ['M', 'm', 'm', 'M', 'M', 'm', 'o'],
  dorian: ['m', 'm', 'M', 'M', 'm', 'o', 'M'],
  phrygian: ['m', 'M', 'M', 'm', 'o', 'M', 'm'],
  lydian: ['M', 'M', 'm', 'o', 'M', 'm', 'm'],
  mixolydian: ['M', 'm', 'o', 'M', 'm', 'm', 'M'],
  aeolian: ['m', 'o', 'M', 'm', 'm', 'M', 'M'],
  locrian: ['o', 'M', 'm', 'm', 'M', 'M', 'm'],
};

export const MODES_STEPS = {
  aeolian: ['W', 'H', 'W', 'W', 'H', 'W', 'W'],
  dorian: ['W', 'H', 'W', 'W', 'W', 'H', 'W'],
  ionian: ['W', 'W', 'H', 'W', 'W', 'W', 'H'],
  locrian: ['H', 'W', 'W', 'H', 'W', 'W', 'W'],
  lydian: ['W', 'W', 'W', 'H', 'W', 'W', 'H'],
  mixolydian: ['W', 'W', 'H', 'W', 'W', 'H', 'W'],
  phrygian: ['H', 'W', 'W', 'W', 'H', 'W', 'W'],
};
