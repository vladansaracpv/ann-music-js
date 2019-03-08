
class AccidentalTheory {
    /**
     *  Check if given accidental type is valid
     *  @param {string} - Accidental type
     *  @return {boolean} - Accidental type validity
     */
    static isValid = (accident: string): boolean => {
        // '' is valid accident value
        if (accident.length === 0) { return true; }

        // '#' or 'bbb' are valid, but '#b' is not
        if (Array(Math.abs(accident.length) + 1).join(accident[0]) !== accident) return false;

        return '#b'.indexOf(accident[0]) > -1;
    };
}

export class Accidental extends AccidentalTheory {
    type: string;
    value: number;

    static types: string[] = ['b', '', '#'];

    static values = {
        'b': -1,
        '#': 1,
        '': 0
    };

    /**
     *  Get numeric value for given type
     *  @param {string} type - Accidental type: 'b' | '' | '#'
     *  @return {number} numberic value of accidental type: -1 | 0 | 1 
     */
    static typeValue = (type: string): number => {
        return Accidental.types.includes(type)
            ? Accidental.values[type]
            : undefined
    }

    /**
     *  Get string type for given alteration
     *  @param {number} value - Accidental numerical value
     *  @return {string} Accidental type
     */
    static valueType = (value: number): string => {
        if (value === 0) return '';
        return value < 0
            ? 'b'
            : '#';
    }

    /**
     *  Get alteration value from given type
     *  @param {string} type - Accidental string value
     *  @return {number} - Alteration value
     */
    static valueFromType = (type: string): number => {
        if (type === '') return 0;
        return Accidental.isValid(type)
            ? Accidental.typeValue(type[0]) * type.length
            : undefined;
    }

    /**
     *  Get type value from given alteration
     *  @param {number} value - Alteration value
     *  @return {string} - Accidental type
     */
    static typeFromValue = (value: number): string => {
        if (value == 0) return '';
        return value < 0
            ? Accidental.valueType(value).repeat(-value)
            : Accidental.valueType(value).repeat(value);
    }

    /**
     *  Create Accidental object from {string} type
     *  @param {string} - Accidental type
     */
    static fromType = (type: string): Accidental => {
        if (!Accidental.isValid(type)) return null;
        return new Accidental(type);
    };

    /**
     *  Create Accidental object from {number} alteration
     *  @param {number} - Alteration
     * 
     */
    static fromValue = (alteration: number): Accidental => {
        const type = Accidental.typeFromValue(alteration);
        if (!Accidental.isValid(type)) return null;
        return new Accidental(type);
    }

    /**
     * Create Accidental object from {string} type | {number} value
     */
    static create(property: string | number): Accidental {
        if (!['number', 'string'].includes(typeof property)) return null;

        return typeof property === 'string'
            ? Accidental.fromType(property)
            : Accidental.fromValue(property);
    }

    private constructor(type: string) {
        super();
        this.type = type;
        this.value = Accidental.valueFromType(type);
    }

    toType = (): string => this.type;
    toValue = (): number => this.value;
    isSharp = (): boolean => this.type[0] === '#'
    isFlat = (): boolean => this.type[0] === 'b';
    isNatural = (): boolean => this.type.length === 0;
}

// const acc = Accidental.create('#');
// console.log(acc);
// console.log(Accidental);

