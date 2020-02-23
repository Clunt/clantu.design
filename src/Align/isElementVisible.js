import { getWindowSize, getElementStyle } from '../core/util/dom';
import overlapRectangles from './overlapRectangles';


function getRelativeParentNode(node, parentNode) {
  if (!node) return null;
  parentNode = parentNode || node.parentNode;
  if (!parentNode || parentNode.nodeType === 9) return null;
  var nodePosition = getElementStyle(node, 'position');
  var parentNodePosition = getElementStyle(parentNode, 'position');
  if (nodePosition === 'fixed') return null;
  if (nodePosition === 'absolute' && parentNodePosition === 'static') return getRelativeParentNode(node, parentNode.parentNode);
  return parentNode;
}

function getParentNode(node) {
  while (node) {
    node = getRelativeParentNode(node);
    if (node && getElementStyle(node, 'overflow') !== 'visible') return node;
  }
  return null;
}

function isElementInPage(elm) {
  return (elm === document.body) ? false : document.body.contains(elm);
}

function isElementHidden(elm) {
  var visibility = getElementStyle(elm, 'visibility');
  var display = getElementStyle(elm, 'display');
  var opacity = parseInt(getElementStyle(elm, 'opacity'), 10);
  return display === 'none' || visibility === 'hidden' || opacity === 0;
}

export default function isElementVisible(elm) {
  if (!elm || !isElementInPage(elm)) return false;

  var node = elm;
  var windowSize = getWindowSize();
  var windowRect = [0, 0, windowSize[0], windowSize[1]];

  var currentViewRect;
  var viewRect;
  while (node) {
    if (node.nodeType === 9) break;
    if (isElementHidden(node)) return null;
    currentViewRect = node.getBoundingClientRect();
    viewRect = overlapRectangles([
      currentViewRect.top,
      currentViewRect.left,
      Math.floor(currentViewRect.width),
      Math.floor(currentViewRect.height)
    ], viewRect);
    if (!viewRect) return null;
    node = getParentNode(node);
  }

  return overlapRectangles(windowRect, viewRect);
}
