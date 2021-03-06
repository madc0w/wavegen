const baseUrl = 'https://madc0w.github.io/wavegen/tracks';
const freqRange = {
	min: 0,
	max: 4000,
};
let freq1 = 100;
let freq2 = 220;

const buffers = {};
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let source;

function onLoad() {
	loadTrack('sweet dreams - mono');
	loadTrack('all I have to do is dream - mono');
}

function start() {
	const secs = 240;
	const arrayBuffer = audioCtx.createBuffer(
		1,
		audioCtx.sampleRate * secs,
		audioCtx.sampleRate
	);

	source = audioCtx.createBufferSource();
	source.buffer = arrayBuffer;
	source.connect(audioCtx.destination);
	source.start();

	// // 1 sec = arrayBuffer.length / audioCtx.sampleRate samples
	// // console.log('audioCtx.sampleRate', audioCtx.sampleRate);
	// // console.log('arrayBuffer.length', arrayBuffer.length);
	const buffer = arrayBuffer.getChannelData(0);
	const data1 = buffers['sweet dreams - mono'].getChannelData(0);
	const data2 = buffers['all I have to do is dream - mono'].getChannelData(0);
	console.log('computing buffer...');
	for (let i = Math.floor(freq1); i < arrayBuffer.length; i++) {
		// buffer[i] = data1[i] * data2[i];
		// const a1 = (i * 2 * Math.PI * freq1) / audioCtx.sampleRate;
		// buffer[i] = Math.sign(data1[i]) * Math.pow(Math.abs(data1[i]), freq1);
		let t = 0;
		for (let j = 0; j < freq1; j++) {
			buffer[i] += j * data1[i - j];
			t += j;
		}
		buffer[i] /= t;
		// buffer[i] = (data1[i] + data1[Math.floor(i + freq1)]) / 2;
		// console.log(data1[i], buffer[i]);

		// const a1 = (i * 2 * Math.PI * freq1) / audioCtx.sampleRate;
		// // const a2 = Math.PI / 2;
		// const a2 = (i * 2 * Math.PI * freq2) / audioCtx.sampleRate;
		// // console.log(i, Math.sin(a) * Math.sin(a2));
		// buffer[i] = Math.sin(a1) * Math.sin(a2);
	}
	console.log('buffer computed');

	// {
	// 	const oscillator = audioCtx.createOscillator();
	// 	oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // value in hertz
	// 	oscillator.connect(audioCtx.destination);
	// 	oscillator.start();
	// }
}

function change(el) {
	const val =
		freqRange.min +
		((freqRange.max - freqRange.min) * parseFloat(el.value)) / 100;
	// console.log(el.value);
	// console.log(val);
	document.getElementById(`${el.id}-value`).innerHTML = val.toFixed(3);
	if (el.id == 'freq1-range') {
		freq1 = val;
	} else if (el.id == 'freq2-range') {
		freq2 = val;
	}
	if (source) {
		source.stop();
	}
	start();
}

function loadTrack(fileName) {
	const request = new XMLHttpRequest();
	const url = `${baseUrl}/${fileName}.mp3`;
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';
	request.onload = () => {
		audioCtx.decodeAudioData(request.response, (audioBuffer) => {
			buffers[fileName] = audioBuffer;
			console.log('loaded', fileName);
		});
	};
	request.send();
}
