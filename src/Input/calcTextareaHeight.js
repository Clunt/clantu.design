var hiddenTextarea;

var HIDDEN_STYLE = 'height:0 !important;visibility:hidden !important;overflow:hidden !important;position:absolute !important;z-index:-1000 !important;top:0 !important;right:0 !important';

var CONTEXT_STYLE = [
  'letter-spacing',
  'line-height',
  'padding-top',
  'padding-bottom',
  'font-family',
  'font-weight',
  'font-size',
  'text-rendering',
  'text-transform',
  'width',
  'text-indent',
  'padding-left',
  'padding-right',
  'border-width',
  'box-sizing'
];

function calculateNodeStyling(node) {
  var style = window.getComputedStyle(node);

  var boxSizing = style.getPropertyValue('box-sizing');

  var paddingSize = (
    parseFloat(style.getPropertyValue('padding-bottom')) +
    parseFloat(style.getPropertyValue('padding-top'))
  );

  var borderSize = (
    parseFloat(style.getPropertyValue('border-bottom-width')) +
    parseFloat(style.getPropertyValue('border-top-width'))
  );

  var contextStyleArr = [];
  for (var i = 0; i < CONTEXT_STYLE.length; i++) {
    contextStyleArr.push(CONTEXT_STYLE[i] + ':' + style.getPropertyValue(CONTEXT_STYLE[i]));
  }
  var contextStyle = contextStyleArr.join(';');

  return {
    contextStyle: contextStyle,
    paddingSize: paddingSize,
    borderSize: borderSize,
    boxSizing: boxSizing
  };
}

export default function calcTextareaHeight(targetNode, minRows, maxRows) {
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement('textarea');
    document.body.appendChild(hiddenTextarea);
  }

  var nodeStyling = calculateNodeStyling(targetNode);
  var paddingSize = nodeStyling.paddingSize;
  var borderSize = nodeStyling.borderSize;
  var boxSizing = nodeStyling.boxSizing;
  var contextStyle = nodeStyling.contextStyle;

  hiddenTextarea.setAttribute('style', contextStyle + ';' + HIDDEN_STYLE);
  hiddenTextarea.value = targetNode.value || targetNode.placeholder || '';

  var height = hiddenTextarea.scrollHeight;

  if (boxSizing === 'border-box') {
    height = height + borderSize;
  } else if (boxSizing === 'content-box') {
    height = height - paddingSize;
  }

  hiddenTextarea.value = '';
  var singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;

  if (minRows) {
    var minHeight = singleRowHeight * minRows;
    if (boxSizing === 'border-box') {
      minHeight = minHeight + paddingSize + borderSize;
    }
    height = Math.max(minHeight, height);
  }
  if (maxRows) {
    var maxHeight = singleRowHeight * maxRows;
    if (boxSizing === 'border-box') {
      maxHeight = maxHeight + paddingSize + borderSize;
    }
    height = Math.min(maxHeight, height);
  }

  return { height: height + 'px'};
}
