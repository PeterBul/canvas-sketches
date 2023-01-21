import { random } from 'canvas-sketch-util';
import { Vector } from './Vector';

export class CircularAgent {
  /**
   *
   * @param {number} radius
   * @param {number} vel
   */
  constructor(cx, cy, radius, angle, vel, withMoon) {
    this.center = new Vector(cx, cy);
    this.vel = vel;
    this.radius = radius ?? random.range(4, 12);
    this.angle = angle;
    if (withMoon) {
      this.moon = new CircularAgent(0, 0, radius + 20, 0, 0.01);
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
    context.rotate(this.angle);
    context.translate(0, this.radius);

    context.lineWidth = 1;
    context.beginPath();
    context.arc(0, 0, 20, 0, Math.PI * 2);
    // context.fillStyle = "black";
    context.fill();
    // moon

    context.restore();
    if (this.moon) {
      context.save();

      context.translate(this.center.x, this.center.y);
      context.rotate(this.angle);
      context.translate(0, this.radius);
      // context.translate(this.moon.center.x, this.moon.center.y);
      context.rotate(this.moon.angle);
      context.translate(0, this.moon.radius);

      context.lineWidth = 1;
      context.beginPath();
      context.arc(0, 0, 5, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }
  }
}
