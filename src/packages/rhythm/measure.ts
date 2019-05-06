
// import { NoteValueType, NoteValueModel } from './duration';
// import { Meter } from './meter';
// import { Tempo } from './tempo';

// interface Measure {
//     notes: NoteValueType[],
//     meter: Meter,
//     tempo: Tempo
// }

// const isValidMeasure = (measure: Measure): boolean => {
//     const { notes, meter } = measure;
//     const notesLen = notes
//         .map(note => note.value)
//         .reduce((acc, value) => acc + value);

//     const measureLen = meter.top / meter.bottom;

//     return (notesLen === measureLen) && (notes.length === meter.top);
// }

// const MeasureFactory = (noteArr: string | NoteValueType[], meter: Meter, tempo: Tempo) => {
//     const notes = (typeof noteArr === 'string')
//         ? noteArr.split('-').map(NoteValueModel)
//         : noteArr;

//     return { notes, meter, tempo };
// }





// /**
//  *
//     1        2        3            beats
//     +--------+--------+--------++
//     |q       |e   e   |q       ||  note value
//     +--------+--------+--------++
//     |1       |2   &   |3       ||  counting
//     +--------+--------+--------++

//     1-------2-------3-------4-------
//     1---&---2---&---3---&---4---&---
//     1-e-&-a-2-e-&-a-3-e-&-a-4-e-&-a-

//  */

// /**
//  *  4/4(q)| 1 - 2 - 3 - 4
//  *  4/4(e)| 1 - & - 2 - & - 3 - & - 4 - &
//  *  4/4(s)| 1 - e - & - a - 2 - e - & - a - 3 - e - & - a - 4 - e - & - a
//  */


// export {
//     Measure,
//     isValidMeasure,
//     MeasureFactory,
// }

// // export interface TimelineNodeType {
// //     start: number;
// //     duration: number
// //     end: number
// // }

// // const timelineNode = ({ start: 0, duration: 0, end: 0 });



// // // export const timeline = (durations: number[]): TimelineNodeType[] => durations
// // //     .reduce((acc, val, i) =>
// // //         [...acc, { start: acc[i].end, duration: val, end: acc[i].end + val }],
// // //         [timelineNode]).slice(1);

// // // export const sheet = (notes: NoteValue[]) => {
// // //     const durations = notes.map(note => ({
// // //         unit: note.value,
// // //         // space: NoteValue.relativeTo(note, '8n')
// // //     }));

// // //     return durations;
// // // }

// // // export const minNoteValue = (noteValues: string | NoteValue[]) => {
// // //     const notes = (typeof noteValues === 'string')
// // //         ? noteValues.split('-').map(NoteValue.create)
// // //         : noteValues;
// // //     return notes.reduce((a, b) => a.duration === Math.min(a.duration, b.duration) ? a : b);
// // // }

// // // export const maxNoteValue = (noteValues: string | NoteValue[]) => {
// // //     const notes = (typeof noteValues === 'string')
// // //         ? noteValues.split('-').map(NoteValue.create)
// // //         : noteValues;
// // //     return notes.reduce((a, b) => a.duration === Math.max(a.duration, b.duration) ? a : b);
// // // }

// // // export const Measure = {
// // //     create: createMeasure,
// // //     timeline,
// // //     sheet,
// // //     minValue: minNoteValue,
// // //     maxValue: maxNoteValue
// // // }


