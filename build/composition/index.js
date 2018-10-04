"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Composition;
(function (Composition) {
    var audioCtx = new AudioContext();
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = 'square'; // sine wave — other values are 'sine', 'sawtooth', 'triangle' and 'custom'
    oscillator.frequency.value = 180; // value in hertz
    var now = audioCtx.currentTime;
    oscillator.start(now);
    oscillator.stop(now + 1);
})(Composition = exports.Composition || (exports.Composition = {}));
//# sourceMappingURL=index.js.map