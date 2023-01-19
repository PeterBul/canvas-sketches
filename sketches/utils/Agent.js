import { random } from 'canvas-sketch-util';
import { Vector } from './Vector';

export class Agent {
  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   * @param {number} vel
   */
  constructor(x, y, radius, vel) {
    this.pos = new Vector(x, y);
    this.startPos = this.pos.copy();
    if (typeof vel === 'number') {
      this.vel = new Vector(vel, vel);
    } else {
      this.vel = vel ?? new Vector(random.range(-1, 1), random.range(-1, 1));
    }
    this.radius = radius ?? random.range(4, 12);
  }

  /**
   *
   * @param {number} width
   * @param {number} height
   */
  bounce(width, height) {
    if (this.pos.x <= 0 || this.pos.x >= width) this.vel.x *= -1;
    if (this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1;
  }

  bounceWithRadius(radius) {
    if (this.pos.getDistance(this.startPos) >= radius) {
      this.vel.x *= -1;
      this.vel.y *= -1;
    }
  }

  setVel(x, y) {
    this.vel = new Vector(x, y);
  }

  /**
   *
   * @param {number} width
   * @param {number} height
   */
  wrap(width, height) {
    if (this.pos.x <= 0) this.pos.x = width - 1;
    if (this.pos.x >= width) this.pos.x = 0;
    if (this.pos.y <= 0) this.pos.y = height - 1;
    if (this.pos.y >= height) this.pos.y = 0;
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  magnitude() {
    return Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
  }

  curve(angle) {
    this.vel.x = -1;
    this.vel.y = Math.sin(angle) / Math.cos(angle);
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
