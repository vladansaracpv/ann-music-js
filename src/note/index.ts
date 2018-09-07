import { error } from '../error';

const REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;

export const LETTERS = 'CDEFGAB';

export const ACCIDENTALS = '# b'.split('');

export const NOTES = "C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B".split(" ");

export const ALL_NOTES = NOTES;

export const SHARPS_ONLY = NOTES.filter(x => x.includes('#'));

export const FLATS_ONLY = NOTES.filter(x => x.includes('b'));

export const NATURALS_ONLY = ALL_NOTES.filter(x => x.length == 1);

export const SHARPS = NOTES.filter(x => FLATS_ONLY.indexOf(x) == -1);

export const FLATS = NOTES.filter(x => SHARPS_ONLY.indexOf(x) == -1);

export const SEMI = [0, 2, 4, 5, 7, 9, 11];

export const KEYS = ['name', 'letter', 'accidental', 'octave', 'pc', 'step', 'alteration', 'chroma', 'midi', 'frequency'];

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
};

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
}

// export const NO_NOTE = Object.freeze(KEYS.reduce((o, key) => ({ ...o, [key]: undefined}), {}));
export const NO_NOTE: Note = Object.freeze({
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
})

// Helper functions
const charOnly = (s: string, char: string):boolean => s == char.repeat(s.length);
const midiToFreq = (midi:number, tuning = 440) => Math.pow(2, (midi - 69) / 12) * tuning;

// Build note properties

const name_ = (pc: string, octave?: string) => octave ? pc + Number.parseInt(octave) : pc;
const letter_ = (letter:string) => letter.toUpperCase();
const pc_ = (letter:string, accidentals?: string):string => accidentals ? letter.toUpperCase() + accidentals : letter.toUpperCase();
const octave_ = (octave:string) => octave ? Number.parseInt(octave) : undefined;
const step_ = (letter:string) => LETTERS.includes(letter) ? LETTERS.indexOf(letter) : undefined;
const alteration_ = (accidental:string):number => charOnly(accidental, '#') ? accidental.length : -accidental.length
const chroma_ = (step:number, alteration: number) => (SEMI[step] + alteration + 120) % 12;
const midi_ = (octave:number, step: number, alteration: number) => octave ? SEMI[step] + alteration + 12 * (octave + 1) : undefined;
const frequency_ = (midi: number):number => midi? midiToFreq(midi) : undefined;

export const parse = (note='') => {
    const props = REGEX.exec(note);
    if (!props) return [];
    return props ? [props[1].toUpperCase(), props[2].replace(/x/g, "##"), props[3], props[4]] : [];
};

export const NOTE = (name:string): Note => {
    const [letter, accidental, octave, rest] = parse(name);
    if (letter === "" || rest !== "") return NO_NOTE;
    let note: Note = EMPTY_NOTE;
    note.letter = letter_(letter);
    note.accidental = accidental;
    note.octave = octave_(octave);
    note.pc = pc_(note.letter, note.accidental);
    note.name = name_(note.pc + note.octave);
    note.step = step_(note.letter);
    note.alteration = alteration_(note.accidental);
    note.chroma = chroma_(note.step, note.alteration);
    note.midi = midi_(note.octave, note.step, note.alteration);
    note.frequency = frequency_(note.midi);

    return note;
};


export const property = (name='', note='') => {
    if(name + note === '') return error('NO_PARAMS_ERROR', {name, note})
    if(note === '') return note => property(name, note);
    if(name === '') return name => property(name, note);
    if (!KEYS.indexOf(name)) return error('UNDEFINED_PROPERTY', {name, note});
    return NOTE(note)[name];
};

export const name = note => NOTE(note)['name'];
export const letter = note => NOTE(note)['letter'];
export const accidental = note => NOTE(note)['accidental'];
export const octave = note => NOTE(note)['octave'];
export const pc = note => NOTE(note)['pc'];
export const step = note => NOTE(note)['step'];
export const alteration = note => NOTE(note)['alteration'];
export const chroma = note => NOTE(note)['chroma'];
export const midi = note => NOTE(note)['midi'];
export const frequency = note => NOTE(note)['frequency'];

export const fromMidi = (num, sharps) => {
    num = Math.round(num);
    const pcs = sharps === true ? SHARPS : FLATS;
    const pc = pcs[num % 12];
    const o = Math.floor(num / 12) - 1;
    return pc + o;
  }

export const simplify = (note, sameAcc=true) => {

    const { alteration, chroma, midi } = NOTE(note);

    if (chroma === null) return null;
    const useSharps = sameAcc === false ? alteration < 0 : alteration > 0;
    return midi === null
      ? pc(fromMidi(chroma, useSharps))
      : fromMidi(midi, useSharps);
}

export const enharmonic = note => simplify(note, false);

console.log(frequency('F####4'));
