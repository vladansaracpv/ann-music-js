/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                  INTERVAL - INTERFACES                  *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

/** Interval name with shape: number + quality. @example 3M */
type IvlName = string;

/** Generic interval number. Number of diatonic steps between two notes */
type IvlNumber = number;

/** Possible interval qualities */
type IvlQuality = 'd' | 'm' | 'M' | 'P' | 'A';

/** In natural scale, there are just M and P intervals. All other qualities are alterations by some amount */
type IvlAlteration = number;

/** Similar to Note.step. Number of letters from first to second note */
type IvlStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Direction of I(N1, N2) is positive if N1 < N2. Negative otherwise */
type IvlDirection = -1 | 1;

/** Basic interval type derived from natural C-major scale. M => d, m, A; P => d, A */
type IvlType = 'M' | 'P';

/** Simple number is normalized IvlNumber to single octave. M9 => P8 + M2 */
type IvlSimpleNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Width of the interval in semitones */
type IvlSemitones = number;

/** Similar to Note.chroma it is an index of interval in list of 12 basic intervals */
type IvlChroma = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/** How many octaves does the interval encompass. For simple it is = 1, compound: > 1 */
type IvlOctave = number;

/** Interval class is the minimum distance in steps of I(N1,N2), I(N2, N1) */
type IvlClass = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface IvlProps {
  name: IvlName;
  num: IvlNumber;
  quality: IvlQuality;
  alteration: IvlAlteration;
  step: IvlStep;
  direction: IvlDirection;
  type: IvlType;
  simple: IvlSimpleNumber;
  semitones: IvlSemitones;
  chroma: IvlChroma;
  octave: IvlOctave;
  ic: IvlClass;
  valid: boolean;
}

/** Interval properties from which the Interval object can be constructed **/
type IvlInitProps = Partial<{
  name: string;
  semitones: number;
  notes: NoteName[];
}>;

interface IvlBuild {
  step?: IvlStep;
  alteration?: IvlAlteration;
  octave?: IvlOctave;
  direction?: IvlDirection;
  num?: IvlNumber;
}
interface IvlBuilderProps {
  distance?: boolean;
  transpose?: boolean;
  compare?: boolean;
}
