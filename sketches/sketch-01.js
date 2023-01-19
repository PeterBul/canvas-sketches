const canvasSketch = require('canvas-sketch');
const Tweakpane = require('tweakpane');

const settings = {
  dimensions: [1080, 1080],
};

const params = {
  dim: 6,
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.lineWidth = width * 0.01;

    const ix = width * 0.17;
    const iy = width * 0.17;

    const gap = width * 0.03;
    const gridWidth = width - 2 * ix;
    const gridHeight = height - 2 * iy;
    const w = (gridWidth - (params.dim - 1) * gap) / params.dim;
    const h = (gridHeight - (params.dim - 1) * gap) / params.dim;

    const off = width * 0.02;

    let x, y;

    context.strokeStyle = 'white';
    for (let i = 0; i < params.dim; i++) {
      for (let j = 0; j < params.dim; j++) {
        x = ix + (w + gap) * i;
        y = iy + (w + gap) * j;

        context.beginPath();
        context.rect(x, y, w, h);
        context.stroke();

        if (Math.random() > 0.5) {
          context.beginPath();
          context.rect(x + off / 2, y + off / 2, w - off, h - off);
          context.stroke();
        }
      }
    }
  };
};

const createPane = (manager) => {
  const pane = new Tweakpane.Pane();

  let folder;

  folder = pane.addFolder({ title: 'Layout' });
  folder.addInput(params, 'dim', { min: 2, max: 20, step: 1 });
  pane.on('change', (ev) => {
    manager.render();
  });
};

const start = async () => {
  const manager = await canvasSketch(sketch, settings);
  createPane(manager);
};

start();
