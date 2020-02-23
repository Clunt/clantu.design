import './index.scss'
import Vue from 'vue';
import { bindEvent } from '../../core/util/event';
import Align from '../../Align';
import { Menu, MenuItem, MenuLine } from '../../Menu';


function Contextmenu() {
  this.component = null;
  this.callback = {};
  this.init();
}

Contextmenu.prototype.init = function() {
  var contextmenu = this;
  var contextmenuElement = document.createElement('div');
  document.body.appendChild(contextmenuElement);

  this.component = new Vue({
    el: contextmenuElement,
    data: function() {
      return {
        x: 0,
        y: 0,
        menu: [],
        visible: false,
        documentClickEvents: {}
      };
    },
    render: function(createElement) {
      var createTextVNode = this._v;

      function genItem(item) {
        if (!item) return createElement(MenuLine);
        var children = [createTextVNode(item.name)];
        if (item.menu && item.menu.length > 0) {
          children.push(createElement(Menu, {
            props: {
              size: 'small'
            }
          }, genItems(item.menu)));
        }
        return createElement(MenuItem, {
          props: {
            sign: item.sign,
            disabled: item.disabled
          }
        }, children);
      }

      function genItems(menu) {
        var items = [];
        for (var i = 0; i < menu.length; i++) {
          items.push(genItem(menu[i]));
        }
        return items;
      }

      return createElement(Align, {
        class: 'cd-contextmenu',
        style: {
          display: this.visible ? '' : 'none'
        },
        props: {
          target: [this.y, this.x, 3, 1],
          align: 'rightTop'
        },
        nativeOn: {
          contextmenu: this.onContextmenu
        },
        ref: 'align'
      }, [
        createElement(Menu, {
          props: {
            size: 'small'
          },
          on: {
            click: this.menuClick
          }
        }, genItems(this.menu))
      ]);
    },
    mounted: function() {
      this.toggleDocumentEvent(true);
    },
    beforeDestroy: function() {
      this.toggleDocumentEvent();
    },
    methods: {
      menuClick: function(evt, sign, path, submenu, disabled) {
        var callback = contextmenu.callback;
        var hold = typeof callback === 'function' ? callback(evt, sign, path, submenu, disabled) : undefined;
        if (hold === false || (!submenu && !disabled && !hold)) this.close();
      },
      open: function(x, y, menu) {
        this.x = x;
        this.y = y;
        this.menu = menu;
        this.visible = true;
        this.$refs.align.update();
        this.toggleDocumentEvent(true);
      },
      close: function() {
        this.visible = false;
        this.toggleDocumentEvent(false);
      },
      toggleDocumentEvent: function(open) {
        var events = this.documentClickEvents;
        if (open) {
          events.mousedown = events.mousedown || bindEvent(document, 'mousedown', this.documentClick);
          events.touchstart = events.touchstart || bindEvent(document, 'touchstart', this.documentClick);
        } else {
          events.mousedown && (events.mousedown = events.mousedown.remove());
          events.touchstart && (events.touchstart = events.touchstart.remove());
        }
      },
      documentClick: function(evt) {
        if (!this.$el.contains(evt.target)) {
          this.close();
        }
      },
      onContextmenu: function(evt) {
        evt.preventDefault();
      }
    }
  });
};

Contextmenu.prototype.get = function() {
  if (!this.component) this.init();
  return this.component;
};

Contextmenu.prototype.open = function(evt, option) {
  var component = this.get();
  var option = option || {};
  var menu = option.menu || [];
  this.callback = option.callback;

  component.open(evt.clientX, evt.clientY, menu);
  if (typeof option.open === 'function') {
    option.open();
  }
};

var contextmenu = new Contextmenu();


export default {
  name: 'contextmenu',
  _contextmenu: contextmenu,
  update: function(el, binding) {
    if (!el._contextmenu) return;
    if (el._contextmenu._value === binding.value) return;
    el._contextmenu._value = binding.value;
  },
  bind: function(el, binding, vnode) {
    el._contextmenu = bindEvent(el, 'contextmenu', function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      var value = el._contextmenu._value;
      if (value) {
        contextmenu.open(evt, value);
      }
      return false;
    });
    el._contextmenu._value = binding.value;
  },
  unbind: function(el) {
    if (el._contextmenu && el._contextmenu.remove) {
      el._contextmenu = el._contextmenu.remove();
    }
  }
};
