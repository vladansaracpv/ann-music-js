/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *              INTERVAL - THEORY CONSTANTS                *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

/** C-major scale interval qualities. Every other interval is made from these */
export const BASE_INTERVAL_TYPES = 'PMMPPMM';

/** Chroma indexes (places) of base interval types in chromatic scale */
export const BASE_INTERVAL_SIZES = [0, 2, 4, 5, 7, 9, 11];

/** Regular expression used to parse Augmented intervals **/
export const AUGMENTED_REGEX = /^A+$/;

/** Regular expression used to parse Diminished intervals **/
export const DIMINISHED_REGEX = /^d+$/;

/** Regular expression used to tokenize Interval of shape <number><quality> **/
export const INTERVAL_TONAL = '(?<tn>[-+]?\\d+)(?<tq>d{1,2}|m|M|P|A{1,2})';

/** Regular expression used to tokenize Interval of shape <quality><number> **/
export const INTERVAL_QUALITY = '(?<qq>d{1,4}|m|M|P|A{1,4})(?<qn>[-+]?\\d+)';

/** Union of previous two regular expressions **/
export const INTERVAL_REGEX = new RegExp(`^${INTERVAL_TONAL}|${INTERVAL_QUALITY}$`);

/**
 * Shortest distance in pitch class space between two unordered pitch classes.
 * ic(a,b) = min((a-b) % 12, (b-a) % 12)
 *
 * @example
 * The ic between pitch classes 4 and 9 is 5 because 9 − 4 = 5, which is less than: 4 − 9 = −5 ≡ 7 (mod 12)
 */
export const INTERVAL_CLASSES = [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];

/** Names of the intervals in chromatic octave */
export const INTERVAL_NAMES = '1P 2m 2M 3m 3M 4P A4 5P 6m 6M 7m 7M 8P'.split(' ');

/** Scale degrees to which interval at index:i is assigned */
export const INTERVAL_NUMBERS = [1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7];

/** Qualities of intervals at index:i */
export const INTERVAL_QUALITIES = 'P m M m M P d P m M m M'.split(' ');
