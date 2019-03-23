
import { NoteValueType, NoteValueModel } from './duration';

interface Tempo {
    bpm: number;
    beat: NoteValueType;
    duration(note: string): number;
};

const TempoFactory = (bpm: number, note: string): Tempo => {

    const beat = NoteValueModel(note);

    const duration = (note: string | NoteValueType): number => {
        const unit = (typeof note === 'string')
            ? NoteValueModel(note)
            : note;
        return (unit.value / beat.value) * (60 / bpm);
    }

    return Object.freeze({ bpm, beat, duration });
};

export {
    Tempo,
    TempoFactory
}
