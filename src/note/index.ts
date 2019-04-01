
import { NoteStatic as Note, NoteProps } from './properties';
import { Operators as O, OperatorsType } from './operators';
import { distance as distanceTo } from './distance';
import { either, andN } from '../helpers';
import { isNote, isKey } from './validator';


interface NoteType extends NoteProps, OperatorsType {
    simple: string,
    enharmonic: string,
    transpose: (semitones: number) => NoteType,
    distance: (note: Partial<NoteProps>, absolute?: boolean) => number,
}





/** NOTE OBJECT */

export const NoteFactory = (props: Partial<NoteProps>): NoteType => {

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

    return Object.freeze({
        ...data,
        simple,
        enharmonic,
        ...operators,
        transpose,
        distance,
    })
}
