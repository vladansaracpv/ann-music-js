import Tone from 'tone';

function makeSynth() {
  let envelope = {
    attack: 0.1,
    release: 4,
    releaseCurve: 'linear',
  };
  let filterEnvelope = {
    baseFrequency: 200,
    octaves: 2,
    attack: 0,
    decay: 0,
    release: 1000,
  };

  return new Tone.DuoSynth({
    harmonicity: 1,
    voice0: {
      oscillator: { type: 'sawtooth' },
      envelope,
      filterEnvelope,
    },
    voice1: {
      oscillator: { type: 'sine' },
      envelope,
      filterEnvelope,
    },
    vibratoRate: 0.5,
    vibratoAmount: 0.1,
  });
}

export class SimplePlayer {
  private synth;

  constructor() {
    this.synth = makeSynth().toMaster();
  }

  /**
   * If the given event has new tempo and/or time signatures, apply them to the Transport immediately.
   * @param {Sequence} event
   * @param {boolean} ramp If true, tempo will ramp up/down to the given value over 1 second,
   *     otherwise it will change instantly.
   */
  applyEventUpdates(event: Sequence, ramp) {
    if (event.newTempo && event.newTempo.unit === 'bpm') {
      if (ramp) {
        Tone.Transport.bpm.rampTo(event.newTempo.value, 1);
      } else {
        Tone.Transport.bpm.value = event.newTempo.value;
      }
    }

    if (event.newTimeSignature) {
      Tone.Transport.timeSignature = [event.newTimeSignature.numerator, event.newTimeSignature.denominator];
    }
  }

  /**
   * Use Tone.js Transport to play a series of notes encoded by the event list passed in input,
   * using the default ugly synthetic membrane sound.
   * @param {Sequence[]} track
   */
  play(track: Sequence[]) {
    const synth = this.synth;

    // We will use the Transport to schedule each measure independently. Given that we
    // inform Tone.js of the current tempo and time signature, the Transport will be
    // able to automatically interpret all measures and note durations as absolute
    // time events in seconds without us actually bothering
    let measureCounter = 0;
    let firstEvent = true;

    // Stop, rewind and clear all events from the transport (from previous plays)
    Tone.Transport.stop();
    Tone.Transport.position = 0;
    Tone.Transport.cancel();

    for (const event of track) {
      // The first event is always supposed to have new tempo and time signature info
      // so we should update the Transport appropriately
      if (firstEvent) {
        this.applyEventUpdates(event, false);
        firstEvent = false;
      }

      // In the following callback, "time" represents the absolute time in seconds
      // that the measure we are scheduling is expected to begin at, given the current
      // tempo and time signature assigned to the Transport
      Tone.Transport.schedule(time => {
        // Change the tempo if this event has a new tempo. Also do the same if a new time signatue is issued
        this.applyEventUpdates(event, true);

        // This contains the relative time of notes with respect to the
        // start of the current measure, in seconds
        let relativeTime = 0;

        for (const note of event.measure.notes) {
          const duration = note.duration;

          // If this is an actual note (as opposed to a rest), schedule the
          // corresponding sound to be played along the Transport timeline
          // after the previous notes in the measure have been played (hence the relativeTime)
          if (note.type === 'n') {
            synth.triggerAttackRelease(note.name, duration, time + relativeTime);
          }

          // This is used to delay notes that come next by the correct amount
          relativeTime += Tone.Time(duration).toSeconds();
        }
      }, `${measureCounter}m`);

      measureCounter++;
    }

    Tone.Transport.start();
  }
}

export class SequenceParser {
  initialTempo: Tempo;
  initialTimeSignature: TimeSignature;

  constructor(tempoBpm: number, ts: number[]) {
    this.initialTempo = { value: tempoBpm, unit: 'bpm' };
    this.initialTimeSignature = { numerator: ts[0], denominator: ts[1] };
  }

  parse(textMeasures: string[]): Sequence[] {
    const result = [];
    let firstEvent = true;

    for (const textMeasure of textMeasures) {
      var event: Sequence = { newTempo: undefined, measure: undefined, newTimeSignature: undefined };

      if (firstEvent) {
        event.newTempo = this.initialTempo;
        event.newTimeSignature = this.initialTimeSignature;
        firstEvent = false;
      }

      event.measure = this.parseTextMeasure(textMeasure);
      result.push(event);
    }

    return result;
  }

  parseTextMeasure(textMeasure: string): Measure {
    const notes = textMeasure
      .split(' ')
      .filter(textNote => !!textNote)
      .map(this.parseTextNote);

    return { notes };
  }

  parseTextNote(textNote: string): PlayerNote {
    const chunks = textNote.split('/');
    const isNote = chunks[0] !== 'r';
    return {
      type: isNote ? 'n' : 'r',
      name: isNote ? chunks[0] : null,
      duration: chunks[1] + 'n',
    };
  }
}

export const test = () => {
  const player = new SimplePlayer();
  const sequenceParser = new SequenceParser(128, [2, 4]);
  player.play(
    sequenceParser.parse([
      'r/4 B4/16 A4/16 G#4/16 A4/16',
      'C5/8 r/8 D5/16 C5/16 B4/16 C5/16',
      'E5/8 r/8 F5/16 E5/16 D#5/16 E5/16',
      'B5/16 A5/16 G#5/16 A5/16 B5/16 A5/16 G#5/16 A5/16',
      'C6/4 A5/8 C6/8',
      'B5/8 A5/8 G5/8 A5/8',
      'B5/8 A5/8 G5/8 A5/8',
      'B5/8 A5/8 G5/8 F#5/8',
      'E5/4',
    ]),
  );
};
