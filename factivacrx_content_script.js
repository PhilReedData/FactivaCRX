//factivacrx_content_script.js
// Do something on the Factiva webpage

// The background page is asking us to find an address on the page.
if (window == top) {
  chrome.extension.onRequest.addListener(function(req, sender, sendResponse) {
    sendResponse(findAddress());
  });
}


// Do something on this page, return the something found.
// Return null if none is found.
var findAddress = function() {

  return null;
}
