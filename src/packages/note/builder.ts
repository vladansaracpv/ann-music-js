import { chord } from '@packages/chord';
import { scale } from '@packages/scale';
import { createNote } from './factories';

interface Builder {
  // createProperties(): void;
  // createCompareMethods(): void;
  createTransposeMethods();
  createDistanceMethods();
  createExtensionMethods();
  // createStaticMethods(): void;
}

export const NoteMethodsBuilder = (): Builder => {
  const createDistanceMethods = function() {
    function distanceTo(a: NoteProps, b?: NoteProps) {
      return b ? b.midi - a.midi : a.midi - this.midi;
    }

    return { distanceTo };
  };

  const createTransposeMethods = function() {
    function transposeBy(n: number, b?: NoteProps) {
      return b ? createNote({ midi: b.midi + n }) : createNote({ midi: this.midi + n });
    }

    return { transposeBy };
  };

  const createExtensionMethods = function() {
    function toChord(type: string, tonic?: NoteName) {
      const name = this.name ? this.name : '';
      return tonic ? chord([tonic, type]) : chord([name, type]);
    }

    function toScale(type: string, tonic?: NoteName) {
      const name = this.name ? this.name : '';
      return tonic ? scale([tonic, type]) : scale([name, type]);
    }

    return { toChord, toScale };
  };

  return { createDistanceMethods, createExtensionMethods, createTransposeMethods };
};
