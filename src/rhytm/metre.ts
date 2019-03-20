import { NoteValueType, NoteValue } from "./duration";

const Division = {
    'simple': [2, 3, 4],
    'compound': [6, 9, 12],
    'odd': [5, 7, 8, 10, 11, 13, 14, 15, 16]
}

export interface MetreType {
    count: number;
    unit: NoteValueType;
    duration: number;
    beat: {
        count: number,
        unit: NoteValueType
    };
}

export const isSimple = (beats: number) => Division.simple.includes(beats);
export const isCompound = (beats: number) => Division.compound.includes(beats);
export const isOdd = (beats: number) => Division.odd.includes(beats);

export const createMetre = (count: number, value: string | NoteValueType): MetreType => {

    const unit = (typeof value === 'string')
        ? NoteValue.create(value)
        : value;

    const beat = isCompound(count)
        ? { count: count / 3, unit: NoteValue.double(`${unit.relative}${unit.type}.`) }
        : { count, unit };

    const duration = count * unit.duration;

    return { count, unit, duration, beat }
}

export const Metre = {

    simple: isSimple,
    compound: isCompound,
    odd: isOdd,
    create: createMetre
}
