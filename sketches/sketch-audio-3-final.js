import { canvasSketch } from 'canvas-sketch';
import { math, random, color } from 'canvas-sketch-util';
import { Pane } from 'tweakpane';
import { songs } from './songs';
import SongLibrary from './SongLibrary.mjs';

const songLibrary = new SongLibrary();

let filenames = songs;

const settings = {
  dimensions: [1080, 1080],
  animate: true,
  hotkeys: false,
};

const irisProps = {
  background: 'background',
  outerRing: 'outerRing',
  innerRing: 'innerRing',
  innerRingWidth: 'innerRingWidth',
  lines: 'lines',
  numSlices: 'numSlices',
  numSeg: 'numSeg',
  lineWidth: 'lineWidth',
  lineTransparency: 'lineTransparency',
  freq: 'freq',
  amp: 'amp',
};

const link = document.createElement('link');
link.href = 'styles.css';
link.type = 'text/css';
link.rel = 'stylesheet';
link.media = 'screen,print';
document.getElementsByTagName('head')[0].appendChild(link);

const irisParams = {
  [irisProps.background]: '#1e2746',
  [irisProps.outerRing]: '#2E4F6E',
  [irisProps.innerRing]: '#FFDF8F',
  [irisProps.lines]: '#5289c2',
  [irisProps.innerRingWidth]: 1.3,
  [irisProps.numSlices]: 490,
  [irisProps.numSeg]: 6,
  [irisProps.lineWidth]: 2,
  [irisProps.lineTransparency]: 1,
  [irisProps.freq]: 0.2,
  [irisProps.amp]: 14,
};

let commandLineContent = '';

const glareParams = {
  x: -35.22,
  y: -40.0,
  rotation: 5.46,
  scale: 0.1,
};

let audio;

let audioContext, sourceNode, analyserNode, audioData;

let radius;
let irisLines;

let minDb, maxDb;

let manager;

let gradient;

let areSongsLoaded = false;

const withoutAudio = false;

const bins = [4, 17, 80];
const getRadius = (i) => {
  if (withoutAudio) {
    switch (i) {
      // White
      case 0:
        return 300;
      case 1:
        // Iris
        return 200;
      case 2:
        // Pupil
        return 50;
    }
  }
  const bin = bins[i];
  let baseRadius = math.mapRange(audioData[bin], minDb, maxDb, 0, 300, true);

  if (i === 2) {
    baseRadius *= 0.5;
  }

  return baseRadius;
};

// Slice has: {strokeStyle, segments}

const irisLinesDeps = new Set([
  irisProps.numSlices,
  irisProps.lineTransparency,
  irisProps.numSeg,
  irisProps.freq,
  irisProps.amp,
  irisProps.lines,
]);

const makeIrisLines = () => {
  const slices = [];
  for (let sliceNum = 0; sliceNum < irisParams.numSlices; sliceNum++) {
    const [r, g, b] = color.offsetHSL(
      // '#3c5c8f',
      irisParams.lines,
      0,
      0,
      // random.range(-10, 30)
      random.range(-10, 10)
    ).rgb;

    const slice = new Slice(
      `rgba(${r},${g},${b}, ${irisParams.lineTransparency})`
    );
    for (let seg = 1; seg < irisParams.numSeg + 1; seg++) {
      slice.addSegment(
        seg === irisParams.numSeg
          ? 0
          : random.noise2D(
              sliceNum % irisParams.numSlices,
              seg,
              irisParams.freq,
              irisParams.amp
            )
      );
    }
    slices.push(slice);
  }
  return slices;
};

let cx, cy;
let outerRingGradient;

const outerRingGradientDeps = new Set([irisProps.outerRing]);
const makeOuterRingGradient = () => {
  const baseWhite = '#ffffff';

  return new GradientStroke(cx, cy, 0, [
    { color: `${irisParams.outerRing}ff`, offset: 0 },
    { color: `${irisParams.outerRing}ff`, offset: 0.1 },
    { color: `${irisParams.outerRing}00`, offset: 0.7 },
    { color: `${irisParams.outerRing}`, offset: 0.9 },
    { color: `${baseWhite}ff`, offset: 1 },
  ]);
};
const sketch = ({ canvas, width, height }) => {
  addListeners(canvas);
  cx = width * 0.5;
  cy = height * 0.5;
  irisLines = makeIrisLines();
  // const baseColor = '#183EA8';
  // const baseColor = '#1e2746';
  const _container = document.createElement('div');
  _container.classList.add('container');
  _container.append(canvas);
  _container.width = '100vw';
  _container.height = '100wh';
  document.querySelector('body').append(_container);

  outerRingGradient = makeOuterRingGradient();
  return ({ context, width, height }) => {
    if (
      (!areSongsLoaded && songLibrary.isSongLibraryLoaded) ||
      songLibrary.needsReload
    ) {
      filenames = songLibrary.fileNames;
      areSongsLoaded = true;
      console.log(!areSongsLoaded, songLibrary.isSongLibraryLoaded, filenames);
    }
    const slice = (2 * Math.PI) / irisParams.numSlices;
    // context.fillStyle = '#eeeae0';
    context.fillStyle = '#282c34';
    context.fillRect(0, 0, width, height);

    if (!withoutAudio) {
      if (!audioContext) return;
      analyserNode.getFloatFrequencyData(audioData);
    }
    const pupilRadius = getRadius(2);

    // White
    context.save();
    context.translate(cx, cy);
    context.lineWidth = 10;
    radius = getRadius(0);
    context.fillStyle = 'aliceblue';
    context.beginPath();
    context.arc(0, 0, radius, 0, 2 * Math.PI);
    // context.stroke();
    context.fill();
    context.restore();

    // Iris
    context.save();
    context.translate(cx, cy);
    context.lineWidth = 10;
    radius = getRadius(1);

    gradient = context.createRadialGradient(0, 0, 0, 0, 0, radius);
    gradient.addColorStop(0, `${irisParams.background}00`);
    gradient.addColorStop(0.1, `${irisParams.background}ff`);
    gradient.addColorStop(0.9, `${irisParams.background}ff`);
    gradient.addColorStop(1, `${irisParams.background}00`);
    context.fillStyle = gradient;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(0, -radius);
    context.beginPath();
    context.arc(0, 0, radius, 0, 2 * Math.PI);
    context.stroke();
    context.fill();
    context.restore();

    // Iris lines
    context.save();
    context.translate(cx, cy);
    radius = getRadius(1);
    context.fillStyle = '#1e2746';
    context.lineWidth = irisParams.lineWidth;
    const irisWidth = radius - pupilRadius;
    irisLines.forEach((line) => {
      context.strokeStyle = line.strokeStyle;
      context.rotate(slice);
      context.beginPath();
      context.moveTo(0, -pupilRadius * 0.9);
      line.segments.forEach((segment, index) => {
        context.lineTo(
          segment.xOffset,
          -pupilRadius - ((index + 1) / irisParams.numSeg) * irisWidth
        );
      });
      context.stroke();
    });
    context.restore();
    outerRingGradient.draw(context, radius * 1.1);

    context.save();
    context.globalCompositeOperation = 'color';
    context.translate(cx, cy);
    gradient = context.createRadialGradient(
      0,
      0,
      pupilRadius,
      0,
      0,
      pupilRadius * irisParams.innerRingWidth
    );
    gradient.addColorStop(0, `${irisParams.innerRing}aa`);
    gradient.addColorStop(1, `${irisParams.innerRing}00`);
    context.beginPath();
    context.arc(0, 0, pupilRadius * irisParams.innerRingWidth, 0, 2 * Math.PI);
    context.fillStyle = gradient;
    context.fill();

    context.restore();

    // Pupil
    context.save();
    context.translate(cx, cy);
    context.lineWidth = 10;
    radius = getRadius(2) * 1.3;
    gradient = context.createRadialGradient(0, 0, 0, 0, 0, radius);
    gradient.addColorStop(0, 'black');
    gradient.addColorStop(0.7, 'black');
    gradient.addColorStop(1, '#00000000');
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(0, 0, radius, 0, 2 * Math.PI);
    context.fill();
    context.restore();

    // Glare
    // context.save();
    // context.translate(cx, cy);
    // context.rotate(glareParams.rotation);
    // context.translate(glareParams.x, glareParams.y - pupilRadius);
    // context.scale(glareParams.scale, glareParams.scale);
    // context.beginPath();

    // for (let i = 0; i < points.length - 1; i++) {
    //   const curr = points[i + 0];
    //   const next = points[i + 1];

    //   const mx = curr.x + (next.x - curr.x) * 0.5;
    //   const my = curr.y + (next.y - curr.y) * 0.5;

    //   if (i === 0) context.moveTo(curr.x, curr.y);
    //   else if (i === points.length - 2)
    //     context.quadraticCurveTo(curr.x, curr.y, next.x, next.y);
    //   else context.quadraticCurveTo(curr.x, curr.y, mx, my);
    // }
    // context.closePath();
    // context.fillStyle = '#fbfcfe';
    // context.fill();
    // context.restore();
  };
};

const addListeners = (canvas) => {
  if (withoutAudio) {
    return;
  }
  canvas.addEventListener('mouseup', () => {
    if (!audioContext) {
      createAudio();
    }
    if (audio.paused) {
      audio.play();
      manager.play();
    } else {
      audio.pause();
      manager.pause();
    }
  });
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowRight': {
        if (e.ctrlKey) {
          forward(10);
        } else {
          playNextSong();
        }
        return;
      }
      case 'ArrowLeft': {
        if (e.ctrlKey) {
          rewind(10);
        } else {
          playPrevSong();
        }
        return;
      }
      case '/': {
        if (commandLineContent) {
          break;
        }
        commandLineContent = '/';
        commandLine.innerText = commandLineContent;
        return;
      }
      case ':': {
        if (commandLineContent) {
          break;
        }
        commandLineContent = ':';
        commandLine.innerText = commandLineContent;
        return;
      }
    }
    const firstChar = commandLineContent[0];
    if (firstChar === '/' || firstChar === ':') {
      if (
        e.key.charCodeAt(0) >= 32 &&
        e.key.charCodeAt(0) <= 123 &&
        e.key.length === 1
      ) {
        commandLineContent += e.key;
      } else if (e.key === 'Backspace') {
        commandLineContent = commandLineContent.slice(
          0,
          commandLineContent.length - 1
        );
      } else if (e.key === 'Escape') {
        commandLineContent = '';
      } else if (e.key === 'Enter') {
        const command = commandLineContent.slice(1).toLowerCase();
        if (!command) {
          commandLineContent = '';
          commandLine.innerText = commandLineContent;
          return;
        }
        if (firstChar === '/') {
          let i = filenames
            .slice(songIndex + 1)
            .findIndex((song) => song.toLowerCase().includes(command));
          if (i > -1) {
            playIndex(i + songIndex + 1);
          } else {
            i = filenames
              .slice(0, songIndex + 2)
              .findIndex((song) => song.toLowerCase().includes(command));
            if (i > -1) {
              playIndex(i);
            }
          }
          commandLineContent = '';
        } else if (firstChar === ':') {
          const ADD_CATEGORY = 'add_category ';
          const REMOVE_CATEGORY = 'remove_category ';
          const value = command.slice(command.indexOf(' ') + 1);
          if (!value) {
            commandLineContent = '';
            commandLine.innerText = commandLineContent;
            return;
          }
          if (command.startsWith(ADD_CATEGORY) || command.startsWith('ac ')) {
            songLibrary.addCategory(value);
            console.log([...songLibrary.categories]);
          } else if (
            command.startsWith(REMOVE_CATEGORY) ||
            command.startsWith('rc ')
          ) {
            songLibrary.removeCategory(value);
            console.log([...songLibrary.categories]);
          } else if (command === 'cc') {
            songLibrary.clearCategories();
          } else if (
            command.startsWith('c ') ||
            command.startsWith('category')
          ) {
            songLibrary.setCategory(value);
            console.log([...songLibrary.categories]);
          } else if (command === 'p') {
            songLibrary.fileNames.forEach((s) => console.log(s));
          }
        }
        commandLineContent = '';
      }
    }
    commandLine.innerText = commandLineContent;
  });
};

// const songs = ['Bendja-EndlessNight.wav', 'Twee-Kaufmann.mp3'];
let songIndex = 0;

const createAudio = async () => {
  audio = document.createElement('audio');

  audio.src = `audio/${filenames[0]}`;

  console.log('Playing:', filenames[0]);
  console.log(audio);
  audioContext = new AudioContext();

  audio.addEventListener('ended', () => {
    playNextSong();
  });

  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 512;
  analyserNode.smoothingTimeConstant = 0.8;

  sourceNode.connect(analyserNode);

  minDb = analyserNode.minDecibels;
  maxDb = analyserNode.maxDecibels;

  audioData = new Float32Array(analyserNode.frequencyBinCount);
};

const playNextSong = async () => {
  songIndex = (songIndex + 1) % filenames.length;
  playNewSong();
};

const playNewSong = () => {
  console.log('Playing:', filenames[songIndex]);
  audio.src = `audio/${filenames[songIndex]}`;
  audio.play();
};

const playIndex = (index) => {
  if (index >= filenames.length) {
    return;
  }
  songIndex = index;
  playNewSong();
};

const playPrevSong = async () => {
  if (audio.currentTime > 2) {
    audio.currentTime = 0;
    return;
  }
  songIndex = songIndex - 1;
  if (songIndex < 0) {
    songIndex = filenames.length - 1;
  }
  playNewSong();
};

const forward = (seconds) => {
  audio.currentTime = audio.currentTime + seconds;
};

const rewind = (seconds) => {
  audio.currentTime = audio.currentTime - seconds;
};

const start = async () => {
  manager = await canvasSketch(sketch, settings);

  if (!withoutAudio) {
    manager.pause();
  }
};

class Slice {
  constructor(strokeStyle) {
    this.strokeStyle = strokeStyle;
    this.segments = [];
  }

  addSegment(xOffset) {
    this.segments.push({ xOffset });
  }
}

const createPane = () => {
  const pane = new Pane();
  let folder;

  folder = pane.addFolder({ title: 'Iris' });
  folder.addInput(irisParams, irisProps.numSlices, {
    min: 200,
    max: 1000,
    step: 1,
  });
  folder.addInput(irisParams, irisProps.numSeg, { min: 3, max: 10, step: 1 });
  folder.addInput(irisParams, irisProps.lineWidth, { min: 0.1, max: 2 });
  folder.addInput(irisParams, irisProps.lineTransparency, { min: 0, max: 1 });
  folder.addInput(irisParams, irisProps.freq, { min: 0, max: 2 });
  folder.addInput(irisParams, irisProps.amp, { min: 1, max: 20 });
  folder.addInput(irisParams, irisProps.innerRingWidth, { min: 1, max: 2 });
  folder.addInput(irisParams, irisProps.background);
  folder.addInput(irisParams, irisProps.outerRing);
  folder.addInput(irisParams, irisProps.innerRing);
  folder.addInput(irisParams, irisProps.lines);

  // folder = pane.addFolder({ title: 'Glare' });
  // folder.addInput(glareParams, 'x', { min: -1080 / 2, max: 1080 / 2 });
  // folder.addInput(glareParams, 'y', { min: -1080 / 2, max: 1080 / 2 });
  // folder.addInput(glareParams, 'rotation', { min: 0, max: 2 * Math.PI });
  // folder.addInput(glareParams, 'scale', { min: 0, max: 1 });

  pane.on('change', (ev) => {
    if (irisLinesDeps.has(ev.presetKey)) {
      irisLines = makeIrisLines();
    }
    if (outerRingGradientDeps.has(ev.presetKey)) {
      outerRingGradient = makeOuterRingGradient();
    }
  });
};

let commandLine;

const createCommandLine = () => {
  commandLine = document.createElement('div');
  commandLine.classList.add('command-line');
  commandLine.style.width = '100vw';
  commandLine.style.position = 'absolute';
  commandLine.style.bottom = '0px';
  commandLine.style.backgroundColor = 'mediumseagreen';
  commandLine.style.boxSizing = 'border-box';
  document.querySelector('body').append(commandLine);
};

class GradientStroke {
  /**
   *
   * @param {number} x x-coordinate of center of circle
   * @param {number} y y-coordinate of center of circle
   * @param {number} r0 radius of inner circle
   * @param {{color: string; offset: number}[]} colors array
   */
  constructor(x, y, r0, colors) {
    if (this.r0 < 0) {
      throw new Error('Radiuses have to be positive.');
    }
    this.x = x;
    this.y = y;
    this.r0 = r0;
    this.colors = colors;
  }

  /**
   *
   * @param {*} context
   * @param {number} outerRadius
   */
  draw(context, outerRadius) {
    // if (this.r0 >= outerRadius) {
    //   throw new Error(
    //     'Outer radius has to be strictly larger than inner radius.'
    //   );
    // }
    context.save();
    context.translate(this.x, this.y);
    // context.globalCompositeOperation = 'color-burn';
    const gradient = context.createRadialGradient(
      0,
      0,
      this.r0,
      0,
      0,
      outerRadius
    );
    this.colors.forEach((c, i) => {
      gradient.addColorStop(c.offset, c.color);
    });
    context.fillStyle = gradient;
    context.arc(0, 0, outerRadius, 0, 2 * Math.PI);
    context.fill();
    context.restore();
  }
}

createPane();
createCommandLine();
start();
