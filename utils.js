const utils = {};

utils.lerp = (A, B, v) => {
  return A + (B - A) * v;
};

utils.remove = (element, list, count = 1) => {
  while (count > 0) {
    let i = list.indexOf(element);
    if (i < 0) {
      break;
    }
    list.splice(i, 1);
    count--;
  }
};

utils.isInCircle = (event, circleX, circleY, radius) => {
  let x = event.offsetX - circleX;
  let y = event.offsetY - circleY;
  hyp = Math.hypot(x, y);
  return hyp <= radius;
};
