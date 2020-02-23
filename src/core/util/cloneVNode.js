function serializeClass(classes) {
  var classArray = [];
  if (Array.isArray(classes)) {
    for (var i = 0; i < classes.length; i++) {
      if (classes[i]) classArray.push(classes[i]);
    }
  } else if (typeof classes === 'object') {
    for (var name in classes) {
      if (classes[name]) classArray.push(classes[name]);
    }
  } else if (typeof classes === 'string') {
    classArray = [classes]
  }
  return classArray;
}

function cloneVNodeData(vnode) {
  var newData = {}
  var oldData = vnode.data || {};
  for (var name in oldData) {
    newData[name] = oldData[name];
  }
  return newData;
}

function mergeVNodeClass(vnode, classes) {
  classes = serializeClass(classes);

  var newClass;
  var oldClass = ((vnode || {}).data || {}).class || {};
  if (Array.isArray(oldClass)) {
    newClass = classes;
    for (var i = 0; i < oldClass.length; i++) {
      if (newClass.indexOf(oldClass[i]) < 0) {
        newClass.push(oldClass[i]);
      }
    }
  } else if (typeof oldClass === 'object') {
    newClass = {};
    for (var name in oldClass) {
      newClass[name] = oldClass[name];
    }
    for (var i = 0; i < classes.length; i++) {
      newClass[classes[i]] = true;
    }
  } else if (typeof oldClass === 'string') {
    newClass = classes.concat(oldClass);
  } else {
    newClass = classes;
  }

  return newClass;
}

function mergeVNodeStyle(vnode, style) {
  style = style || {};
  var newStyle = {};
  var oldStyle = ((vnode || {}).data || {}).style || {};
  for (var name in oldStyle) {
    newStyle[name] = oldStyle[name];
  }

  for (var i in style) {
    newStyle[i] = style[i];
  }

  return newStyle;
}

function mergeVNodeEvent(vnode, on) {
  on = on || {};

  var newOn = {};
  var oldOn = ((vnode || {}).data || {}).on || {};
  for (var name in oldOn) {
    newOn[name] = oldOn[name];
  }

  for (var eventName in on) {
    var eventHandle = on[eventName];
    var event = newOn[eventName];
    if (typeof event === 'undefined') {
      newOn[eventName] = eventHandle;
    } else if (typeof event === 'function' && !event.fns) {
      newOn[eventName] = [event, eventHandle];
    } else if (Array.isArray(event)) {
      newOn[eventName] = newOn[eventName].concat(eventHandle);
    }
  }

  return newOn;
}

function cloneVNode(vnode, data) {
  if (!vnode) return null;
  data = data || {};

  var VNode = vnode.constructor;
  var vnodeData = cloneVNodeData(vnode);
  vnodeData.style = mergeVNodeStyle(vnode, data.style);
  vnodeData.class = mergeVNodeClass(vnode, data.class);
  vnodeData.on = mergeVNodeEvent(vnode, data.on);

  var cloned = new VNode(
    vnode.tag,
    vnodeData, // vnode.data
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.isCloned = true;
  return cloned;
}

export default cloneVNode;

export function cloneVNodes(vnodes, data) {
  if (Array.isArray(vnodes)) {
    var newVNodes = [];
    for (var i = 0; i < vnodes.length; i++) {
      newVNodes.push(cloneVNode(vnodes[i], data));
    }
    return newVNodes;
  } else if (vnodes) {
    return cloneVNode(vnodes, data);
  } else {
    return null;
  }
}
