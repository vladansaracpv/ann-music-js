import Nexus from 'nexusui';
import Tone from 'tone';

export interface Header {
  PPQ: number;
  bpm: number;
  timeSignature: number[];
  name: string;
}

export interface Tempo {
  absoluteTime: number;
  seconds: number;
  bpm: number;
}

export interface TimeSignature {
  absoluteTime: number;
  seconds: number;
  numerator: number;
  denominator: number;
  click: number;
  notesQ: number;
}

export interface MidiNote {
  name: string;
  midi: number;
  time: number;
  velocity: number;
  duration: number;
}

export interface Track {
  startTime: number;
  duration: number;
  length: number;
  notes: MidiNote[];
  controlChanges: any;
  id: number;
  name?: string;
  instrumentNumber?: number;
  instrument?: string;
  instrumentFamily?: string;
  channelNumber?: number;
  isPercussion?: boolean;
}

export interface Midi {
  header: Header;
  tempo: Tempo[];
  timeSignature: TimeSignature[];
  startTime: number;
  duration: number;
  tracks: Track[];
}

const SHEET_URL = '../src/assets/';

export const loadJSON = (fileURL: string, callback) => {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType('application/json');
  xobj.open('GET', SHEET_URL + fileURL, true);
  xobj.onreadystatechange = function() {
    if (xobj.readyState == 4 && xobj.status == 200) {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
};

let piano;
window.onload = event => {
  piano = new Nexus.Piano('#instrument', {
    size: [1000, 150],
    mode: 'button', // 'button', 'toggle', or 'impulse'
    lowNote: 24,
    highNote: 96,
  });

  // piano.on('change', function(v) {
  //   console.log(v);
  // });
};

function playSheet(sheet: Midi) {
  let i = 220;
  const { tracks } = sheet;
  const { notes, length } = tracks[1];
  const synth = new Tone.Synth().toMaster();

  const playNote = (note: MidiNote) => {
    synth.triggerAttackRelease(note.name, note.duration * 1000);
    document.getElementById('center').innerText = `${i} - ${note.name} - ${note.midi}`;
    if (i > 0) {
      piano.toggleKey(notes[i - 1].midi, false);
      piano.toggleKey(notes[i].midi, true);
    } else {
      piano.toggleKey(notes[i].midi, true);
    }
  };

  let timerId;
  timerId = setTimeout(function tick() {
    if (i === length - 1) {
      clearTimeout(timerId);
      synth.disconnect();
      return;
    } else {
      playNote(notes[i]);
      timerId = setTimeout(tick, notes[i].duration * 1000);
      i++;
    }
  });
}

// loadJSON('furElise.json', response => {
//   const sheet: Midi = JSON.parse(response);
//   playSheet(sheet);
// });
