'use strict';

var FixedHeader = (function FixedHeader() {

  var selector;
  var view;
  var fixedContainer;
  var currentlyFixed;
  var previousOffset = 0;

  var init = function init(scrollView, container, select) {
    selector = select;
    view = document.querySelector(scrollView);
    fixedContainer = document.querySelector(container);
    view.addEventListener('scroll', scrolling);
  };

  var scrolling = function scrolling() {
    var headings = document.querySelectorAll(selector);
    var currentScroll = view.scrollTop;
    for (var i = headings.length - 1; i >= 0; i--) {
      var currentHeader = headings[i];
      var headingPosition = currentHeader.offsetTop;
      var offset = currentScroll - headingPosition;
      var currentHeight = currentHeader.offsetHeight;
      var differentHeaders = currentlyFixed != currentHeader;
      if(Math.abs(offset) < currentHeight && differentHeaders) {
        var toMove = Math.abs(offset) - currentHeight;
        if(Math.abs(toMove) > currentHeight) {
          fixedContainer.style.transform = null;
        } else {
          fixedContainer.style.transform = 'translateY(' + toMove + 'px)';
        }
      }
      if (offset > 0) {
        if (differentHeaders) {
          var comingFromUp = previousOffset < offset;
          var translateTop = 'translateY(' + -currentHeight + 'px)';
          var transform = comingFromUp ? translateTop : null;
          fixedContainer.style.transform = transform;
          previousOffset = offset;
          currentlyFixed = currentHeader;
          fixedContainer.style.display = 'block';
          var background = '-moz-element(#' + currentHeader.id + ')';
          fixedContainer.style.backgroundImage = background;
        }
        return;
      }
    }
    currentlyFixed = null;
    fixedContainer.style.display = 'none';
  };

  var stop = function stop() {
    view.removeEventListener('scroll', scrolling);
  };

  return {
    'init': init,
    'stop': stop
  };
})();
