
class ChromaTheory {
    static WHITE_KEYS = [0, 2, 4, 5, 7, 9, 11];

    static isValid(chroma: number): boolean {
        return Number.isInteger(chroma) && (chroma >= 0 && chroma < 12);
    }

    static isWhite = (chroma: number): boolean => {
        if (!ChromaTheory.isValid(chroma)) return null;
        return ChromaTheory.WHITE_KEYS.includes(chroma);
    }

    static isBlack = (chroma: number): boolean => {
        return !ChromaTheory.isWhite(chroma);
    }
}

class Chroma extends ChromaTheory {
    value: number;

    /**
     * Create Chroma object from {string} value: pc|name
     */
    static fromStringValue = (str: string): Chroma => {
        const oct = str[str.length - 1];
        if (Number.isNaN(Number.parseInt(oct))) return Chroma.fromPc(str);
        return Chroma.fromName(str);
    }

    /**
     * Create Chroma object from {string} name value
     * 
     * @param {string} name
     * 
     */
    static fromName = (name: string): Chroma => {
        return new Chroma(0);
    }

    /**
     * Create Chroma object from {string} pc value
     * 
     * @param {string} pc
     * 
     */
    static fromPc = (pc: string): Chroma => {
        return new Chroma(0);
    }

    /**
     * Create Chroma object from {number} value: chroma|midi
     * 
     * @param {number} num
     * 
     */
    static fromNumericValue = (num: number): Chroma => {
        return num > 11
            ? Chroma.fromMidi(num)
            : Chroma.fromChroma(num);
    }

    /**
     * Create Chroma object from {number} chroma value
     * 
     * @param {number} chroma
     * 
     */
    static fromChroma = (chroma: number): Chroma => {
        if (!Chroma.isValid(chroma)) return null;
        return new Chroma(chroma);
    }

    /**
     * Create Chroma object from {number} midi value
     * 
     * @param {number} midi
     * 
     */
    static fromMidi = (midi: number): Chroma => {
        const chroma = midi % 12;
        if (!Chroma.isValid(chroma)) return null;
        return new Chroma(chroma);
    }

    /**
     * Create Chroma object from {string} or {number} value
     */
    static create = (property: number | string): Chroma => {
        if (!['number', 'string'].includes(typeof property)) return null;
        return typeof property === 'string'
            ? Chroma.fromStringValue(property)
            : Chroma.fromNumericValue(property);
    }

    private constructor(chroma: number) {
        super();
        this.value = chroma;
    }

    toValue = (): number => this.value;
    isWhite = (): boolean => Chroma.isWhite(this.value);
    isBlack = (): boolean => Chroma.isBlack(this.value);
}
