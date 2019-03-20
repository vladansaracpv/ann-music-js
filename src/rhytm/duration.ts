
const geometricSum = (first: number, n: number): number => first * (1 - Math.pow(.5, n)) / .5;

const NOTE_VALUE_REGEX = /^(?<relative>(1|2|4|8|16|32){1})(?<type>[nts]{1})(?<dots>\.{0,2})/;

const tokenize = (note: string) => {

    const tokens = note.match(NOTE_VALUE_REGEX)['groups'];

    if (!tokens['relative']) return null;

    return {
        relative: +tokens['relative'],
        type: tokens['type'],
        dots: tokens['dots'].length
    };
}


export interface NoteValueType {
    value: string;
    relative: number;
    type: string;
    dots: number;
    duration: number;
}


export const isValid = (note: string): boolean => NOTE_VALUE_REGEX.test(note);


export const createNoteValue = (note: string): NoteValueType => {

    if (!isValid(note)) return null;

    const { relative, type, dots } = tokenize(note);
    const value = note;
    const duration = geometricSum(1.0 / relative, 1 + dots);

    return {
        value,
        relative,
        type,
        dots,
        duration
    };
}

export const splitNoteValue = (note: string | NoteValueType): NoteValueType => {
    const props = (typeof note === 'string') ? createNoteValue(note) : note;
    if (!props) return null;

    const { relative, type, dots } = props;
    const splitValue = `${relative * 2.0}${type}${'.'.repeat(dots)}`;

    return createNoteValue(splitValue);
}


export const doubleNoteValue = (note: string | NoteValueType): NoteValueType => {
    const props = (typeof note === 'string') ? createNoteValue(note) : note;
    if (!props) return null;

    const { relative, type, dots } = props;
    const splitValue = `${relative / 2.0}${type}${'.'.repeat(dots)}`;

    return createNoteValue(splitValue);
}


export const noteValueRelativeTo = (noteA: string | NoteValueType, noteB: string | NoteValueType) => {
    const first = (typeof noteA === 'string') ? createNoteValue(noteA) : noteA;
    const second = (typeof noteB === 'string') ? createNoteValue(noteB) : noteB;

    return first.duration / second.duration;
}

export const NoteValue = {
    isValid,
    create: createNoteValue,
    split: splitNoteValue,
    double: doubleNoteValue,
    relativeTo: noteValueRelativeTo
}
