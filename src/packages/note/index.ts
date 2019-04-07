/**
 * Collect and export all files from module
 *
 * note (type)
 * --factories (for creating NoteProperty type)
 *   -- accidental
 *   -- alteration
 *   -- chroma
 *   -- frequency
 *   -- letter
 *   -- midi
 *   -- name
 *   -- octave
 *   -- pc
 *   -- step
 * --properties (for manipulating NoteProperty)
 *
 */



/**
 * -Theory
 * -Types
 * -Properties
 * -Methods
 */


namespace Theory {
    /**
 * Theory constants
 */

    export const OCTAVE_SIZE = 12;

    export const LETTERS = 'CDEFGAB';

    export const ACCIDENTALS = 'b#'.split('');

    export const ALL_NOTES = 'C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B'.split(' ');

    export const NATURALS = LETTERS.split('');

    export const SHARP_NOTES = 'C# D# F# G# A#'.split(' ');

    export const FLAT_NOTES = 'Db Eb Gb Ab Bb'.split(' ');

    export const WITH_SHARP_NOTES = 'C C# D D# E F F# G G# A A# B'.split(' ');

    export const WITH_FLAT_NOTES = 'C Db D Eb E F Gb G Ab A Bb B'.split(' ');

    export const WHITE_KEYS = [0, 2, 4, 5, 7, 9, 11];

    export const BLACK_KEYS = [1, 3, 6, 8, 10];

    export const NOTE_REGEX = /^(?<letter>[a-gA-G]?)(?<accidental>#{1,}|b{1,}|x{1,}|)(?<octave>-?\d*)\s*(?<rest>.*)$/;




}

import { NoteStatic as Note, NoteType } from './properties';
import { Operators as O, OperatorsType } from './operators';
import { distance as distanceTo } from './distance';
import { either, andN } from '../helpers';
import { isNote, isKey } from './validator';
import { Frequency } from './properties/frequency';


interface Note extends NoteType, OperatorsType {
    simple: string,
    enharmonic: string,
    transpose: (semitones: number) => NoteType,
    distance: (note: Partial<NoteType>, absolute?: boolean) => number,
    toProperty: (property: string) => any
};

/** NOTE OBJECT */

export const NoteFactory = (props: Partial<Note>): Note => {

    const data = Note.create(props);

    if (!data.name || !isNote(data)) return null;

    const simple = Note.simplify(data.name);
    const enharmonic = Note.enharmonic(data.name);

    const transpose = (semitones: number): NoteType => NoteFactory({ midi: data.midi + semitones });

    const distance = (to: Partial<NoteType>, absolute = false): number => {
        const note = NoteFactory(to);
        if (!note.name || !isNote(note)) return null;
        const from = distanceTo(note.midi);

        return either(
            Math.abs(from(data.midi)),
            from(data.midi),
            absolute
        );
    }

    const comparable = (op: string, note: Partial<NoteType>, prop = 'midi'): boolean => {
        return isKey(prop) && O[op](Note.create(note)[prop])(data[prop])
    }

    const operators = {
        leq: (note: Partial<NoteType>, prop?: string) => comparable('lte', note, prop),
        lt: (note: Partial<NoteType>, prop?: string) => comparable('lt', note, prop),
        eq: (note: Partial<NoteType>, prop?: string) => comparable('eq', note, prop),
        gt: (note: Partial<NoteType>, prop?: string) => comparable('gt', note, prop),
        geq: (note: Partial<NoteType>, prop?: string) => comparable('geq', note, prop),
        inInterval: (a: Partial<NoteType>, b: Partial<NoteType>, prop?: string) => andN(comparable('gt', a, prop), comparable('lt', b, prop)),
        inSegment: (a: Partial<NoteType>, b: Partial<NoteType>, prop?: string) => andN(comparable('geq', a, prop), comparable('leq', b, prop)),
    };

    const toProperty = (key: string) => {
        if (key === 'frequency') return Frequency.create(data.frequency);
    }

    return Object.freeze({
        ...data,
        simple,
        enharmonic,
        ...operators,
        transpose,
        distance,
        toProperty
    })
}
