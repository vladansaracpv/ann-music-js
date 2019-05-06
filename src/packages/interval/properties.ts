// import {
//     EMPTY_INTERVAL,
//     NO_INTERVAL,
//     AUGMENTED_REGEX,
//     DIMINISHED_REGEX,
//     INTERVAL_TYPES,
//     INTERVAL_SIZES,
//     INTERVAL_CLASSES,
//     IvlProps,
//     Quality,
//     parseInterval,
// } from "./theory";
// import { glue, pipe, mod, dec, inc, either, compose, divC, len, fillStr, sign, eq } from '../helpers';
// import { midi, step, NoteStatic, NoteType } from '../note/properties';


// /**
//  * Get Chromatic Interval from Notes
//  * @param firstNote 
//  * @param secondNote 
//  * @returns Object {name, value}
//  */
// export const getChromaticInterval = (firstNote: string, secondNote: string) => {

//     const value = Math.abs(midi(firstNote) - midi(secondNote));

//     return {
//         name: `i${value}`,
//         value
//     }
// };

// /**
//  * Get Generic Interval from Notes
//  * @param firstNote 
//  * @param secondNote 
//  */
// export const getGenericInterval = (firstNote: string, secondNote: string) => {
//     const [a, b] = [step(firstNote), step(secondNote)];
//     const value = a <= b
//         ? b - 1 + 1
//         : b - a + 8;
//     return {
//         name: `I${value}`,
//         value
//     }
// }

// export const isMajor = (quality: string): boolean => eq(quality, Quality.MAJOR);
// export const isPerfect = (quality: string): boolean => eq(quality, Quality.PERFECT);
// export const isMinor = (quality: string): boolean => eq(quality, Quality.MINOR);
// export const isAugmented = (quality: string): boolean => AUGMENTED_REGEX.test(quality);
// export const isDiminished = (quality: string): boolean => DIMINISHED_REGEX.test(quality);


// const intervalAlteration = (type: string, quality: string) => {
//     if (isMajor(quality) || isPerfect(type)) return 0;
//     if (isMinor(quality)) return -1;
//     if (isAugmented(quality)) return len(quality);
//     if (isDiminished(quality)) return -len(quality) - either(0, 1, type === Quality.MINOR);
//     return null;
// }

// const intervalQuality = (type: string, alteration: number) => {
//     if (alteration === 0) return either('M', 'P', type === 'M');
//     if (alteration === -1 && type === 'M') return 'm';
//     if (alteration > 0) return fillStr('A', alteration);
//     if (alteration < 0) return fillStr('d', either(alteration, inc(alteration), type === 'P'));
//     return null;
// }





// /**
//  * ('C4', 'D4') => Interval
//  * ({midi: 60}, {midi:70}) => Interval
//  * ('m2') => Interval
//  * ({num:5, quality: 'M'}) => Interval
//  */
// const createIntervalFromNotes = (lower: Partial<NoteType>, higher: Partial<NoteType>) => {
//     const [l, h] = [NoteStatic.create(lower), NoteStatic.create(higher)];
//     const chromatic = getChromaticInterval(l.name, h.name);
//     // const 
// }

// const createIntervalFromProps = (props: Partial<IvlProps>) => {

// }


// const IntervalPropsFactory = {
//     fromNotes: createIntervalFromNotes,
//     fromInterval: createIntervalFromProps,
// };




// /**
//  * Create Interval object from string
//  * @param interval 
//  */
// export const createIntervalFromString = (interval: string): IvlProps => {

//     const { num, quality } = parseInterval(interval);
//     if (!(num && quality)) return NO_INTERVAL;

//     const name = `${num}${quality}`;
//     const step = pipe(Math.abs, dec, mod(7))(num);
//     const direction = sign(num);
//     const type = INTERVAL_TYPES[step];
//     const simple = either(num, direction * inc(num), Math.abs(num) === 8);
//     const octave = compose(Math.floor, divC(7), dec, Math.abs)(num);
//     const alteration = intervalAlteration(type, quality);
//     const offset = INTERVAL_SIZES[step] + alteration;
//     const semitones = direction * (offset + 12 * octave);
//     const chroma = (direction * offset < 0)
//         ? mod(12)(direction * offset + 12)
//         : mod(12)(direction * offset);

//     const ic = INTERVAL_CLASSES[chroma];

//     return Object.freeze({
//         ...EMPTY_INTERVAL,
//         num,
//         quality,
//         name,
//         step,
//         direction,
//         type,
//         simple,
//         octave,
//         alteration,
//         semitones,
//         chroma,
//         ic
//     });
// }

// // export const createIntervalFromProps = (num: number, semitones: number): IvlProps => {
// //     const direction = sign(num);
// //     const step = pipe(Math.abs, dec, mod(7))(num);
// //     const octave = compose(Math.floor, divC(7), dec, Math.abs)(num);
// //     const offset = semitones / direction - 12 * octave;
// //     const alteration = offset - INTERVAL_SIZES[step];
// //     const type = INTERVAL_TYPES[step];
// //     const quality = intervalQuality(type, alteration);
// //     const name = glue('', num, quality);
// //     const simple = either(num, direction * inc(num), Math.abs(num) === 8);
// //     const chroma = (direction * offset < 0) ? mod(12)(direction * offset + 12) : mod(12)(direction * offset);
// //     const ic = INTERVAL_CLASSES[chroma];

// //     return {
// //         ...EMPTY_INTERVAL,
// //         num,
// //         quality,
// //         name,
// //         step,
// //         direction,
// //         type,
// //         simple,
// //         octave,
// //         alteration,
// //         semitones,
// //         chroma,
// //         ic
// //     }
// // }
