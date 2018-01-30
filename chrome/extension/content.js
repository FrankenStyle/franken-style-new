
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let data = request.data || {};
  let linksList = document.querySelectorAll('a');
  [].forEach.call(linksList, (header) => {
    header.style.backgroundColor = request.data;
  });
  sendResponse({ data, success: true });
  chrome.runtime.sendMessage({ greeting: 'hello' }, () => {
  });
});

let previousEl = null;

document.addEventListener('mouseover', (event) => {
  let selectedEl = event.target;
  let selectedClassName = selectedEl.className;
  let selectedNode = selectedEl.nodeName;
  let selectedClassList = selectedEl.classList;
  if (selectedEl.nodeName) {
    if (previousEl != null) {
      previousEl.classList.remove('mouseHoverElement');
    }
    selectedEl.classList.add('mouseHoverElement');
    previousEl = selectedEl;

    chrome.runtime.sendMessage({ selectedClassName, selectedNode, selectedClassList }, () => {
    });
  }
}, false);
