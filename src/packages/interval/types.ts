import { NoteName } from 'ann-music-note';

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                  INTERVAL - INTERFACES                  *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

/** Interval name with shape: number + quality. @example 3M */
export type IntervalName = string;

/** Generic interval number. Number of diatonic steps between two notes */
export type IntervalNumber = number;

/** Possible interval qualities */
export type IntervalQuality = 'dd' | 'd' | 'm' | 'M' | 'P' | 'A' | 'AA';

/**
 * In natural scale, there are just M and P intervals.
 * All other qualities are alterations by some amount
 */
export type IntervalAlteration = number;

/** Similar to NoteStep. Number of letters from first to second note */
export type IntervalStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Direction of I(N1, N2) is positive if N1 < N2. Negative otherwise */
export type IntervalDirection = -1 | 1;

/**
 * Basic interval (qualities).
 * All others are derived from it. M => d, m, A; P => d, A
 */
export type IntervalType = 'M' | 'P';

/**
 * Simple number is normalized IntervalNumber to single octave.
 * M9 => P8 + M2
 */
export type IntervalSimpleNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Width of the interval in semitones */
export type IntervalSemitones = number;

/**
 * Similar to Note.chroma.
 * It is an index of interval in list of 12 basic intervals
 */
export type IntervalChroma = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/**
 * How many octaves does the interval encompass.
 * For simple it is = 1, compound: > 1
 */
export type IntervalOctave = number;

/** Interval class is the minimum distance in steps of I(N1,N2), I(N2, N1) */
export type IntervalClass = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                  INTERVAL - INTERFACES                  *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

export type IntervalProps = Readonly<{
  name: IntervalName;
  inumber: IntervalNumber;
  quality: IntervalQuality;
  alteration: IntervalAlteration;
  step: IntervalStep;
  direction: IntervalDirection;
  itype: IntervalType;
  simple: IntervalSimpleNumber;
  width: IntervalSemitones;
  chroma: IntervalChroma;
  octave: IntervalOctave;
  iclass: IntervalClass;
  valid: boolean;
}>;

export interface NoInterval extends Partial<IntervalProps> {
  readonly valid: false;
  readonly name: '';
}

export type IvlInitProp = IntervalName | IntervalSemitones | NoteName[];

export interface IntervalBuild {
  step?: IntervalStep;
  alteration?: IntervalAlteration;
  octave?: IntervalOctave;
  direction?: IntervalDirection;
  inumber?: IntervalNumber;
}

export type IntervalInit = Partial<{
  name?: IntervalName;
  width?: IntervalSemitones;
  notes?: NoteName[];
  alternate?: boolean;
}>;
