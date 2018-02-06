let p5Instance = null;

function newP5Instance() {
  const s = function (sketch) {
    sketch.setup = function () {
      document.body.style.userSelect = 'none';
      const canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
      canvas.position(0, 0);
      canvas.style('pointer-events', 'none');
      sketch.clear();
    };
    sketch.draw = function () {
      sketch.stroke(0);
      sketch.strokeWeight(4);
      if (sketch.mouseIsPressed) {
        sketch.line(sketch.mouseX, sketch.mouseY, sketch.pmouseX, sketch.pmouseY);
      }
    };
  };
  return new p5(s);
}

function toggleSketch(turnOn) {
  if (turnOn) {
    p5Instance = newP5Instance();
  } else if (p5Instance) {
    p5Instance.remove();
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const sketchOn = request.sketchOn;
  if (sketchOn === true) {
    toggleSketch(true);
  }
  if (sketchOn === false) {
    toggleSketch(false);
  }
});
