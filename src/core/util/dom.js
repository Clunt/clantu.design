export const getElementStyle = document.defaultView && document.defaultView.getComputedStyle ? function(element, attr) {
  var style = document.defaultView.getComputedStyle(element, null);
  return style ? style[attr] : undefined;
} : function(element, attr) {
  var value = element.style[attr];
  if (!value && element.currentStyle) {
    value = element.currentStyle[attr];
  }
  return value;
};

export const emptySelection = window.getSelection ? function() {
  window.getSelection().removeAllRanges();
} : function() {
  document.selection.empty();
};

export const devicePixelRatio = Math.round(window.devicePixelRatio || 1);

export function getWindowSize() {
  var documentElement = window.document.documentElement;
  return  [documentElement.clientWidth, documentElement.clientHeight];
}