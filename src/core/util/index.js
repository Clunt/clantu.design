export * as dom from './dom';
export * as event from './event';
export * as validator from './validator';
export * as support from './support';
export * as random from './random';
export { default as align } from './align';
export { default as dynamics } from './dynamics';


export function noop() {};

var Z_INDEX = 999999;
export function getIndex() {
  return Z_INDEX++;
}

export function nextTick(callback) {
  return setTimeout(callback, 16);
}

export function cancelTick(id) {
  clearTimeout(id);
}

// TODO obj.key = obj deep clone 死循环
export function extend() {
  var args = Array.prototype.slice.call(arguments);
  var deep = false;
  var index = 1;
  var result = args[0];
  if (typeof args[0] === 'boolean') {
    deep = args[0];
    index = 2;
    result = args[1];
  }
  if (typeof result !== 'object') return result;
  for (var i = index; i < args.length; i++) {
    var arg = args[i];
    if (typeof arg !== 'object') continue;
    for (var key in arg) {
      if (typeof result[key] === 'object' && typeof arg[key] === 'object' && deep) {
        result[key] = extend(true, Array.isArray(result[key]) ? [] : {}, result[key], arg[key]);
      } else {
        result[key] = arg[key];
      }
    }
  }
  return result;
}

export function copy(obj) {
  try {
    return JSON.parse(JSON.stringify(obj || {}));
  } catch (e) {}
}

export function diff(obj1, obj2) {
  for (var key1 in obj1) {
    if (obj1[key1] !== obj2[key1]) return true;
  }
  for (var key2 in obj2) {
    if (obj1[key2] !== obj2[key2]) return true;
  }
  return false;
}

export function throttle(fn, delay) {
  var id = null;
  var delay = delay || 500;
  return function() {
    var ctx = this,
      args = arguments;
    clearTimeout(id);
    id = setTimeout(function() {
      fn.apply(ctx, args);
    }, delay);
  }
}
