import { Beat } from './beat';
import { NoteValue } from './duration';

interface TempoType {
    bpm: number;
    measure: string;
    duration(notes: string): number;
    toString(): string;
};

const Tempo = (bpm: number, measure: string): TempoType => {
    const toString = () => `${bpm}:${measure}`;
    const duration = (notes: string) => {
        const durationOfNotes = Beat(notes).duration;
        const durationOfMeasure = NoteValue(measure).duration;
        const valueInType = durationOfNotes / durationOfMeasure;
        return valueInType * 60 / bpm;
    }

    return {
        bpm,
        measure,
        duration,
        toString,
    }
};

export {
    Tempo,
    TempoType
}
