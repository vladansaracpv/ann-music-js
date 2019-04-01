import { parseInterval, EMPTY_INTERVAL, TYPES, SIZES, CLASSES, IvlProps } from "./theory";
import { glue, pipe, mod, dec, either, compose, divC, len, fillStr } from '../helpers';
import { inc } from "ramda";


export const KEYS = [
    'alteration',
    'semitones',
    'chroma',
    'ic'
];

const isMajor = (type: string, quality: string): boolean => glue(type, quality) === 'MM';
const isPerfect = (type: string, quality: string): boolean => glue(type, quality) === 'PP';
const isMinor = (type: string, quality: string): boolean => glue(type, quality) === 'Mm';
const isAugmented = (quality: string): boolean => /^A+$/.test(quality);
const isDiminished = (quality: string): boolean => /^d+$/.test(quality);

const intervalAlteration = (type: string, quality: string) => {
    if (isMajor(type, quality) || isPerfect(type, quality)) return 0;
    if (isMinor(type, quality)) return -1;
    if (isAugmented(quality)) return len(quality);
    if (isDiminished(quality)) return -len(quality) - either(0, 1, type === 'P');
    return null;
}

const intervalQuality = (type: string, alteration: number) => {
    if (alteration === 0) return either('M', 'P', type === 'M');
    if (alteration === -1 && type === 'M') return 'm';
    if (alteration > 0) return fillStr('A', alteration);
    if (alteration < 0) return fillStr('d', either(alteration, inc(alteration), type === 'P'));
    return null;
}

export const fromName = (interval: string): IvlProps => {
    const { num, quality } = parseInterval(interval);
    if (!(num && quality)) return null;

    const name = glue('', num, quality);
    const step = pipe(Math.abs, dec, mod(7))(num);
    const direction = either(-1, 1, num < 0)
    const type = TYPES[step];
    const simple = either(num, direction * inc(num), Math.abs(num) === 8);
    const octave = compose(Math.floor, divC(7), dec, Math.abs)(num);
    const alteration = intervalAlteration(type, quality);
    const offset = SIZES[step] + alteration;
    const semitones = direction * (offset + 12 * octave);
    const chroma = (direction * offset < 0) ? mod(12)(direction * offset + 12) : mod(12)(direction * offset);

    const ic = CLASSES[chroma];

    return {
        ...EMPTY_INTERVAL,
        num,
        quality,
        name,
        step,
        direction,
        type,
        simple,
        octave,
        alteration,
        semitones,
        chroma,
        ic
    }
}

export const fromNumAndSemitones = (num: number, semitones: number): IvlProps => {
    const direction = either(-1, 1, num < 0);
    const step = pipe(Math.abs, dec, mod(7))(num);
    const octave = compose(Math.floor, divC(7), dec, Math.abs)(num);
    const offset = semitones / direction - 12 * octave;
    const alteration = offset - SIZES[step];
    const type = TYPES[step];
    const quality = intervalQuality(type, alteration);
    const name = glue('', num, quality);
    const simple = either(num, direction * inc(num), Math.abs(num) === 8);
    const chroma = (direction * offset < 0) ? mod(12)(direction * offset + 12) : mod(12)(direction * offset);
    const ic = CLASSES[chroma];



    return {
        ...EMPTY_INTERVAL,
        num,
        quality,
        name,
        step,
        direction,
        type,
        simple,
        octave,
        alteration,
        semitones,
        chroma,
        ic
    }
}
