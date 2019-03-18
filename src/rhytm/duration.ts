
type NoteTypeSimple = 'w' | 'h' | 'q' | 'e' | 's' | 't';
type NoteTypeDotted = 'w.' | 'h.' | 'q.' | 'e.' | 's.' | 't.';
type NoteType = NoteTypeSimple | NoteTypeDotted;
type NoteValueLevel = 0 | 1 | 2 | 3 | 4 | 5;

interface NoteValueType {
    type: NoteType,
    simple: NoteTypeSimple,
    duration: number,
    level: NoteValueLevel,
    isDotted: boolean,
    half: NoteType,
    double: NoteType
}

const withDot = (value: string) => `${value}.`;
const isValid = (type: string): boolean => /^[whqest]{1}\.?$/.test(type);
const isDotted = (value: NoteType): boolean => value.includes('.');

const VALUES = 'whqest'.split('') as NoteTypeSimple[];
const VALUES_DOTTED = VALUES.map(withDot) as NoteTypeDotted[];


const typeLevel = (type: NoteType): number => {
    if (!isValid(type)) return null;
    return isDotted(type)
        ? VALUES_DOTTED.indexOf(<NoteTypeDotted>type)
        : VALUES.indexOf(<NoteTypeSimple>type);
}

const levelType = (level: number, dotted = false): NoteType => {
    return dotted
        ? VALUES_DOTTED[level]
        : VALUES[level];
}

const typeDuration = (type: NoteType): number => {
    if (!isValid(type)) return null;
    const level = typeLevel(type);
    return 2 ** -level + (isDotted(type) ? 2 ** -(level + 1) : 0);
}

const relativeTypeDuration = (type: NoteType, relativeType: NoteType = 'w'): number => {
    const duration = typeDuration(type);
    const relativeDuration = typeDuration(relativeType);
    return duration / relativeDuration;
}

const half = (type: NoteType): NoteType => levelType(typeLevel(type) + 1, isDotted(type));
const double = (type: NoteType): NoteType => levelType(typeLevel(type) - 1, isDotted(type));

const Duration = {
    withDot,
    isValid,
    isDotted,
    VALUES,
    VALUES_DOTTED,
    typeLevel,
    levelType,
    typeDuration,
    relativeTypeDuration,
    half,
    double
}

const NoteValue = (value: string): NoteValueType => {
    if (!isValid(value)) return null;
    const simple = <NoteTypeSimple>value[0];
    const type = <NoteType>value;
    const duration = typeDuration(type);
    const level = <NoteValueLevel>typeLevel(type);

    return {
        type,
        simple,
        duration,
        level,
        isDotted: isDotted(type),
        half: half(type),
        double: double(type)
    }
}


export {
    Duration,
    NoteValue,
    NoteType,
    NoteValueType
};




// const durationFromNoteValue = (value: number): NoteValueProps => {
//   const isDotted = Number.isInteger(Math.log2(value / 3));
//   const duration = isDotted ? -Math.log2(value * 2 / 3) : -Math.log2(value);
//   if (!Number.isInteger(duration)) return null;
//   const type = Duration.getNoteValue(duration);
//   return durationFromNoteType(type + (isDotted ? '.' : ''));
// }
// const durationFromNoteType = (noteValue: string) => {
//   if (!Duration.isValid(noteValue)) return null;

//   const type = noteValue[0];
//   const isDotted = noteValue[1] === '.' ? true : false;
//   const value = isDotted ? noteValue : type;
//   const level = Duration.levelOfType(type);

//   return {
//     type, isDotted, value, level, length, lengthIn, half, double
//   };

// };

// const NoteDuration = (value: string | number) => {
//   if (typeof value === 'string') return durationFromNoteType(value);
//   if (typeof value === 'number') return durationFromNoteValue(value);
//   return null;
// }




// /**
//  * Returns partition level of a note. w:1 0, h: 1, q: 2, ...
//  * 
//  * @param {string} duration - note duration: w, h, q, ...
//  * 
//  */
// const valueLevel = (duration: string): number => beatValue.indexOf(duration);

// /**
//  * Returns note value for current level of partition
//  * 
//  * @param {number} level - partition level. 0: w, 1: h, 2: q, ...
//  * 
//  */
// const levelValue = (level: number): string => beatValue[level];


// const division = (value: string, parts: number): string => {
//   return value.repeat(parts).split('').join('-');
// }

// const subdivision = (note: string, parts: number): string => {
//   if (parts === 1) return note;
//   const level = valueLevel(note);
//   const dividedNote = levelValue(level + 1);
//   return division(dividedNote, parts);
// }

// /**
//  * Returns array of note values for given @bar
//  * 
//  * @param {string} bar - string represented bar. Ex: 'h-h-h'
//  * 
//  */
// const barToNotes = (bar: string): string[] => bar.split('-');

// /**
//  * Returns string representation of a bar for given array of note values
//  * 
//  * @param notes 
//  * 
//  */
// const notesToBar = (notes: string[]): string => notes.join('-');

// /**
//  * All possible subdivision on next level for given note value
//  * 
//  * @param note 
//  * 
//  */
// const subdivisions = (note: string): string[] => {
//   return partitions.map((parts) => subdivision(note, parts));
// }

// const subdivisionsOnDepth = (note: string, level: number): string[] => {

// }

// console.log(subdivisions('h'));



// // const divide = (note, chance) => division[note][chance];
// // const randDivide = bar => bar.map(ch => divide(ch, flipCoin(3)));
// // const mapRandDivide = arr => arr.map(q => randDivide(q));
// // const printBar = bar => bar.reduce((acc, el, i) => `| ${el} ${acc}`, '|');
// // const shuffleBeat = arr =>
// //   compose(
// //     joinC('-'),
// //     mapRandDivide,
// //     splitC('-')
// //   )(arr);

// // const bar = ['q', 'q', 'q', 'q'];

// // /**
// //  *  [w   |h h |qqqq|]
// //  */

// // const sheet = () => {
// //   console.log(`
// //     1   2   3   4   1   2   3   4
// //   +---+---+---+---+---+---+---+---+
// //   | o |   | o |   | o |   | o |   |
// //   +---+---+---+---+---+---+---+---+
// //   | 1 | & | 2 | & | 3 | & | 4 | & |
// //   +---+---+---+---+---+---+---+---+
// //   `);
// // };

// // const noteValues = { w: 1, h: 2, q: 4, e: 8, s: 16, t: 32 };

// // const setNoteValuesForTempo = (note, t) => {
// //   let noteTypes = 'whqest'.split('');
// //   let duration = noteValues[note] * t;

// //   let durationOfType = noteTypes.map((el, i) => ({
// //     [el]: duration / noteValues[el]
// //   }));
// //   return durationOfType.reduce((acc, el, i) => Object.assign({}, acc, el));
// // };

// // const tempo = (bpm, note) => ({
// //   bpm,
// //   note,
// //   beatValue: 60.0 / bpm,
// //   noteValues: setNoteValuesForTempo(note, this.beatValue)
// // });

// // export { divide, randDivide, mapRandDivide, printBar, shuffleBeat, tempo };
