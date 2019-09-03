// [name, pcset, fifths, triad, seventh, alias?]
// [r.b., pcset, fifths, name, triad, seventh, alias?]
const DATA: ModeDefinition[] = [
  [0, 2773, 0, 'ionian', '', 'Maj7', 'major'],
  [1, 2902, 2, 'dorian', 'm', 'm7'],
  [2, 3418, 4, 'phrygian', 'm', 'm7'],
  [3, 2741, -1, 'lydian', '', 'Maj7'],
  [4, 2774, 1, 'mixolydian', '', '7'],
  [5, 2906, 3, 'aeolian', 'm', 'm7', 'minor'],
  [6, 3434, 5, 'locrian', 'dim', 'm7b5'],
];

export default DATA;
