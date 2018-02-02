let previousEl = null;
let p5Instance = null;
let selectedElement = '';

function selectedElementHandler(event) {
  const selectedEl = event.target;
  selectedEl.classList.remove('mouseHoverElement');
  const selectedClassName = selectedEl.className.split(' ')[0] || '';
  const selectedNode = selectedEl.nodeName || '';
  const cssSelector = selectedClassName ? (selectedNode + '.' + selectedClassName).toLowerCase() : selectedNode.toLowerCase();// make dry
  selectedElement = cssSelector;
  toggleHighlight(false);
  chrome.runtime.sendMessage({ cssSelector }, () => {
  });
}

function mouseOverHandler(event) {
  const selectedEl = event.target;
  const selectedClassName = selectedEl.className.split(' ')[0]||'';
  const selectedNode = selectedEl.nodeName;
  const cssSelector = selectedClassName ? (selectedNode + '.' + selectedClassName).toLowerCase() : selectedNode.toLowerCase()

  if (selectedEl.nodeName) {
    if (previousEl != null) {
      previousEl.classList.remove('mouseHoverElement');
    }
    selectedEl.classList.add('mouseHoverElement');
    previousEl = selectedEl;

    chrome.runtime.sendMessage({ cssSelector }, () => {
    });
  }
}

function toggleHighlight(turnOn) {
  if (turnOn) {
    document.addEventListener('mouseover', mouseOverHandler, false);
    document.addEventListener('click', selectedElementHandler, false);
  } else {
    document.removeEventListener('mouseover', mouseOverHandler, false);
    document.removeEventListener('click', selectedElementHandler, false);
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
  const changeArr = [];
  for (const key in changes) {
    const storageChange = changes[key];
    changeArr.push(JSON.parse(storageChange.newValue));
  }
  
  let propertyObj = changeArr[0].cssProperties[selectedElement][changeArr[0].cssProperties[selectedElement].length - 1];
  const elementList = document.querySelectorAll(selectedElement);

  [].forEach.call(elementList, (header) => {
    header.style['background-color'] = propertyObj['background-color'];
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const highlight = request.highlight || false;
  const sketchOn = request.sketchOn || false;

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
});
