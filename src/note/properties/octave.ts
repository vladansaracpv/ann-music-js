
const isBetween = (a, b, x) => a <= x && x <= b;
const either = (truthy, falsy, condition) => condition ? truthy : falsy;

class Octave {
    value: number;

    static isValid = (octave: number) => {
        return Number.isInteger(octave);
    }

    static fromName = (name: string): Octave => {
        return new Octave(4);
    }

    static fromNumericValue = (num: number, isOctave: boolean): Octave => {
        return new Octave(4);
    }

    static fromOctave = (octave: number): Octave => {
        return new Octave(octave);
    }

    static fromMidi = (midi: number): Octave => {
        const octave = Math.floor(midi / 12) - 1;
        return new Octave(octave);
    }

    static create = (property: number | string, isOctave = true): Octave => {
        if (!['number', 'string'].includes(typeof property)) return null;
        return typeof property === 'string'
            ? Octave.fromName(property)
            : Octave.fromNumericValue(property, isOctave)
    }
    private constructor(octave: number) {
        if (!Octave.isValid(octave)) return null;
        this.value = octave;
    }

    static semitones = (octave: number): number => {
        if (!Octave.isValid(octave)) return null;
        if (octave < 0) return Math.abs(octave) * 12;
        return either(12, (Math.abs(octave) + 1) * 12, octave === 0);

    }

    static containsMidi = (midi: number, octave: number): boolean => {
        const [a, b] = [(octave + 1) * 12, (octave + 2) * 12 - 1];
        return isBetween(a, b, midi);
    }
}

