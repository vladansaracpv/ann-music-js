import { glue, either, charAtEq, len, pipe, curry, mod, dec, lt } from '../helpers';
import { EMPTY_NOTE, parseNote, WITH_SHARPS, WITH_FLATS, NO_NOTE, LETTERS, OCTAVE_SIZE } from './theory';


/** INTERFACES */

export interface NoteProps {
  name: string;
  letter: string;
  step: number;
  accidental: string;
  alteration: number;
  octave: number;
  pc: string;
  chroma: number;
  midi: number;
  frequency: number;
};





/** HELPER FUNCTIONS */

const mod12 = mod(12);
const isNegative = (n: number) => lt(0, n);
const tuneNote = (midi: number, tuning = 440): number => tuning * 2 ** ((midi - 69) / OCTAVE_SIZE);
const quotient = (n: number) => (a: number) => Math.floor(a / n);
const accidentalValue = (accidental: string): number => {
  return either(
    -len(accidental),
    len(accidental),
    charAtEq(0, 'b', accidental)
  );
}
const octaveFromMidi = (midi: number): number => {
  return pipe(
    quotient(OCTAVE_SIZE),
    dec
  )(midi);
}





/** FACTORY FUNCTIONS */

const fromName = (note: string): NoteProps => {
  const note_tokens = parseNote(note);
  if (!note_tokens) return NO_NOTE;

  const { letter, accidental } = note_tokens;

  const name = note;

  const alteration = accidentalValue(accidental);

  const step = LETTERS.indexOf(letter);

  const pc = glue(letter, accidental);

  const offset = alteration + either(
    WITH_FLATS.indexOf(letter),
    WITH_SHARPS.indexOf(letter),
    alteration < 0
  );
  const altOctave = Math.floor(offset / OCTAVE_SIZE);

  const octave = note_tokens.octave + altOctave;

  const chroma = either(
    mod12(offset - altOctave * OCTAVE_SIZE),
    mod12(offset),
    isNegative(altOctave)
  )
  const midi = (octave + 1) * OCTAVE_SIZE + chroma;
  const frequency = tuneNote(midi);

  const _note = {
    ...EMPTY_NOTE,
    name,
    accidental,
    alteration,
    letter,
    step,
    pc,
    chroma,
    midi,
    frequency,
    octave,
  };
  return _note;

}
const fromChromaOctave = (chroma: number, octave: number, usingSharps = true): NoteProps => {
  const pc = either(
    WITH_SHARPS[chroma],
    WITH_FLATS[chroma],
    usingSharps
  );
  const name = glue(pc, octave);
  return NoteStatic.fromName(name);
}
const fromMidi = (midi: number, usingSharps = true): NoteProps => {
  const octave = octaveFromMidi(midi);
  const chroma = midi - (octave + 1) * OCTAVE_SIZE;
  return NoteStatic.fromChromaOctave(chroma, octave, usingSharps);
}
const fromFrequency = (freq: number, usingSharps = true, tuning = 440): NoteProps => {
  const midi = Math.ceil(OCTAVE_SIZE * Math.log2(freq / tuning) + 69);
  return NoteStatic.fromMidi(midi, usingSharps);
}
const fromPartial = (props: Partial<NoteProps>, usingSharps = true): NoteProps => {
  const { name, letter, step, accidental, alteration, octave, pc, chroma, midi, frequency } = props;
  if (name) return NoteStatic.fromName(name);
  if (midi) return NoteStatic.fromMidi(midi, usingSharps);
  if (frequency) return NoteStatic.fromFrequency(frequency, usingSharps);
  if (octave && chroma) return NoteStatic.fromChromaOctave(chroma, octave, usingSharps);
  return NO_NOTE;
}






/** NOTE STATIC METHODS */

const cache = {} as { [key: string]: NoteProps };
const property = curry((prop: string, name: string) => NoteStatic.fromName(name)[prop]);
const properties = (props: Partial<NoteProps>): NoteProps => {
  if (cache[props.name]) return cache[props.name];
  const note: NoteProps = NoteStatic.fromPartial(props);
  return cache[note.name] || (cache[note.name] = NoteStatic.fromPartial(props));
};
const simplify = (name: string, sameSign = true): string => {

  const { chroma, alteration, octave } = NoteStatic.fromName(name);

  const isSharp = alteration >= 0;

  const pc = either(
    either(WITH_SHARPS[chroma], WITH_FLATS[chroma], sameSign),
    either(WITH_FLATS[chroma], WITH_SHARPS[chroma], sameSign),
    isSharp
  );

  return glue(pc, octave);

};
const enharmonic = (name: string): string => simplify(name, false);


export const NoteStatic = {
  fromName,
  fromMidi,
  fromChromaOctave,
  fromFrequency,
  fromPartial,
  create: properties,
  simplify,
  enharmonic,
  property
}





/** NOTE PROPERTY METHODS */

export const name = (note: string) => property('name', note);
export const letter = (note: string) => property('letter', note);
export const step = (note: string) => property('step', note);
export const accidental = (note: string) => property('accidental', note);
export const alteration = (note: string) => property('alteration', note);
export const octave = (note: string) => property('octave', note);
export const pc = (note: string) => property('pc', note);
export const chroma = (note: string) => property('chroma', note);
export const midi = (note: string) => property('midi', note);
export const frequency = (note: string) => property('frequency', note);






