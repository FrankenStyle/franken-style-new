
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  var data = request.data || {};
  console.log(request.data);
  var linksList = document.querySelectorAll('a');
  [].forEach.call(linksList, function (header) {
    header.style.backgroundColor = request.data;
  });
  sendResponse({ data: data, success: true });
  chrome.runtime.sendMessage({ greeting: 'hello' }, () => {
  })

});

var previousEl = null;

document.addEventListener("mouseover", function (event) {
  var selectedEl = event.target;
  var selectedClassName = selectedEl.className;
  var selectedNode = selectedEl.nodeName;
  var selectedClassList = selectedEl.classList;
  if (selectedEl.nodeName) {
    if (previousEl != null) {
      previousEl.classList.remove("mouseHoverElement");
    }
    selectedEl.classList.add("mouseHoverElement");
    previousEl = selectedEl;

    chrome.runtime.sendMessage({ selectedClassName, selectedNode, selectedClassList }, () => {
    })
  }
}, false);
