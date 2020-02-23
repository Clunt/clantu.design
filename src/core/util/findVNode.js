export function findVNodes(vnodes, vnodeName) {
  if (typeof vnodeName !== 'string' || typeof vnodes !== 'object' || !vnodes) return null;
  vnodes = Array.isArray(vnodes) ? vnodes : [vnodes];
  var result = [];
  for (var i = 0; i < vnodes.length; i++) {
    var vnode = vnodes[i];
    var componentOptions = vnode.componentOptions || {};
    var Ctor = componentOptions.Ctor || {};
    var options = Ctor.options || {};
    if (vnodeName === options.name) {
      result.push(vnode)
    }
  }
  return result.length > 0 ? result : null;
}

export function findParent(vm, componentSign) {
  var parent = vm.$parent || vm.$root;
  var sign = parent.$options.sign;
  while (parent && (!sign || sign !== componentSign)) {
    parent = parent.$parent;
    if (parent) {
      sign = parent.$options.sign;
    }
  }
  return parent;
}

export function findChildren(componentSign) {
}
