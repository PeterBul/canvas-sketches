const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const color = require('canvas-sketch-util/color');
const { Agent, CircularAgent, Arc, Vector } = require('./utils');

const colors = ['#D34DF0', '#B55EF7', '#8960E0', '#685EF7', '#4F6DF5'];
const getRandomColorFromPallette = () =>
  color.offsetHSL(colors[random.rangeFloor(0, 5)], 0, 0, random.range(-20, 20))
    .hex;

const applyAngle = (point, angle, distance) => {
  return {
    x: point.x + Math.cos(angle) * distance,
    y: point.y + Math.sin(angle) * distance,
  };
};

const getPalletteGradients = (context) => {
  const color1 = getRandomColorFromPallette();
  const color2 = getRandomColorFromPallette();
  const color3 = getRandomColorFromPallette();
  const color4 = getRandomColorFromPallette();
  const color5 = getRandomColorFromPallette();

  const gradient = context.createLinearGradient(0, 0, 200, 200);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(0.25, color2);
  gradient.addColorStop(0.5, color3);
  gradient.addColorStop(0.75, color4);
  gradient.addColorStop(1, color5);
  return gradient;
};

const settings = {
  dimensions: [2160, 2160],
  animate: true,
};

const sketch = ({ context, width, height }) => {
  const cx = width * 0.5;
  const cy = height * 0.5;
  const w = width * 0.01;
  const h = height * 0.1;
  let x, y;

  const num = 5;
  const radius = width * 0.42;

  const rects = [];
  const arcs = [];
  const fillStyles = [];
  const strokeStyles = [];
  const agents = [];

  for (let i = 0; i < num; i++) {
    const slice = math.degToRad(360 / num);
    const angle = slice * i;
    x = cx + radius * Math.sin(angle);
    y = cy + radius * Math.cos(angle);

    fillStyles.push(getPalletteGradients(context));
    strokeStyles.push(getPalletteGradients(context));

    const scaleX = random.range(0.1, 0.2);
    const scaleY = random.range(0.9, 2);
    // rects.push(
    //   new Rect(x, y, -w * 0.5, random.range(0, -h * 1), angle, scaleX, scaleY)
    // );
    const r = radius - i * (radius / num);

    const vel = (Math.random() < 0.5 ? 1 : -1) * random.range(0.005, 0.009);
    const offset = new Vector(70 * i, 0);

    agents.push(
      new CircularAgent(
        cx,
        cy,
        // radius * random.range(0.1, 1.3),
        r,
        angle,
        vel,
        true,
        undefined,
        offset
      )
    );

    arcs.push(new Arc(r, 0, 5, 0, 2 * Math.PI, 0, undefined, offset));
  }
  // const strokeStyle = getPalletteGradients(context);

  return ({ context, width, height }) => {
    context.fillStyle = '#282c34';
    context.fillRect(0, 0, width, height);
    // context.strokeStyle = strokeStyle;

    for (let i = 0; i < num; i++) {
      context.fillStyle = fillStyles[i];
      const slice = math.degToRad(360 / num);
      const angle = slice * i;

      x = cx + radius * Math.sin(angle);
      y = cy + radius * Math.cos(angle);

      // const rect = rects[i];
      // rect.draw(context, w, h);
      const arc = arcs[i];
      arc.draw(context, cx, cy, radius);

      const agent = agents[i];
      if (agent) {
        agent.draw(context);
        agent.update();
      }
    }
  };
};

canvasSketch(sketch, settings);

class Rect {
  constructor(x, y, width, height, angle, scaleX, scaleY) {
    this.pos = new Point(x, y);
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
  }

  draw(context, w, h) {
    // Rectangles
    context.save();
    context.translate(this.pos.x, this.pos.y);
    context.rotate(-this.angle);
    context.scale(this.scaleX, this.scaleY);

    context.beginPath();
    context.rect(this.width, this.height, w, h);
    context.fill();
    context.restore();
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
