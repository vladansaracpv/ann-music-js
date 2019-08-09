/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                        TRIADS                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

export const TRIAD_TYPES = ['Major', 'minor', 'Augmented', 'diminished', 'suspended'];

export const MAJOR = {
  name: 'Major',
  formula: '1P 3M 5P'.split(' '),
  notation: 'M maj  '.split(' '),
};

export const MINOR = {
  name: 'minor',
  formula: '1P 3m 5P'.split(' '),
  notation: 'm min'.split(' '),
};

export const AUGMENTED = {
  name: 'Augmented',
  formula: '1P 3M 5A'.split(' '),
  notation: 'aug +'.split(' '),
};

export const DIMINISHED = {
  name: 'diminished',
  formula: '1P 3m 5d'.split(' '),
  notation: 'dim °'.split(' '),
};

export const TRIADS = {
  MAJOR,
  MINOR,
  AUGMENTED,
  DIMINISHED,
};

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                      SEVEN CHORDS                       *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
export const SEVENTHS_TYPES = [
  'diminished',
  'half-diminished',
  'minor',
  'minor-major',
  'dominant',
  'major',
  'augmented',
];

export const DIMINISHED7 = {
  name: 'diminished seventh',
  formula: '1P 3m 5d 7d'.split(' '),
  notation: 'dim7 °7 o7'.split(' '),
};

export const HALF_DIMINISHED7 = {
  name: 'half-diminished',
  formula: '1P 3m 5d 7m'.split(' '),
  notation: 'm7b5 ø'.split(' '),
};

export const MINOR7 = {
  name: 'minor seventh',
  formula: '1P 3m 5P 7m'.split(' '),
  notation: 'm7 min7 mi7 -7'.split(' '),
};

export const MINOR_MAJOR7 = {
  name: 'minor/major seventh',
  formula: '1P 3m 5P 7M'.split(' '),
  notation: 'm/ma7 m/maj7 mM7 m/M7 -Δ7 mΔ'.split(' '),
};

export const DOMINANT7 = {
  name: 'dominant seventh',
  formula: '1P 3M 5P 7m'.split(' '),
  notation: '7 dom'.split(' '),
};

export const MAJOR7 = {
  name: 'major seventh',
  formula: '1P 3M 5P 7M'.split(' '),
  notation: 'maj7 Δ ma7 M7 Maj7'.split(' '),
};

export const AUGMENTED7 = {
  name: 'augmented seventh',
  formula: '1P 3M 5A 7M'.split(' '),
  notation: 'maj7#5 maj7+5'.split(' '),
};

export const SEVENTHS = {
  DIMINISHED7,
  HALF_DIMINISHED7,
  MINOR7,
  MINOR_MAJOR7,
  DOMINANT7,
  MAJOR7,
  AUGMENTED7,
};
