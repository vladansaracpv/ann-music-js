
class Chroma {
    value: number;

    static isValid(chroma: number) {
        return Number.isInteger(chroma) && (chroma >= 0 && chroma < 12);
    }

    static fromStringValue = (str: string): Chroma => {
        const oct = str[str.length - 1];
        if (Number.isNaN(Number.parseInt(oct))) return Chroma.fromPc(str);
        return Chroma.fromName(str);
    }

    static fromName = (name: string): Chroma => {
        return new Chroma(0);
    }

    static fromPc = (pc: string): Chroma => {
        return new Chroma(0);
    }

    static fromNumericValue = (num: number): Chroma => {
        return num > 11
            ? Chroma.fromMidi(num)
            : Chroma.fromChroma(num);
    }

    static fromChroma = (chroma: number): Chroma => {
        return new Chroma(chroma);
    }

    static fromMidi = (midi: number): Chroma => {
        const chroma = midi % 12;
        return new Chroma(chroma);
    }

    static create = (property: number | string): Chroma => {
        if (!['number', 'string'].includes(typeof property)) return null;
        return typeof property === 'string'
            ? Chroma.fromStringValue(property)
            : Chroma.fromNumericValue(property);
    }

    private constructor(chroma: number) {
        if (!Chroma.isValid(chroma)) return null;
        this.value = chroma;
    }
}
