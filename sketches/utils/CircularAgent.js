import { random } from 'canvas-sketch-util';
import { Vector } from './Vector';

export class CircularAgent {
  /**
   *
   * @param {number} radius
   * @param {number} vel
   */
  constructor(cx, cy, radius, angle, vel) {
    this.center = new Vector(cx, cy);
    this.pos = new Vector(
      cx + radius * Math.sin(angle),
      cx + radius * Math.cos(angle)
    );
    this.vel = vel;
    this.radius = radius ?? random.range(4, 12);
    this.angle = angle;
  }

  update(cx, cy) {
    this.angle += this.vel;
    this.pos.x = (cx ?? this.center.x) + Math.cos(this.angle) * 100;
    this.pos.y = (cy ?? this.center.y) + Math.sin(this.angle) * 100;
  }

  draw(context) {
    context.beginPath();
    context.save();
    context.translate(this.pos.x, this.pos.y);

    context.lineWidth = 1;
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    // context.fillStyle = "black";
    context.fill();
    context.stroke();

    context.restore();
  }
}
