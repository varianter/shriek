// Car
const CAR_START_SPEED = 0;
const CAR_START_ANGLE = -Math.PI / 2;
const CAR_RADIUS = 10;
const CAR_ACCELERATION = 0.5;
const CAR_ROTATION = 0.04 * Math.PI;
const GROUNDSPEED_DECAY_MULT = 0.94;
const CAR_MIN_TURN_SPEED = 0.5; // Minimum speed to turn
const CAR_MIN_SPEED = 0.1; // Minimum speed the car can go
const CAR_BOUNCE_TIMER = 15;

export default class Car {
  constructor(
    element,
    input,
    radius = CAR_RADIUS,
    speed = CAR_START_SPEED,
    angle = CAR_START_ANGLE
  ) {
    this.element = element;

    const rect = element.getBoundingClientRect();
    this.x = rect.x;
    this.y = rect.y;

    this.radius = radius;
    this.speed = speed;
    this.angle = angle;
    this.outOfControlTimer = 0;

    this.input = input;
  }

  /**
   * Return car's next horizontal position
   */
  getNextX() {
    return this.x + Math.cos(this.angle) * this.speed;
  }

  /**
   * Return car's next vertival position
   */
  getNextY() {
    return this.y + Math.sin(this.angle) * this.speed;
  }

  /**
   * Update
   * @param {*} canvas
   * @param {*} input
   */
  update(width, height) {
    if (this.outOfControlTimer > 0) {
      this.outOfControlTimer = this.outOfControlTimer - 1;
    } else {
      if (this.input.forward) {
        this.speed = this.speed + CAR_ACCELERATION;
      }
      if (this.input.left && Math.abs(this.speed) > CAR_MIN_TURN_SPEED) {
        this.angle = this.angle - CAR_ROTATION;
      }
      if (this.input.right && Math.abs(this.speed) > CAR_MIN_TURN_SPEED) {
        this.angle = this.angle + CAR_ROTATION;
      }
    }
    // Move
    this.x = this.x + Math.cos(this.angle) * this.speed;
    this.y = this.y + Math.sin(this.angle) * this.speed;

    // Automatic deceleration
    if (Math.abs(this.speed) > CAR_MIN_SPEED)
      this.speed = this.speed * GROUNDSPEED_DECAY_MULT;
    else this.speed = 0;
    // Wall bounce
    // if (this.y <= height / 2 || this.y >= height) this.speed *= -1;
    // if (this.x >= width || this.x <= 0) this.speed *= -1;
  }

  /**
   * Draw
   */
  draw() {
    let transform = `translate(${this.x}, ${this.y}) rotate(${toDegrees(
      this.angle
    )})`;
    this.element.setAttribute("transform", transform);
  }

  /**
   * Called when the bounces on a wall
   */
  trackBounce() {
    this.outOfControlTimer = CAR_BOUNCE_TIMER;
    this.speed = this.speed * -0.5;
  }

  /**
   * Reset ball position and speed
   */
  reset(carStartX, carStartY) {
    this.x = carStartX;
    this.y = carStartY;
    this.speed = CAR_START_SPEED;
    this.angle = CAR_START_ANGLE;
  }
}

function toDegrees(angle) {
  return angle * (180 / Math.PI);
}