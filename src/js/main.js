function fixRatio() {
  // 固定窗体比例 16:9
  let width = innerWidth;
  let height = innerHeight;

  if (width >= height) {
    width / 16 > height / 9 ?
      width = height / 9 * 16 :
      height = width / 16 * 9;

    document.querySelector(".container").style.width = width.toString() + "px";
    document.querySelector(".container").style.height = height.toString() +
    "px";
  } else {
    height / 16 > width / 9 ?
      height = width / 9 * 16 :
      width = height / 16 * 9;

    document.querySelector(".container").style.width = width.toString() + "px";
    document.querySelector(".container").style.height = height.toString() +
    "px";
  }
};

window.onload = () => {
  fixRatio();
};

window.onresize = () => {
  fixRatio();
};
