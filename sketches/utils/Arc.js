import { color, math } from 'canvas-sketch-util';

export class Arc {
  // Arcs
  constructor(radius, angle, width, startAngle, endAngle, vel, acc = 0) {
    this.radius = radius;
    this.angle = angle;
    this.width = width;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.vel = vel;
    this.acc = acc;
  }

  draw(context, cx, cy, r) {
    context.save();
    context.strokeStyle = color.parse(
      `hsla(${math.mapRange(
        this.radius * Math.cos(this.startAngle),
        -r,
        r,
        200,
        300
      )}, 50, 50, 1)`
    ).hex;
    context.translate(cx, cy);
    context.rotate(-this.angle);

    context.lineWidth = this.width;

    context.beginPath();

    context.arc(0, 0, this.radius, this.startAngle, this.endAngle);
    context.stroke();
    context.restore();
  }

  update() {
    this.startAngle += this.vel;
    this.endAngle += this.vel;
    this.vel += this.acc;
  }

  turn() {
    if (Math.abs(this.vel) > 0.02) {
      this.acc *= -1;
    }
  }
}
