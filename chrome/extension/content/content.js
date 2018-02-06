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
  const clicked = true;
  chrome.runtime.sendMessage({ cssSelector, clicked }, () => {
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
  const changesArr = [];
  for (const key in changes) {
    const storageChange = changes[key];
    if (storageChange.hasOwnProperty('newValue')) {
      changesArr.push(JSON.parse(storageChange.newValue));
    }
    if (storageChange.hasOwnProperty('oldValue')) {
      changesArr.push(JSON.parse(storageChange.oldValue));
    }
  }

  let newCSS = '';
  const storeObj = changesArr[0];
  const cssProperties = storeObj.cssProperties;
  for (const tagNames in cssProperties) {
    const propertiesArrayLength = cssProperties[tagNames].length - 1;
    const propertyHistory = cssProperties[tagNames];
    const cssStyle = propertyHistory[propertiesArrayLength];

    newCSS += (`${tagNames + JSON.stringify(cssStyle)}\n`);
  }
  newCSS = newCSS.replace(/['"]+/g, '')
    .replace(/[,]+/g, '!important;')
    .replace(/[}]+/g, '!important;}');//replaces quotes from JSON.stringify and format for css

  function cssEngine(rule) {
    const css = document.createElement('style'); // Creates <style></style>
    css.type = 'text/css'; // Specifies the type
    css.className = 'franken';
    if (css.styleSheet) css.styleSheet.cssText = rule; // Support for IE
    else css.appendChild(document.createTextNode(rule)); // Support for the rest
    document.getElementsByTagName('head')[0].appendChild(css); // Specifies where to place the css
  }

  function removeCSS() {
    const stylesheets = document.querySelectorAll('style.franken');
    console.log(stylesheets);
    stylesheets.forEach((child) => {
      document.getElementsByTagName('head')[0].removeChild(child);
    });
  }

  cssEngine(newCSS);

  if (Object.keys(cssProperties).length === 0) {
    removeCSS();
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
