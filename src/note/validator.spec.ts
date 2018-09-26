import { Validator } from './validator';
import { expect } from 'chai';
import 'mocha';

describe('\nVALIDATIONS', () => {
  describe('\n- isKey(key):\n', () => {

    it(`should return TRUE for key inside Theory.KEYS[]: (key = 'chroma')`, () => {
      const result = Validator.isKey('chroma');
      expect(result).to.equal(true);
    });

    it(`should return FALSE for key not in Theory.KEYS[]: (key = 'chromas')`, () => {
      const result = Validator.isKey('chromas');
      expect(result).to.equal(false);
    });

  });

  describe('\n- isName(name):\n', () => {

    it(`should return TRUE if name is made from valid [letter, accidental, octave] (name = 'C#4')`, () => {
      const result = Validator.isName('C#4');
      expect(result).to.equal(true);
    });

    it(`should return FALSE otherwise: (name = 'Vb' | name = 'C#3.2' | name = 'C#b4')`, () => {
      const result = Validator.isName('C#');
      expect(result).to.equal(false);
    });

  });

  describe('\n- isLetter(letter):\n', () => {

    it(`should return TRUE for letter inside Theory.LETTERS: (letter = 'C')`, () => {
      const result = Validator.isLetter('C');
      expect(result).to.equal(true);
    });

    it(`should return FALSE for letter not in Theory.LETTERS: (letter = 'V')`, () => {
      const result = Validator.isLetter('V');
      expect(result).to.equal(false);
    });

  });

  describe('\n- isAccidental(acc):\n', () => {

    it(`should return TRUE for empty acc: (acc = '')`, () => {
      const result = Validator.isAccidental('');
      expect(result).to.equal(true);
    });

    it(`should return TRUE for acc made only of '#': (acc = '###')`, () => {
      const result = Validator.isAccidental('###');
      expect(result).to.equal(true);
    });

    it(`should return TRUE for acc made only of 'b': (acc = 'bb')`, () => {
      const result = Validator.isAccidental('bb');
      expect(result).to.equal(true);
    });

    it(`should return FALSE for acc made of different chars: (acc = '#b')`, () => {
      const result = Validator.isKey('#b');
      expect(result).to.equal(false);
    });

  });

  describe('\n- isOctave(oct):\n', () => {

    it(`should return TRUE for integer oct: (oct = 4)`, () => {
      const result = Validator.isOctave(4);
      expect(result).to.equal(true);
    });

    it(`should return FALSE for not-int oct: (oct = 'sr' | oct = 2.3 | oct = null)`, () => {
      const result = Validator.isOctave('str');
      expect(result).to.equal(false);
    });

  });

});
