//factivacrx_content_script.js
// Do something on the Factiva webpage

//// BASED ON download_links

// Send back to the popup a sorted deduped list of valid link URLs on this page.
// The popup injects this script into all frames in the active tab.

//var links = [].slice.apply(document.getElementsByTagName('a'));
var tags = [].slice.apply(document.querySelectorAll('a.enHeadline'));
var links = tags.map(function(element) {
  // Return an anchor's href attribute, stripping any URL fragment (hash '#').
  // If the html specifies a relative path, chrome converts it to an absolute
  // URL.
  var href = element.href;
  var hashIndex = href.indexOf('#');
  if (hashIndex >= 0) {
    href = href.substr(0, hashIndex);
  }
  return href;
});

links.sort();

// Remove duplicates and invalid URLs.
var kBadPrefix = 'javascript';
for (var i = 0; i < links.length;) {
  if (((i > 0) && (links[i] == links[i - 1])) ||
      (links[i] == '') ||
      (kBadPrefix == links[i].toLowerCase().substr(0, kBadPrefix.length))) {
    links.splice(i, 1);
  } else {
    ++i;
  }
}

// Get the headings text
var headings = tags.map(function(element) {
  // Return the heading text
  return element.innerHTML;
});

//chrome.extension.sendRequest(links);
chrome.extension.sendRequest(headings);

// Styling the injections
var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = ".headlineInject { color: violet }";
document.body.appendChild(css);

// Click each headling link, calling the article to load in the sidebar.
for (var i = 0; i< tags.length; i++) {
  tags[i].click();
  // Do something with the article?
  // ...
  tags[i].outerHTML += "<div class='headlineInject' id='headlineInject"+i+"'><p>This article has been loaded by a Chrome Extension.</p></div>";
}
