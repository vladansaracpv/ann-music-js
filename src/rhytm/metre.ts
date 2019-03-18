import { NoteValue, NoteValueType } from './duration';

interface MetreType {
    type: string;
    beats: number;
    measure: NoteValueType;
    duration: number;
    toString(): string;
}

const METRES = ['simple', 'compound', 'complex'];
const SIMPLE_METRES = [2, 3, 4];
const COMPOUND_METRES = [6, 9, 12];
const COMPLEX_METRES = [5, 7, 8, 10, 11, 13, 14, 15, 16];

const metreType = (beats: number): string => {
    if (beats <= 4) return 'simple';
    if (beats % 3 === 0) return 'compound';
    return 'complex';
}

const Metre = (beats: number, noteType: string): MetreType => {
    const type = metreType(beats);
    const measure = NoteValue(noteType);
    const duration = beats * measure.duration;
    const toString = () => `${beats}/${measure.type}`;

    return {
        type,
        beats,
        measure,
        duration,
        toString
    }
};

export {
    Metre,
    MetreType
}
