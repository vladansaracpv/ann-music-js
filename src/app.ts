import { Metre } from './rhytm/metre';
import { Measure } from './rhytm/measure';
import { Tempo } from './rhytm/tempo';
import { Beat } from './rhytm/beat';
import { NoteValue, NoteValueType } from './rhytm/duration';



const concat = <T>(a: T[], b: T[]): T[] => { return [...a, ...b] };

interface Operators<T> {
    add: (a: T[], b: T[]) => T[];
}

let NoteOperators: Operators<number>;

NoteOperators = {
    add: concat
};


interface Add {
    'numbers': (a: number, b: number) => number;
    'strings': (a: string, b: string) => string;
    'notes': (a: NoteValueType, b: NoteValueType) => number;
}

interface Duration {
    duration: number;
}

const add = (a: number, b: number): number => a + b;
const addS = (a: string, b: string): string => a + b;
const addN = (a: NoteValueType, b: NoteValueType): number => a.duration + b.duration;

let Addition: Add;

Addition = {
    numbers: add,
    strings: addS,
    notes: addN
};

console.log(Addition.numbers(2, 3));
console.log(Addition.strings('asd', 'fs'));
console.log(Addition.notes(NoteValue.create('2n'), NoteValue.create('4n')));
