const gsum = (a1: number, r: number, n: number): number => a1 * (1 - r ** n) / (1 - r);

const tokenize = (str: string, regex: string | RegExp) => str.match(regex) ? str.match(regex)['groups'] : null;

/**
 * Note Value Model
 * 
 * @name      {string} full name for given note value string
 * @relative  {number} quotient in respect to whole note. 2 - means half, 4 - means quarter, etc
 * @kind      {string}  n | t | r | value kind can represent note, triplet or rest
 * @dots      {string} dotted part
 * @value     relative duration. 2n = 0.5, 4n = 0.25, 2n. = 0.75
 */
interface NoteValueType {
    short: string;
    name: string;     // '2n.'
    relative: number; // 2
    kind: string;     // 'n'
    dots: string;     // '.'
    value: number;    // 0.75
}


interface NoteValue {
    props: NoteValueType,
    half(): NoteValueType
    double(): NoteValueType
}


const NOTE_VALUE_REGEX = /^(?<relative>(1|2|4|8|16|32){1})(?<kind>[nts]{1})(?<dots>\.{0,2})/;
const SHORT_NAMES = { 1: 'w', 2: 'h', 4: 'q', 8: 'e', 16: 's', 32: 't' }

const isNoteValue = (note: string): boolean => NOTE_VALUE_REGEX.test(note);


const NoteValueModel = (note: string): NoteValueType => {

    if (!isNoteValue(note)) return null;

    const tokens = tokenize(note, NOTE_VALUE_REGEX);
    const name = note;
    const relative = +tokens.relative;
    const short = SHORT_NAMES[relative];
    const value = gsum(1 / relative, 1 / 2, tokens.dots.length + 1);
    const data: NoteValueType = { ...tokens, name, relative, short, value }

    return Object.freeze(data);
}


const NoteValueFactory = (note: string | NoteValueType): NoteValue => {

    const props = (typeof note === 'string')
        ? NoteValueModel(note)
        : note;

    const half = () => NoteValueModel(`${props.relative * 2}${props.kind}${props.dots}`);
    const double = () => NoteValueModel(`${props.relative / 2}${props.kind}${props.dots}`);

    return Object.freeze({ props, half, double });
}

// export {
//     NoteValueType,
//     NoteValue,
//     isNoteValue,
//     NoteValueModel,
//     NoteValueFactory,
// }
