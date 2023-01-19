import canvasSketch from 'canvas-sketch';
import { color, math, random } from 'canvas-sketch-util';
import { Pane } from 'tweakpane';
import { Vector, Agent } from './utils';

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const numCirclesMax = 500;

const params = {
  cols: 10,
  rows: 10,
  scaleMin: 1,
  scaleMax: 30,
  freq: 0.001,
  amp: 0.2,
  animate: true,
  frame: 0,
  lineCap: 'butt',
  objectColor: '#e05b5e',
  angleHueOffset: 0,
  backgroundColor: '#282c34',
  numCircles: 10,
};

let circles = [];

let bigCircleRadius;
let centerX;
let centerY;

const refreshCircles = () => {
  circles = [];
  for (let i = 0; i < params.numCircles; i++) {
    const radius = random.range(3, 50);
    const angle = ((2 * Math.PI) / params.numCircles) * i;
    const pos = getPointFromAngle(
      angle,
      bigCircleRadius + (Math.random() < 0.1 ? random.range(-200, 0) : 0)
    );
    circles.push(new Agent(pos.x + centerX, pos.y + centerY, radius));
  }
};

const sketch = ({ width, height }) => {
  const gridW = width * 0.8;
  const gridH = height * 0.8;
  const margX = (width - gridW) * 0.5;
  const margY = (height - gridH) * 0.5;
  bigCircleRadius = gridW / 2;
  centerX = margX + gridW / 2;
  centerY = margY + gridH / 2;
  refreshCircles();
  return ({ context, width, height, frame }) => {
    context.fillStyle = params.backgroundColor;
    context.fillRect(0, 0, width, height);
    context.strokeStyle = params.objectColor;
    context.lineWidth = 5;

    context.save();
    context.beginPath();

    context.translate(margX + gridW / 2, margY + gridH / 2);
    context.arc(10, 10, bigCircleRadius, 0, 2 * Math.PI);
    context.stroke();

    context.restore();

    circles.forEach((c) => {
      context.strokeStyle = color.offsetHSL(context.strokeStyle, 10, 0, 0).hex;
      c.draw(context);
      c.update();
      c.bounceWithRadius(20);
    });
  };
};

const start = async () => {
  const manager = await canvasSketch(sketch, settings);
  createPane(manager);
};

const createPane = (manager) => {
  const pane = new Pane();
  let folder;

  folder = pane.addFolder({ title: 'Grid' });
  folder.addInput(params, 'numCircles', {
    min: 1,
    max: numCirclesMax,
    step: 1,
  });

  folder = pane.addFolder({ title: 'Appearance' });
  folder.addInput(params, 'objectColor');
  folder.addInput(params, 'angleHueOffset', { min: 0, max: 100 });
  folder.addInput(params, 'backgroundColor');

  pane.on('change', (ev) => {
    refreshCircles();
  });
};

start();

const getPointFromAngle = (radAngle, radius) => {
  const x = Math.cos(radAngle) * radius;
  const y = Math.sin(radAngle) * radius;

  return new Vector(x, y);
};
