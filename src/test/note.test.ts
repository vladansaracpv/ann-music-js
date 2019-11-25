import { Note } from 'ann-music-note';
import { expect } from 'chai';
import 'mocha';

describe('\nNote Factories', () => {
  describe('\n- createNoteWithName(name:NoteName):\n', () => {
    it(`should return valid NoteProps object for NoteName:C4`, () => {
      const result = {
        accidental: '',
        alteration: 0,
        chroma: 0,
        color: 'white',
        frequency: 261.6255653005986,
        letter: 'C',
        midi: 60,
        name: 'C4',
        octave: 4,
        pc: 'C',
        step: 0,
      };
      const test = Note({ name: 'C4' });
      expect(test).to.equal(result);
    });

    // it(`should return FALSE for key not in Theory.KEYS[]: (key = 'chromas')`, () => {
    //   const result = Validator.isKey('chromas');
    //   expect(result).to.equal(false);
    // });
  });
});
