import { MetreType } from './metre';
import { Beat, BeatType } from './beat';

interface MeasureType {
    beats: BeatType[];
    ts: MetreType;
    simple: string;
    beatAt(index: number): BeatType;
    sheet(level: string): string
};

const Measure = (beats: BeatType[], ts: MetreType): MeasureType => {
    const simple = beats.map(beat => beat.simple).join('-');
    const beatAt = (index: number) => index <= beats.length ? beats[index] : null;
    const sheet = (level = 'q'): string => beats.map(beat => beat.simple).join(' | ');

    return {
        beats,
        ts,
        simple,
        beatAt,
        sheet
    }
}

export {
    Measure,
    MeasureType
}
