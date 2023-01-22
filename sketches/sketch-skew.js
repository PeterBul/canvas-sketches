const canvasSketch = require('canvas-sketch');
import { math, random, color } from 'canvas-sketch-util';
import risoColors from 'riso-colors';

const settings = {
  dimensions: [1080, 1080],
};

const sketch = ({ width, height }) => {
  random.setSeed(555);
  console.log(random.value());
  console.log(random.value());
  console.log(random.value());
  let x, y, w, h, fill, stroke, blend;

  const num = 50;
  const degrees = -30;

  const rects = [];

  const rectColors = [random.pick(risoColors), random.pick(risoColors)];

  const bgColor = random.pick(risoColors).hex;

  const mask = {
    radius: width * 0.4,
    sides: 3,
    x: width * 0.5,
    y: height * 0.5,
  };

  for (let i = 0; i < num; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(600, 600);
    h = random.range(40, 200);
    fill = random.pick(rectColors);
    stroke = random.pick(rectColors);
    blend = random.value() > 0.5 ? 'overlay' : 'source-over';

    rects.push({ x, y, w, h, fill, stroke, blend });
  }

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);
    context.save();
    context.translate(mask.x, mask.y);
    drawPolygon({ context, radius: mask.radius, sides: mask.sides });

    context.clip();

    rects.forEach(({ x, y, w, h, fill, stroke, blend }) => {
      context.save();
      context.translate(-mask.x, -mask.y);
      context.translate(x, y);
      drawSkewedRect({
        context,
        degrees,
        h,
        w,
        fill: fill.hex,
        stroke: stroke.hex,
        blend,
      });

      context.restore();
    });

    context.restore();
    context.save();
    context.translate(mask.x, mask.y);
    context.lineWidth = 20;

    drawPolygon({
      context,
      radius: mask.radius - context.lineWidth,
      sides: mask.sides,
    });

    context.globalCompositeOperation = 'color-burn';
    context.strokeStyle = rectColors[1].hex;
    context.stroke();
    context.restore();
  };
};

const drawSkewedRect = ({
  context,
  w = 600,
  h = 200,
  degrees = -45,
  fill = 'blue',
  stroke = 'black',
  blend = 'overlay',
}) => {
  const angle = math.degToRad(degrees);

  const rx = Math.cos(angle) * w;
  const ry = Math.sin(angle) * w;

  // context.save();
  context.fillStyle = fill;
  context.strokeStyle = stroke;

  context.lineWidth = 10;
  context.globalCompositeOperation = blend;

  context.translate(rx * -0.5, (ry + h) * -0.5);

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.closePath();

  const shadowColor = color.offsetHSL(fill, 0, 0, -20);
  shadowColor.rgba[3] = 0.5;
  context.shadowColor = color.style(shadowColor.rgba);
  context.shadowOffsetX = -10;
  context.shadowOffsetY = 20;

  context.fill();
  context.shadowColor = null;

  context.stroke();

  context.globalCompositeOperation = 'source-over';

  context.lineWidth = 2;
  context.strokeStyle = 'black';
  context.stroke();

  // context.restore();
};

const drawPolygon = ({ context, radius = 100, sides = 3 }) => {
  const slice = (Math.PI * 2) / sides;

  context.beginPath();
  context.moveTo(0, -radius);

  for (let i = 1; i < sides; i++) {
    const theta = i * slice - Math.PI * 0.5;
    context.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius);
  }

  context.closePath();
};

canvasSketch(sketch, settings);
