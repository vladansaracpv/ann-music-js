import { BaseBoolean, BaseErrors, BaseFunctional, BaseMaths, BaseStrings, BaseTypings } from 'ann-music-base';

import { NOTE, NoteName } from 'ann-music-note';

import { Num, Quality, Step, Validators } from './methods';

import { CLASSES, EmptyInterval, INTERVAL_REGEX, NAMES, NAMES_ALTERNATE } from './theory';

import {
  IntervalAlteration,
  IntervalClass,
  IntervalName,
  IntervalNumber,
  IntervalOctave,
  IntervalProps,
  IntervalQuality,
  IntervalSemitones,
  IntervalStep,
  IntervalInit,
} from './types';

const { either } = BaseBoolean;
const { CustomError } = BaseErrors;
const { compose } = BaseFunctional;
const { dec, divC, inc } = BaseMaths;
const { tokenize } = BaseStrings;
const { isInteger } = BaseTypings;

const IntervalError = CustomError('Interval');

/**
 * Interval factory function
 * @param {IntervalInitProps} props
 * @return {IntervalProps}
 */
export function Interval({ name, width, notes, alternate = false }: IntervalInit = {}): IntervalProps {
  const { isIntervalName, isNoteArray } = Validators;
  const { toAlteration, fromQualityTokens } = Quality;
  const { toStep, toOctave, toDirection, toSimpleNum, fromTokens } = Num;
  const { toType, toSemitones, toChroma } = Step;

  function fromName(src: IntervalName): IntervalProps {
    const tokens = tokenize(src, INTERVAL_REGEX);

    if (!tokens) {
      return IntervalError('InvalidIvlConstructor', src, EmptyInterval) as IntervalProps;
    }

    const { tn: tshapeNum, qn: qshapeNum, tq: tshapeQuality, qq: qshapeQuality } = tokens;

    const inumber = fromTokens(tshapeNum, qshapeNum) as IntervalNumber;

    const quality = fromQualityTokens(tshapeQuality, qshapeQuality) as IntervalQuality;

    if (!inumber || quality.length > 2) {
      return IntervalError('InvalidIvlConstructor', src, EmptyInterval) as IntervalProps;
    }

    const step = toStep(inumber) as IntervalStep;

    const itype = toType(step);

    const direction = toDirection(inumber);

    const simple = toSimpleNum(inumber, step, direction);

    const octave = toOctave(inumber) as IntervalOctave;

    const alteration = toAlteration(itype, quality) as IntervalAlteration;

    const semitones = toSemitones(step, alteration, octave);

    const width = (direction * semitones) as IntervalSemitones;

    const chroma = toChroma(step, alteration, direction);

    const iclass = CLASSES[chroma] as IntervalClass;

    const name = `${inumber}${quality}` as IntervalName;

    const valid = true;

    return {
      name,
      inumber,
      quality,
      alteration,
      step,
      itype,
      simple,
      width,
      direction,
      octave,
      chroma,
      iclass,
      valid,
    };
  }

  function fromDistance(distance: IntervalSemitones, alternate = false): IntervalProps {
    if (!isInteger(distance)) {
      return IntervalError('InvalidIvlConstructor', distance, EmptyInterval) as IntervalProps;
    }

    const direction = toDirection(distance);
    const width = Math.abs(distance);
    const harmonic = width % 12;
    const octave = compose(
      inc,
      Math.floor,
      divC(12),
    )(width);

    const names = either(NAMES_ALTERNATE, NAMES, alternate);
    const tokens = tokenize(names[harmonic], INTERVAL_REGEX);

    if (!tokens) {
      return IntervalError('InvalidIvlConstructor', distance, EmptyInterval) as IntervalProps;
    }

    const { tn, qn, tq, qq } = tokens;

    const quality = fromQualityTokens(tq, qq);
    const inumber = fromTokens(tn, qn) + dec(octave) * 7;
    const name = `${direction * inumber}${quality}`;

    return fromName(name);
  }

  function fromNotes(notes: NoteName[], alternate = false): IntervalProps {
    const [firstNote, secondNote] = notes;
    const midi = NOTE.property('midi');

    const distance = midi({ name: secondNote }) - midi({ name: firstNote });

    return fromDistance(distance, alternate);
  }

  if (isIntervalName(name)) return fromName(name);

  if (isInteger(width)) return fromDistance(width, alternate);

  if (isNoteArray(notes)) return fromNotes(notes, alternate);

  return IntervalError('InvalidIvlConstructor', { name, width, notes }, EmptyInterval) as IntervalProps;
}
