/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *              INTERVAL - THEORY CONSTANTS                *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

/**
 * C-major scale interval qualities.
 * Every other interval is made from these by some alteration
 */
export const BASE_QUALITIES = 'PMMPPMM';

/** Chroma indexes (places) of base interval types in chromatic scale */
export const BASE_SIZES = [0, 2, 4, 5, 7, 9, 11];

// Regular expression used to parse Augmented intervals
export const AUG_REGEX = /^A{1,2}$/;

// Regular expression used to parse Diminished intervals
export const DIM_REGEX = /^d{1,2}$/;

// Regular expression used to tokenize Interval of shape <number><quality>
export const TONAL_REGEX = '(?<tn>[-+]?\\d+)(?<tq>d{1,2}|m|M|P|A{1,2})';

// Regular expression used to tokenize Interval of shape <quality><number>
export const QUALITY_REGEX = '(?<qq>d{1,4}|m|M|P|A{1,4})(?<qn>[-+]?\\d+)';

// Union of previous two regular expressions
export const INTERVAL_REGEX = new RegExp(`^${TONAL_REGEX}|${QUALITY_REGEX}$`);

/**
 * Shortest distance in pitch class space between two unordered pitch classes.
 * iclass(a,b) = min((a-b) % 12, (b-a) % 12)
 *
 * @example
 * The iclass between pitch classes 4 and 9 is 5 because 9 − 4 = 5, which is less than: 4 − 9 = −5 ≡ 7 (mod 12)
 */
export const CLASSES = [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];

/** Names of the intervals in chromatic octave */
export const NAMES = '1P 2m 2M 3m 3M 4P A4 5P 6m 6M 7m 7M 8P'.split(' ');
export const NAMES_ALTERNATE = '1P 1A 2M 2A 3M 4P 4A 5P 5A 6M 6A 7M 8P'.split(' ');

/** Scale degrees to which interval at index:i is assigned */
export const NUMBERS = [1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7];
export const NUMBERS_ALTERNATE = [1, 1, 2, 2, 3, 4, 4, 5, 5, 6, 6, 7];

/** Qualities of intervals at index:i */
export const QUALITIES = 'P m M m M P d P m M m M P'.split(' ');
export const QUALITIES_ALTERNAT = 'P A M A M P A P A M A M P'.split(' ');

export const EmptyInterval = {
  name: '',
  valid: false,
};
