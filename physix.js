const context = canvas.getContext("2d");
const WIDTH = 600;
const HEIGHT = 600;

const DOMAIN = { w: WIDTH, h: HEIGHT };
canvas.width = WIDTH;
canvas.height = HEIGHT;

let PARTICLES = [];

canvas.addEventListener("click", (evt) => {
  const x = evt.offsetX;
  const y = evt.offsetY;
  const part = new particle(context, DOMAIN, { x, y }, 50);
});

class particle {
  constructor(context, domain, location, radius) {
    this.mass = 10;
    this.bounce = 0.3;
    this.domain = domain;
    this.acceleration = { x: 0, y: 0.2 };
    this.velocity = { x: 0, y: 0 };
    this.location = { x: location.x, y: location.y };
    this.radius = radius;

    this.markForDelete = false;

    PARTICLES.push(this);
  }

  update(ctx) {
    this.#markForDelete();
    this.#draw(ctx);
    this.#updateVelocity();
    this.#updateLocation();
  }

  #updateLocation() {
    this.location.x = this.location.x + this.velocity.x;
    this.location.y = this.location.y + this.velocity.y;
    if (this.location.y + this.radius > this.domain.h) {
      this.acceleration.y = 0;
      this.velocity.y = 0;

      this.location.y = this.domain.h - this.radius;
    }
  }

  #updateVelocity() {
    this.velocity.x = this.velocity.x + this.acceleration.x;
    this.velocity.y = this.velocity.y + this.acceleration.y;
  }

  #draw(ctx) {
    context.beginPath();
    context.lineWidth = 3;
    context.arc(this.location.x, this.location.y, this.radius, 0, 2 * Math.PI);
    context.stroke();
  }

  #markForDelete() {
    let { x, y } = this.location;
    let { w, h } = this.domain;
    let rad = this.radius;

    if (x + rad < 0 || x - rad > w || y + rad < 0 || y - rad > h)
      this.markForDelete = true;
  }

  // #getRandomRGB() {
  //   return `rgb(${Math.round(Math.random() * 255)},${Math.round(
  //     Math.random() * 255
  //   )},${Math.round(Math.random() * 255)})`;
  // }
}

function updateCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (let particle of PARTICLES) {
    if (particle.markForDelete) utils.remove(particle, PARTICLES);
    particle.update(context);
  }
  requestAnimationFrame(updateCanvas);
}

updateCanvas();
