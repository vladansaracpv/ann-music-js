import { Validator } from './validator';
import { expect } from 'chai';
import 'mocha';

describe('\nVALIDATIONS', () => {
  describe('\n- isKey(key):\n', () => {

    it('should return TRUE if key is member of KEYS[]', () => {
      const result = Validator.isKey('chroma');
      expect(result).to.equal(true);
    });

    it('should return FALSE if key is not member of KEYS[]', () => {
      const result = Validator.isKey('chromas');
      expect(result).to.equal(false);
    });

  });

  describe('\n- isAccidental(acc):\n', () => {

    it(`should return TRUE if acc is ''`, () => {
      const result = Validator.isAccidental('');
      expect(result).to.equal(true);
    });

    it(`should return TRUE if acc is made only of #`, () => {
      const result = Validator.isAccidental('###');
      expect(result).to.equal(true);
    });

    it(`should return TRUE if acc is made only of b`, () => {
      const result = Validator.isAccidental('bb');
      expect(result).to.equal(true);
    });

    it('should return FALSE if acc is made from different chars', () => {
      const result = Validator.isKey('#b');
      expect(result).to.equal(false);
    });

  });
});
