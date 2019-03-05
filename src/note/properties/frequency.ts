
class Frequency {
    value: number;

    static isValid = (freq: number): boolean => {
        return typeof freq === 'number' && freq > 0;
    }

    static fromMidi = (midi: number, tuning = 440): Frequency => {
        if (midi < 0) return null;
        const freq = 2 ** ((midi - 69) / 12) * tuning;
        return new Frequency(freq);
    }

    static fromName = (name: string): Frequency => {
        return new Frequency(440.0);
    }

    static fromFrequency = (freq: number): Frequency => {
        return new Frequency(freq);
    }

    static create = (property: number | string): Frequency => {
        if (!['number', 'string'].includes(typeof property)) return null;
        return typeof property === 'string'
            ? Frequency.fromName(property)
            : Frequency.fromFrequency(property);
    }

    private constructor(freq: number) {
        if (!Frequency.isValid(freq)) return null;
        this.value = freq;
    }
}

