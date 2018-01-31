let previousEl = null;

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
  const linksList = document.querySelectorAll('a');

  if (highlight) {
    toggleHighlight(true);
  } else if (!highlight) {
    toggleHighlight(false);
  }

  [].forEach.call(linksList, (header) => {
    header.style.backgroundColor = backgroundColor;
  });
  sendResponse({ backgroundColor, success: true });
  chrome.runtime.sendMessage({ greeting: 'hello' }, () => {
  });
});

