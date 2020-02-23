import { findParent } from '../util/findVNode';


export default {
  methods: {
    __emit: function(component, eventName) {
      eventName = eventName || 'default';
      if (component && component.$options.events && typeof component.$options.events[eventName] === 'function') {
        component.$options.events[eventName].apply(component, Array.prototype.slice.call(arguments).slice(2));
      }
    },
    __dispatch: function(componentSign, eventName) {
      eventName = eventName || 'default';
      var parent = findParent(this, componentSign);
      if (parent && parent.$options.events && typeof parent.$options.events[eventName] === 'function') {
        parent.$options.events[eventName].apply(parent, Array.prototype.slice.call(arguments).slice(2));
      }
    }
  }
};
