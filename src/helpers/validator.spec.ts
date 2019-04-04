import * as Validator from './validator';
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
      const result = Validator.isName('C#3.2');
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

  describe('\n- isPc(pc):\n', () => {

    it(`should return TRUE if pc is made from valid [letter, accidental] (pc = 'C#')`, () => {
      const result = Validator.isPc('C#');
      expect(result).to.equal(true);
    });

    it(`should return FALSE otherwise: (pc = 'C!' | pc = 'V3.2' | pc = 'C#b')`, () => {
      const result = Validator.isPc('C!');
      expect(result).to.equal(false);
    });

  });

  describe('\n- isStep(step):\n', () => {

    it(`should return TRUE for step in [0, 6]: (step = 3)`, () => {
      const result = Validator.isStep(3);
      expect(result).to.equal(true);
    });

    it(`should return FALSE for step not in [0, 6]: (step = 8)`, () => {
      const result = Validator.isStep(8);
      expect(result).to.equal(false);
    });

  });

  describe('\n- isAlteration(alt):\n', () => {

    it(`should return TRUE for integer alt: (alt = 4)`, () => {
      const result = Validator.isAlteration(2);
      expect(result).to.equal(true);
    });

    it(`should return FALSE for not-int alt: (alt = 2.3)`, () => {
      const result = Validator.isAlteration(2.3);
      expect(result).to.equal(false);
    });

  });

  describe('\n- isChroma(chroma):\n', () => {

    it(`should return TRUE for integer chroma in [0,11]: (chroma = 4)`, () => {
      const result = Validator.isChroma(2);
      expect(result).to.equal(true);
    });

    it(`should return FALSE for not-int chroma or not in [0, 11]: (chroma = 2.3)`, () => {
      const result = Validator.isChroma(2.3);
      expect(result).to.equal(false);
    });

  });

  describe('\n- isMidi(midi):\n', () => {

    it(`should return TRUE for integer midi: (midi = 4)`, () => {
      const result = Validator.isMidi(4);
      expect(result).to.equal(true);
    });

    it(`should return FALSE for not-int midi: (midi = 'sr' | midi = 2.3 | midi = null)`, () => {
      const result = Validator.isMidi('str');
      expect(result).to.equal(false);
    });

  });

  describe('\n- isFrequency(freq):\n', () => {

    it(`should return TRUE for integer freq: (freq = 4)`, () => {
      const result = Validator.isFrequency(4);
      expect(result).to.equal(true);
    });

    it(`should return FALSE for not-int freq: (freq = 'sr' | freq = null)`, () => {
      const result = Validator.isFrequency('str');
      expect(result).to.equal(false);
    });

  });

});
