import { SimplePlayer, SequenceParser } from './packages/player';
import { Parser } from './packages/parser/parser';

const samplesURL = '../src/assets/Samples/Grand Piano/';

let audioContext = new AudioContext();

/** START: It's gonna rain */
const url = '../src/assets/itsgonnarain.mp3';

function startLoopItsGonnaRain(audioBuffer, pan = 0, rate = 1) {
  let sourceNode = audioContext.createBufferSource();
  let pannerNode = audioContext.createStereoPanner();

  sourceNode.buffer = audioBuffer;
  sourceNode.loop = true;
  sourceNode.loopStart = 2.98;
  sourceNode.loopEnd = 3.8;
  sourceNode.playbackRate.value = rate;
  pannerNode.pan.value = pan;

  sourceNode.connect(pannerNode);
  pannerNode.connect(audioContext.destination);

  sourceNode.start(0, 2.98);
}

const fetchSampleItsGonnaRain = () => {
  fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      startLoopItsGonnaRain(audioBuffer, -1);
      startLoopItsGonnaRain(audioBuffer, 1, 1.002);
    })
    .catch(e => console.error(e));
};
/** END: It's gonna rain */

/** START: Music for Airports */
const SAMPLE_LIBRARY = {
  'Grand Piano': [
    { note: 'A', octave: 4, file: samplesURL + 'piano-f-a4.wav' },
    { note: 'A', octave: 5, file: samplesURL + 'piano-f-a5.wav' },
    { note: 'A', octave: 6, file: samplesURL + 'piano-f-a6.wav' },
    { note: 'C', octave: 4, file: samplesURL + 'piano-f-c4.wav' },
    { note: 'C', octave: 5, file: samplesURL + 'piano-f-c5.wav' },
    { note: 'C', octave: 6, file: samplesURL + 'piano-f-c6.wav' },
    { note: 'D#', octave: 4, file: samplesURL + 'piano-f-d#4.wav' },
    { note: 'D#', octave: 5, file: samplesURL + 'piano-f-d#5.wav' },
    { note: 'D#', octave: 6, file: samplesURL + 'piano-f-d#6.wav' },
    { note: 'F#', octave: 4, file: samplesURL + 'piano-f-f#4.wav' },
    { note: 'F#', octave: 5, file: samplesURL + 'piano-f-f#5.wav' },
    { note: 'F#', octave: 6, file: samplesURL + 'piano-f-f#6.wav' },
  ],
};

function flatToSharp(note) {
  switch (note) {
    case 'Bb':
      return 'A#';
    case 'Db':
      return 'C#';
    case 'Eb':
      return 'D#';
    case 'Gb':
      return 'F#';
    case 'Ab':
      return 'G#';
    default:
      return note;
  }
}

const OCTAVE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function noteValue(note, octave) {
  return octave * 12 + OCTAVE.indexOf(note);
}

function getNoteDistance(note1, octave1, note2, octave2) {
  return noteValue(note1, octave1) - noteValue(note2, octave2);
}

function getNearestSample(sampleBank, note, octave) {
  let sortedBank = sampleBank.slice().sort((sampleA, sampleB) => {
    let distanceToA = Math.abs(getNoteDistance(note, octave, sampleA.note, sampleA.octave));
    let distanceToB = Math.abs(getNoteDistance(note, octave, sampleB.note, sampleB.octave));
    return distanceToA - distanceToB;
  });
  return sortedBank[0];
}

function fetchSample(path) {
  return fetch(encodeURIComponent(path))
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer));
}

function getSample(instrument, noteAndOctave) {
  let [, requestedNote, requestedOctaves] = /^(\w[b#]?)(\d)$/.exec(noteAndOctave);
  let requestedOctave = parseInt(requestedOctaves, 10);
  requestedNote = flatToSharp(requestedNote);
  let sampleBank = SAMPLE_LIBRARY[instrument];
  let sample = getNearestSample(sampleBank, requestedNote, requestedOctave);
  let distance = getNoteDistance(requestedNote, requestedOctave, sample.note, sample.octave);
  return fetchSample(sample.file).then(audioBuffer => ({
    audioBuffer: audioBuffer,
    distance: distance,
  }));
}

function playSample(instrument, note, delaySeconds = 0) {
  getSample(instrument, note).then(({ audioBuffer, distance }) => {
    let playbackRate = Math.pow(2, distance / 12);
    let bufferSource = audioContext.createBufferSource();
    bufferSource.buffer = audioBuffer;
    bufferSource.playbackRate.value = playbackRate;
    bufferSource.connect(audioContext.destination);
    bufferSource.start(audioContext.currentTime + delaySeconds);
  });
}

function startLoop(instrument, note, loopLengthSeconds, delaySeconds) {
  playSample(instrument, note, delaySeconds);
  setInterval(() => playSample(instrument, note, delaySeconds), loopLengthSeconds * 1000);
}

// startLoop('Grand Piano', 'C4', 20, 5);

/** END: Music for Airports */
