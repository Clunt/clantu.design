export { default as normalizeWheel } from './events/normalizeWheel';


function removeEvent(elem, eventName, eventHandle, useCapture) {
  if (elem.removeEventListener) {
    elem.removeEventListener(eventName, eventHandle, typeof useCapture === 'undefined' ? false : useCapture);
  }
}

function bindEvent(elem, eventName, eventHandle, useCapture) {
  elem.addEventListener(eventName, eventHandle, typeof useCapture === 'undefined' ? false : useCapture);
  return {
    remove: function() {
      removeEvent(elem, eventName, eventHandle, useCapture);
      return null;
    }
  }
}

export {
  bindEvent,
  removeEvent
};
