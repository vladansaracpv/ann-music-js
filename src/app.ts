import * as Tone from 'tone';

const audioContext  = new AudioContext();


const loadSound = (sound: string, baseUrl = '/src/sounds/'): AudioBufferSourceNode => {
  const sourceNode = audioContext.createBufferSource();
  fetch(baseUrl + sound)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then((audioBuffer) => {
      sourceNode.buffer = audioBuffer;
    })
    .catch(e => console.error(e));
  return sourceNode;
};

const hi = loadSound('chorus-female-g5.wav');

const pannerNodehi = audioContext.createStereoPanner();
pannerNodehi.pan.value = -1;
hi.connect(pannerNodehi);
pannerNodehi.connect(audioContext.destination);
hi.start(0, 0, 5);

console.log('Ok');
