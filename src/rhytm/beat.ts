
import { NoteValueType, NoteValue } from './duration';

export interface BeatType {
    notes: NoteValueType[],
    duration: number;
}

export const createBeat = (values: string | NoteValueType[]) => {
    const notes = (typeof values === 'string')
        ? values.split('-').map(NoteValue.create)
        : values;

    const duration = notes.reduce((acc, val) => (acc + val.duration), 0);

    return {
        notes,
        duration
    }
}

export const splitBeat = (beat: string | NoteValueType): NoteValueType[] => Array(2).fill(NoteValue.split(beat));

export const Beat = {
    create: createBeat,
    split: splitBeat
}
