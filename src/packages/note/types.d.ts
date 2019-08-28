/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                  NOTE - INTERFACES                      *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

/**
 * Note name is made from letter + accidental? + octave
 */
type NoteName = string;

/**
 * Set of characteds used for note naming
 */
type NoteLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

/**
 * Note step represents index of NoteLetter
 * It starts from 'C' at index 0
 */
type NoteStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Octave is integer value
 */
type NoteOctave = number;

/**
 * Accidental can be '#', 'b', or natural - '' */
type NoteAccidental = string;

/**
 * Alteration is numerical value of @NoteAccidental
 * Each '#' adds 1, and 'b' adds -1
 */
type NoteAlteration = number;

/**
 * There are 12 different standard pitches in an octave.
 * Each at distance of 1 halfstep. C, C#, D, ...B
 */
type NotePC = string;

/**
 * Chroma is numerical value of a NotePC.
 * Starting at 0: 'C', and ending at 11: 'B'
 */
type NoteChroma = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/**
 * Midi value represents keyID in MIDI devices.
 * Conceptually, it is @NoteChroma accross octaves
 */
type NoteMidi = number;

/**
 * Positive number representing tone frequency.
 * Human ear can differ frequencies from 20Hz-20KHz
 */
type NoteFreq = number;

/**
 * Piano key color - black / white
 */
type NoteColor = string;

/**
 * Note duration value. Can be: 1, 2, 4, 8, 16, 32, 64
 */
type NoteDuration = number;

/**
 * Note object. Collection of note properties.
 * It extends @NoteMethods (optionals) interface in case you want them
 */
interface NoteProps {
  name: NoteName;
  letter: NoteLetter;
  step: NoteStep;
  octave: NoteOctave;
  accidental: NoteAccidental;
  alteration: NoteAlteration;
  pc: NotePC;
  chroma: NoteChroma;
  midi: NoteMidi;
  frequency: NoteFreq;
  color: NoteColor;
  valid: boolean;
}

interface NoNote extends Partial<NoteProps> {
  readonly valid: false;
  readonly name: '';
}

/**
 * Every note property is of @NoteProp type
 */
type NoteProp =
  | NoteName
  | NoteLetter
  | NoteStep
  | NoteOctave
  | NoteAccidental
  | NoteAlteration
  | NotePC
  | NoteChroma
  | NoteMidi
  | NoteFreq
  | NoteColor;

/**
 * Comparable properties are those that can be used for comparing and other operations
 */
type NoteComparable = 'midi' | 'frequency' | 'chroma' | 'step' | 'octave';

/**
 * Note properties from which the Note object can be constructed
 */
type InitProps = Partial<{
  name: NoteName;
  midi: NoteMidi;
  frequency: NoteFreq;
}>;

/**
 * Applied generic to Note
 * @param {NoteName} from
 * @param {NoteName} to
 * @param {NoteComparable} comparable
 */
type NoteDistanceFnParams = DistanceFnParams<NoteName, NoteComparable>;

/**
 * Applied generic type of DistanceFn<T> for Note
 * @param {NoteDistanceFnParams} params
 * @return {number}
 */
type NoteDistanceFn = DistanceFn<NoteDistanceFnParams>;

interface NoteBuilderProps {
  distance?: boolean;
  transpose?: boolean;
  compare?: boolean;
  extend?: boolean;
}
