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

function hasArticleLoaded() {
  if (document.querySelector('#artHdr1 span')) return true;
  else return false;
}

// Click each headling link, calling the article to load in the sidebar.
function loadArticles(tag, i) {
  // Do something with the article?
  // Get all the highlighted terms (bold elements)
  var highlights = [].slice.apply(document.querySelectorAll('.articleParagraph b'));
  
  //var highlights = document.querySelectorAll('.articleParagraph b');
  console.log('Headline ' + (i+1) + ', highlights = ' + highlights.length);
  var boldWords = []
  if (highlights.length > 0 ) {
    boldWords = highlights.map(function(element) {
      // Return an anchor text
      return element.innerHTML;
    });
  } else {
    boldWords = ["NO ARTICLE HIGHLIGHTS FOUND"];
  }
  // Show just the bold words
  var injectionText = "<div class='headlineInject' id='headlineInject"+i+"'><p>This article has been loaded by a Chrome Extension.</p>";
  for (var j = 0; j< boldWords.length; j++) {
    injectionText += "<p><strong>" + boldWords[j] + "</strong></p>";
  }
  
  // // Find anything else? TEST
  // var aboveArticleTop = [].slice.apply(document.querySelectorAll('#articleFrame'));
  // if (aboveArticleTop.length > 0) {
    // injectionText += "<p>TEST: FOUND #articleFrame</p>";
    // aboveArticle2Divs = aboveArticleTop[0].childNodes;
    // //injectionText += "<p>TEST: IT HAS " + aboveArticle2Divs.length + " childNodes</p>";
    // if (aboveArticle2Divs.length > 1) {  
      // l3 = aboveArticle2Divs[1].childNodes;
      // //injectionText += "<p>TEST: THAT HAS " + l3.length + " childNodes</p>";
      // console.log (l3[0]);
    // } else { console.log('no L3 child nodes'); }
  // }
  // var aboveArticleSpans = [].slice.apply(document.querySelectorAll('#artHdr1 span'));
  // if (aboveArticleSpans.length > 0) {
    // injectionText += "<p>TEST: " + aboveArticleSpans[0].innerHTML + "</p>";
  // } //OR
  if (document.querySelector('#artHdr1 span')) {
    injectionText += "<p>TEST: ARTICLE LOADED</p>";
  } else {
    injectionText += "<p>TEST: ARTICLE NOT LOADED</p>";
  }
  
  // Alternative Test if the content has loaded
  //if (document.querySelector('#articleFrame div:nth-child(2) .article')) {}
  
  injectionText += "</div>";
  // Finish
  tag.outerHTML += injectionText;
}


// Click each headling link, calling the article to load in the sidebar.
for (var i = 0; i< tags.length; i++) {
  //var delaySecs = 10;
  //var delay = delaySecs * 1000;
  console.log('Start ' + (i+1));
  //var a = performance.now();
//  tags[i].click();
  //var b = performance.now();
  //console.log('Mid ' + (i+1) + ', after ' + (b-a));
  // Can't do below, async! This loop moves on before the function finishes.
  //window.setTimeout(function() { loadArticles(tags[i], i); }, delay);
//  loadArticles(tags[i], i);
  //var c = performance.now();
  //console.log('End ' + (i+1) + ', after ' + (c-b));
  
  // Wish I could use JQuery to force loadArticles to happen after tags click
  // (It's in the session, just can't access it from here)
  //$.when(tags[i].click()).then(loadArticles(tags[i], i));
  
  // Make function2 happen after function1
  function1(tags[i], function() {
    function2(tags[i], i);
  });
}
function function1(tag, callback) {
  tag.click();
  callback();
} 
function function2(tag, i) {
  //DOES NOT WORK!
  // var attemptsRemaining = 5;
  // console.log('Has article loaded for '+ (i+1) + '? ' + hasArticleLoaded())
  // while (hasArticleLoaded() == false && attemptsRemaining >0){
    // setTimeout( function() { console.log('Pause for ' + (i+1) + ', remaining ' + attemptsRemaining) }, 2000);
    // attemptsRemaining--;
  // }
  // console.log('Load articles regardless for ' + (i+1));
  loadArticles(tag, i);
}
