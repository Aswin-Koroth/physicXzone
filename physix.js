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
  const part = new particle(DOMAIN, { x, y }, 50, Math.random() / 2 + 0.5);
});

class particle {
  constructor(domain, location, radius, bounce) {
    this.mass = 10;
    this.bounce = bounce;
    this.domain = domain;
    this.acceleration = new Vector(0, 0);
    this.gravity = new Vector(0.2, 0.2);
    this.velocity = new Vector(0, 0);
    this.location = new Vector(location.x, location.y);
    this.radius = radius;

    this.markForDelete = false;

    this.color = this.#getRandomRGB();

    PARTICLES.push(this);
  }

  update(ctx) {
    // this.#markForDelete();
    this.#draw(ctx);
    this.#updateVelocity();
    this.#updateLocation();
  }

  #updateVelocity() {
    this.velocity = this.velocity.add(this.acceleration.add(this.gravity));
  }

  #updateLocation() {
    this.location.x = this.location.x + this.velocity.x;
    this.location.y = this.location.y + this.velocity.y;

    //bottom
    if (this.location.y + this.radius > this.domain.h) {
      let normalVector = new Vector(0, 1);
      this.velocity = this.#getReflectedVector(this.velocity, normalVector);
      this.velocity = this.velocity.mul(this.bounce);
      this.acceleration.y = 0;
      this.location.y = this.domain.h - this.radius;
    }
    //top
    if (this.location.y - this.radius < 0) {
      let normalVector = new Vector(0, -1);
      this.velocity = this.#getReflectedVector(this.velocity, normalVector);
      this.velocity = this.velocity.mul(this.bounce);
      this.acceleration.y = 0;
      this.location.y = this.radius;
    }
    //right
    if (this.location.x + this.radius > this.domain.w) {
      let normalVector = new Vector(-1, 0);
      this.velocity = this.#getReflectedVector(this.velocity, normalVector);
      this.velocity = this.velocity.mul(this.bounce);
      this.acceleration.y = 0;
      this.location.x = this.domain.w - this.radius;
    }
    //left
    if (this.location.x - this.radius < 0) {
      let normalVector = new Vector(1, 0);
      this.velocity = this.#getReflectedVector(this.velocity, normalVector);
      this.velocity = this.velocity.mul(this.bounce);
      this.acceleration.y = 0;
      this.location.x = this.radius;
    }
  }

  #getReflectedVector(incident, normal) {
    // V = I - 2(N dot I)N
    return incident.sub(normal.mul(2 * normal.dotProduct(incident)));
  }

  #draw(ctx) {
    ctx.beginPath();
    ctx.lineWidth = 0.1;
    ctx.fillStyle = this.color;
    ctx.arc(this.location.x, this.location.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.fillText(
      this.velocity.y.toFixed(2),
      this.location.x - 25,
      this.location.y + 5
    );
  }

  // #markForDelete() {
  //   let { x, y } = this.location;
  //   let { w, h } = this.domain;
  //   let rad = this.radius;

  //   if (x + rad < 0 || x - rad > w || y + rad < 0 || y - rad > h)
  //     this.markForDelete = true;
  // }

  #getRandomRGB() {
    return `rgb(${Math.round(Math.random() * 255)},${Math.round(
      Math.random() * 255
    )},${Math.round(Math.random() * 255)})`;
  }
}

let lastTime = 0;

function updateCanvas(currentTime) {
  let deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  showFrameRate(deltaTime);

  for (let particle of PARTICLES) {
    if (particle.markForDelete) utils.remove(particle, PARTICLES);
    particle.update(context);
  }
  requestAnimationFrame(updateCanvas);
}

function showFrameRate(deltaTime) {
  let frameRate = Math.round(1000 / deltaTime);
  context.font = "25px Arial";
  context.fillStyle = "red";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(frameRate, 10, 25);
}

updateCanvas();
