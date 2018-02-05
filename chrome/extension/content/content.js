let previousEl = null;
let selectedElement = '';

function selectedElementHandler(event) {
  const selectedEl = event.target;
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
    event.stopPropagation();
  }
  selectedEl.classList.remove('mouseHoverElement');
  const selectedClassName = selectedEl.className.split(' ')[0] || '';
  const selectedNode = selectedEl.nodeName || '';
  const cssSelector = selectedClassName ? (`${selectedNode}.${selectedClassName}`).toLowerCase() : selectedNode.toLowerCase();// make dry
  selectedElement = cssSelector;
  toggleHighlight(false);
  chrome.runtime.sendMessage({ cssSelector }, () => {
  });
}

function mouseOverHandler(event) {
  const selectedEl = event.target;
  const selectedClassName = selectedEl.className.split(' ')[0] || '';
  const selectedNode = selectedEl.nodeName;
  const cssSelector = selectedClassName ? (`${selectedNode}.${selectedClassName}`).toLowerCase() : selectedNode.toLowerCase();

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

// Move somewhere?
const isEquivalent = (a, b) => {
  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);
  const output = {};
  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i];
    if (a[propName] !== b[propName]) {
      output[propName] = b[propName];
    }
  }
  return output;
};

chrome.storage.onChanged.addListener((changes) => {

  // chrome.storage.local.clear(function () {
  //   const error = chrome.runtime.lastError;
  //   if (error) {
  //     console.error(error);
  //   }
  // });


  const changesArr = [];
  for (const key in changes) {
    const storageChange = changes[key];
    console.log(storageChange);
    if (storageChange.hasOwnProperty('newValue')) {
      changesArr.push(JSON.parse(storageChange.newValue));
    }
    if (storageChange.hasOwnProperty('oldValue')) {
      changesArr.push(JSON.parse(storageChange.oldValue));
    }
  }

  //if cssProperties is {}
  //use oldValue to retrieve all the nodes that got changed (document.querySelectorAll(selectedElement)),
  //then, for each element retrieved run something like document.getElementById("id").style.display = null (header.style.style = null;)

  const selectorHistory = changesArr[0].cssProperties[selectedElement] || [];

  const propertyObj = selectorHistory[selectorHistory.length - 1] || {};
  const elementList = document.querySelectorAll(selectedElement);

  if (selectorHistory.length > 1) {
    const previousPropertyObj = selectorHistory[selectorHistory.length - 2];
    const diffObj = isEquivalent(previousPropertyObj, propertyObj);

    for (const key in diffObj) {
      [].forEach.call(elementList, (header) => {
        header.style[key] = diffObj[key];
      });
    }
  }

  ////

  if (Object.keys(changesArr[0].cssProperties).length === 0){
    console.log('empty obj ', changesArr[0].cssProperties );
    const selectorOldHistory = changesArr[1].cssProperties[selectedElement] || [];

    Object.keys(changesArr[1].cssProperties).forEach(key => {
      const elementOldList = document.querySelectorAll(key);
        [].forEach.call(elementOldList, (header) => {
          console.log('header',header);
          header.style = null;
        });
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const highlight = request.highlight || false;
  if (highlight) {
    toggleHighlight(true);
  }
  if (!highlight) {
    toggleHighlight(false);
  }
});
