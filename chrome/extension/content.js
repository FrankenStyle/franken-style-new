let previousEl = null;
let p5Instance = null;

function mouseOverHandler(event) {
  const selectedEl = event.target;
  const selectedClassName = selectedEl.className;
  const selectedNode = selectedEl.nodeName;
  const selectedClassList = selectedEl.classList;

  if (selectedEl.nodeName) {
    if (previousEl != null) {
      previousEl.classList.remove('mouseHoverElement');
    }
    selectedEl.classList.add('mouseHoverElement');
    previousEl = selectedEl;

    chrome.runtime.sendMessage({ selectedClassName, selectedNode, selectedClassList }, () => {
    });
  }
}

function toggleHighlight(turnOn) {
  if (turnOn) {
    document.addEventListener('mouseover', mouseOverHandler, false);
  } else {
    document.removeEventListener('mouseover', mouseOverHandler, false);
  }
}

function newP5Instance() {
  const s = function (sketch) {
    sketch.setup = function () {
      document.body.style['userSelect'] = 'none';
      let canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
      canvas.position(0, 0);
      canvas.style('pointer-events', 'none');
      sketch.clear();
    }
    sketch.draw = function () {
      sketch.stroke(0);
      sketch.strokeWeight(4);
      if (sketch.mouseIsPressed) {
        sketch.line(sketch.mouseX, sketch.mouseY, sketch.pmouseX, sketch.pmouseY);
      }
    }
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

chrome.storage.onChanged.addListener((changes, namespace) => {
  const linksList = document.querySelectorAll('a');
  const changeArr = [];
  for (const key in changes) {
    const storageChange = changes[key];
    changeArr.push(JSON.parse(storageChange.newValue));
  }
  [].forEach.call(linksList, (header) => {
    header.style.backgroundColor = changeArr[0].todos[0].text;
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const backgroundColor = request['background-color'] || '';
  const highlight = request.highlight || false;
  const sketchOn = request.sketchOn || false;
  const linksList = document.querySelectorAll('a');

  if (highlight) {
    toggleHighlight(true);
  }
  if (!highlight) {
    toggleHighlight(false);
  }
  if (sketchOn) {
    toggleSketch(true);
  }
  if (!sketchOn) {
    toggleSketch(false);
  }

  [].forEach.call(linksList, (header) => {
    header.style.backgroundColor = backgroundColor;
  });
  sendResponse({ backgroundColor, success: true });
  chrome.runtime.sendMessage({ greeting: 'hello' }, () => {
  });
});
