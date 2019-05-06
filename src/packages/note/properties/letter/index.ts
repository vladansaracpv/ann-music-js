
class LetterTheory {
    static LETTERS = 'CDEFGAB';

    static isValid = (letter: string): boolean => LetterTheory.LETTERS.indexOf(letter) > -1;

}

class Letter extends LetterTheory {
    letter: string;

    /**
     * Create Letter object from {string} value
     * 
     * @param {string} property
     * 
     */
    static fromString = (property: string): Letter => {
        if (!Letter.isValid(property)) return null;
        return new Letter(property);
    }

    /**
     * Create Letter object from {number} value
     * 
     * @param {number} property - letter index
     */
    static fromNumber = (property: number): Letter => {
        const letter = Letter.LETTERS[property];
        if (!Letter.isValid(letter)) return null;
        return new Letter(letter);
    }

    /**
     * Create Letter object from {string} letter or its {number} index
     */
    static create = (property: string | number): Letter => {
        if (!['number', 'string'].includes(typeof property)) return null;
        return typeof property === 'string'
            ? Letter.fromString(property)
            : Letter.fromNumber(property);

    }
    private constructor(letter: string) {
        super();
        this.letter = letter;
    }

    toValue = (): string => this.letter;
}
