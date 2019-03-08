
class FrequencyTheory {
    static isValid = (freq: number): boolean => {
        return typeof freq === 'number' && freq > 0;
    }
}

class Frequency extends FrequencyTheory {
    value: number;

    /**
     * Create Frequency object from {number} midi 
     * 
     * @param {number} midi
     * 
     */
    static fromMidi = (midi: number, tuning = 440): Frequency => {
        if (midi < 0) return null;
        const freq = 2 ** ((midi - 69) / 12) * tuning;
        if (!Frequency.isValid(freq)) return null;
        return new Frequency(freq);
    }

    /**
     * Create Frequency object from {string} name
     * 
     * @param {string} name
     * 
     */
    static fromName = (name: string): Frequency => {
        return new Frequency(440.0);
    }

    /**
     * Create Frequency object from {number} freq
     * 
     * @param {number} freq
     * 
     */
    static fromFrequency = (freq: number): Frequency => {
        if (!Frequency.isValid(freq)) return null;
        return new Frequency(freq);
    }

    /**
     * Create Frequency object from {string} or {number} value
     */
    static create = (property: number | string): Frequency => {
        if (!['number', 'string'].includes(typeof property)) return null;
        return typeof property === 'string'
            ? Frequency.fromName(property)
            : Frequency.fromFrequency(property);
    }

    private constructor(freq: number) {
        super();
        this.value = freq;
    }
}

