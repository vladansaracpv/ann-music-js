
import { NoteValueType, NoteValue } from './duration';
import { MetreType } from './metre';
import { TempoType } from './tempo';

export interface MeasureType {
    notes: NoteValueType[];
    metre: MetreType;
    tempo: TempoType
};

export interface TimelineNodeType {
    start: number;
    duration: number
    end: number
}

export const createMeasure = (noteValues: string | NoteValueType[], metre: MetreType, tempo: TempoType): MeasureType => {

    const notes = (typeof noteValues === 'string')
        ? noteValues.split('-').map(NoteValue.create)
        : noteValues;

    return { notes, metre, tempo }
}

export const timeline = (durations: number[]): TimelineNodeType[] => {
    return durations
        .reduce((acc, val, i) =>
            [
                ...acc,
                {
                    start: acc[i].end,
                    duration: val,
                    end: acc[i].end + val
                }
            ],
            [{ start: 0, duration: 0, end: 0 }]).slice(1);
}

export const sheet = (notes: NoteValueType[]) => {
    const durations = notes.map(note => ({
        unit: note.value,
        space: NoteValue.relativeTo(note, '8n')
    }));

    return durations;
}

export const minNoteValue = (noteValues: string | NoteValueType[]) => {
    const notes = (typeof noteValues === 'string')
        ? noteValues.split('-').map(NoteValue.create)
        : noteValues;
    return notes.reduce((a, b) => a.duration === Math.min(a.duration, b.duration) ? a : b);
}

export const maxNoteValue = (noteValues: string | NoteValueType[]) => {
    const notes = (typeof noteValues === 'string')
        ? noteValues.split('-').map(NoteValue.create)
        : noteValues;
    return notes.reduce((a, b) => a.duration === Math.max(a.duration, b.duration) ? a : b);
}

export const Measure = {
    create: createMeasure,
    timeline,
    sheet,
    minValue: minNoteValue,
    maxValue: maxNoteValue
}


/**
 *
    1        2        3            beats
    +--------+--------+--------++
    |q       |e   e   |q       ||  note value
    +--------+--------+--------++
    |1       |2   &   |3       ||  counting
    +--------+--------+--------++

 */


/**
 *  4/4(q)| 1 - 2 - 3 - 4
 *  4/4(e)| 1 - & - 2 - & - 3 - & - 4 - &
 *  4/4(s)| 1 - e - & - a - 2 - e - & - a - 3 - e - & - a - 4 - e - & - a
 */
