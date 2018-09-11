import { error } from "../error";
import compose from "../helpers";

namespace Theory {
  // Regular expression for parsing notes. Note => [letter, accidental, octave, rest]
  export const REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;

  // Letters used for tone note names
  export const LETTERS = "CDEFGAB";

  // Accidentals symbols. # - sharps, b - flats
  export const ACCIDENTALS = "# b".split(" ");

  // All note names. Both sharps and flats
  export const NOTES = "C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B".split(" ");

  // Alias for NOTES
  export const ALL_NOTES = NOTES;

  // Only sharp notes
  export const SHARPS_ONLY = NOTES.filter(x => x.includes("#"));

  // Only flat notes
  export const FLATS_ONLY = NOTES.filter(x => x.includes("b"));

  // Only natural notes (without sharps or flats)
  export const NATURALS_ONLY = ALL_NOTES.filter(x => x.length == 1);

  // Natural + Sharps
  export const SHARPS = NOTES.filter(x => FLATS_ONLY.indexOf(x) == -1);

  // Natural + Flats
  export const FLATS = NOTES.filter(x => SHARPS_ONLY.indexOf(x) == -1);

  // Natural notes positions in C chromatic scale
  export const SEMI = [0, 2, 4, 5, 7, 9, 11];
}

// Note properties
export const KEYS = [
  "name",
  "letter",
  "accidental",
  "octave",
  "pc",
  "step",
  "alteration",
  "chroma",
  "midi",
  "frequency"
];

// Note data type
interface Note {
  name: any;
  letter: any;
  accidental: any;
  octave: any;
  pc: any;
  step: any;
  alteration: any;
  chroma: any;
  midi: any;
  frequency: any;
}

// Empty note object
export const EMPTY_NOTE = {
  name: null,
  letter: null,
  accidental: null,
  octave: null,
  pc: null,
  step: null,
  alteration: null,
  chroma: null,
  midi: null,
  frequency: null
};
// Empty note immutable type
export const NO_NOTE = Object.freeze({
  name: null,
  letter: null,
  accidental: null,
  octave: null,
  pc: null,
  step: null,
  alteration: null,
  chroma: null,
  midi: null,
  frequency: null
});

// Helper functions
const isCharOnly = (s: string, char: string): boolean =>
  s == char.repeat(s.length);
const midiToFreq = (midi: number, tuning = 440) =>
  Math.pow(2, (midi - 69) / 12) * tuning;
const freqToMidi = (freq, tuning = 440) => {
  if (typeof freq == "number") {
    freq *= 1.0;
  }
  if (typeof freq !== "number") {
    return null;
  }

  return Math.ceil(12 * Math.log2(freq / tuning) + 69);
};

// Build note properties
const name_ = (pc: string, octave?: string) =>
  octave ? pc + Number.parseInt(octave) : pc;

const letter_ = (letter: string) => letter.toUpperCase();

const pc_ = (letter: string, accidentals?: string): string =>
  accidentals ? letter.toUpperCase() + accidentals : letter.toUpperCase();

const octave_ = (octave: string) =>
  octave ? Number.parseInt(octave) : undefined;

const step_ = (letter: string) =>
  Theory.LETTERS.includes(letter) ? Theory.LETTERS.indexOf(letter) : undefined;

const alteration_ = (accidental: string): number =>
  isCharOnly(accidental, "#") ? accidental.length : -accidental.length;

const chroma_ = (step: number, alteration: number) =>
  (Theory.SEMI[step] + alteration + 120) % 12;

const midi_ = (octave: number, step: number, alteration: number) =>
  octave ? Theory.SEMI[step] + alteration + 12 * (octave + 1) : undefined;

const frequency_ = (midi: number): number =>
  midi ? midiToFreq(midi) : undefined;

// Function to parse note from note string
export const parse = (note = "") => {
  const props = Theory.REGEX.exec(note);
  if (!props) return [];
  return props
    ? [props[1].toUpperCase(), props[2].replace(/x/g, "##"), props[3], props[4]]
    : [];
};

// Create note from note string
export const NOTE = name => {
  if (!name) return _name => NOTE(_name);
  const [letter, accidental, octave, rest] = parse(name);
  if (letter === "" || rest !== "") return NO_NOTE;
  let note = EMPTY_NOTE;
  note.letter = letter_(letter);
  note.accidental = accidental;
  note.octave = octave_(octave);
  note.pc = pc_(note.letter, note.accidental);
  note.name = name_(note.pc, note.octave);
  note.step = step_(note.letter);
  note.alteration = alteration_(note.accidental);
  note.chroma = chroma_(note.step, note.alteration);
  note.midi = midi_(note.octave, note.step, note.alteration);
  note.frequency = frequency_(note.midi);

  return note;
};

// Get single note property from note name
export const property = (name = "", note = "") => {
  if (name + note === "")
    return error("NO_PARAMS_ERROR", {
      name,
      note
    });
  if (note === "") return note => property(name, note);
  if (name === "") return name => property(name, note);
  if (!KEYS.indexOf(name))
    return error("UNDEFINED_PROPERTY", {
      name,
      note
    });
  return NOTE(note)[name];
};

// Getters fro note properties
export const name = note => NOTE(note)["name"];
export const letter = note => NOTE(note)["letter"];
export const accidental = note => NOTE(note)["accidental"];
export const octave = note => NOTE(note)["octave"];
export const pc = note => NOTE(note)["pc"];
export const step = note => NOTE(note)["step"];
export const alteration = note => NOTE(note)["alteration"];
export const chroma = note => NOTE(note)["chroma"];
export const midi = note => NOTE(note)["midi"];
export const frequency = note => NOTE(note)["frequency"];

// Get note from midi value
export const fromMidi = (num, sharps = true) => {
  num = Math.round(num);
  const pcs = sharps === true ? Theory.SHARPS : Theory.FLATS;
  const pc = pcs[num % 12];
  const o = Math.floor(num / 12) - 1;
  return pc + o;
};

export const fromFreq = (num, sharps = true) =>
  compose(fromMidi, freqToMidi)(num, sharps);

// Simplify note. Ex: C### = D#
export const simplify = (note, sameAcc = true) => {
  const _note = NOTE(note);
  const alteration = _note["alteration"];
  const chroma = _note["chroma"];
  const midi = _note["midi"];

  if (chroma === null) return name(note);
  const useSharps = sameAcc === false ? alteration < 0 : alteration > 0;
  return !midi ? pc(fromMidi(chroma, useSharps)) : fromMidi(midi, useSharps);
};

export const enharmonic = note => simplify(note, false);

const NoteFactory = () => {
  const factoryMethods = {
    midi: (num, sharps?) => NOTE(fromMidi(num, sharps)),
    name: NOTE,
    frequency: (num, sharps?) => NOTE(fromFreq(num, sharps))
  };

  const noteFrom = (type?, value?) => {
    if (!type) return factoryMethods;
    if (typeof type !== "string") return null;

    return value ? factoryMethods[type](value) : factoryMethods[type];
  };

  const commands = {
    from: noteFrom,
    with: noteFrom
  };

  return commands;
};

export const create = (what?) => {
  const factory_methods = {
    note: NoteFactory()
  };
  if (!what) return factory_methods;

  return factory_methods[what];
};

export const transpose = (note, amount) => {
    const _midi = midi(note);
    console.log('asd',_midi);

    if (_midi) return compose(fromMidi)(midi + amount);
    const _chroma = chroma(note);
    console.log('_chroma', compose(pc, fromMidi)(_chroma+amount));
    return compose(pc, fromMidi)(_chroma);
}

let fromName = create("note").from("frequency")(220);
transpose('C#',24);
