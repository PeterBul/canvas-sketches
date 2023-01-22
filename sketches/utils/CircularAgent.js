import { random } from 'canvas-sketch-util';
import { Vector } from './Vector';

export class CircularAgent {
  /**
   *
   * @param {number} cx
   * @param {number} cy
   * @param {number} radius
   * @param {number} angle
   * @param {number} vel
   * @param {boolean} withMoon
   * @param {number} radiusSize
   * @param {Vector} offset
   */
  constructor(
    cx,
    cy,
    radius,
    angle,
    vel,
    withMoon,
    radiusSize = random.range(10, 30),
    offset = new Vector(0, 0)
  ) {
    this.center = new Vector(cx, cy);
    this.vel = vel;
    // this.radius = radius ?? random.range(4, 12);
    this.radiusPos = radius ?? 10;
    this.radiusSize = radiusSize;
    this.angle = angle;
    this.offset = offset;
    if (withMoon) {
      const moonVel =
        (Math.random() < 0.5 ? 1 : -1) * random.range(0.005, 0.009);
      this.moon = new CircularAgent(
        0,
        0,
        this.radiusSize + 50,
        0,
        moonVel,
        false,
        random.range(5, this.radiusSize * 0.5)
      );
    }
  }

  update() {
    this.angle += this.vel;
    if (this.moon) {
      this.moon.update();
    }
  }

  draw(context) {
    context.save();

    context.translate(this.center.x, this.center.y);
    context.translate(this.offset.x, this.offset.y);
    context.rotate(this.angle);
    context.translate(0, this.radiusPos);

    context.lineWidth = 1;
    context.beginPath();
    context.arc(0, 0, this.radiusSize, 0, Math.PI * 2);
    context.fill();

    if (this.moon) {
      context.rotate(this.moon.angle);
      context.translate(0, this.moon.radiusPos);

      context.lineWidth = 1;
      context.beginPath();
      context.arc(0, 0, this.moon.radiusSize, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }
  }
}
