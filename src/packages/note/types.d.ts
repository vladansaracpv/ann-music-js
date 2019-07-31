/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                  NOTE - INTERFACES                      *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

/** Note name is made from letter + accidental? + octave **/
type NoteName = string;

/** Set of characteds used for note naming **/
type NoteLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

/** Note step represents index of NoteLetter. It starts from 'C' at index 0 **/
type NoteStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Octave is integer value. **/
type NoteOctave = number;

/** Accidental is a string consisting of one or more '#' or 'b', or neutral - '' **/
type NoteAccidental = string;

/** Alteration is numerical value of NoteAccidental where each '#' adds 1, and 'b' adds -1 **/
type NoteAlteration = number;

/** There are 12 different pitches in an octave, each at distance of 1 halfstep. C, C#, D, ...B **/
type NotePC = string;

/** Chroma is numerical value of a NotePC. Starting at 0: 'C', and ending at 11: 'B' **/
type NoteChroma = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/** Midi value represents NoteChroma that is extended with octave. **/
type NoteMidi = number;

/** Positive number. Represents tone frequency. Human ear can differ frequencies from 20Hz-20KHz **/
type NoteFreq = number;

/** Piano key color - black / white */
type NoteColor = string;

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
  op: any;
}

interface NoNote extends Partial<NoteProps> {
  readonly valid: false;
  readonly name: '';
}

/** Note properties from which the Note object can be constructed **/
type InitProps = Partial<Pick<NoteProps, 'name' | 'midi' | 'frequency'>>;

/** Note object factory accepts one of InitProps types **/
type NoteInitProp = Partial<InitProps>;
