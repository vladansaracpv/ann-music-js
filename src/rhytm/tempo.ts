
import { NoteValueType, NoteValue } from './duration';

export interface TempoType {
    bpm: number;
    beat: NoteValueType;
    tick: number;
};

export const createTempo = (bpm: number, note: string | NoteValueType): TempoType => {

    const beat = (typeof note === 'string')
        ? NoteValue.create(note)
        : note;

    const tick = 60 / bpm;

    return { bpm, beat, tick }
};

export const noteValueInSeconds = (tempo: TempoType, note: string | NoteValueType) => {
    const unit = (typeof note === 'string') ? NoteValue.create(note) : note;
    const relativeValue = NoteValue.relativeTo(unit, tempo.beat);
    return relativeValue * tempo.tick;
}

export const Tempo = {
    create: createTempo,
    noteDuration: noteValueInSeconds
}
