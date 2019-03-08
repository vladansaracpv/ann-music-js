import { Accidental } from './accidental';
import { expect } from 'chai';
import 'mocha';

describe('\Accidental Theory', () => {

    describe('\n- isValid(accidental):\n', () => {

        it(`should return TRUE for types in ['#', 'b', '']`, () => {
            const result = Accidental.isValid('#');
            expect(result).to.equal(true);
        });

        it(`should return FALSE otherwise`, () => {
            const result = Accidental.isValid('#b');
            expect(result).to.equal(false);
        });

    });

});
