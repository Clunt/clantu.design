<script>
import emitter from '../core/mixins/emitter';
import { findVNodes, findParent } from '../core/util/findVNode';
import Dropdown from '../Dropdown';
import {
  menu as MENU_SIGN,
  item as ITEM_SIGN
} from './sign';


export default {
  name: 'CdMenuItem',
  sign: ITEM_SIGN,
  mixins: [emitter],
  props: {
    disabled: Boolean,
    sign: {}
  },
  data: function() {
    return {
      parent: findParent(this, MENU_SIGN),
      visible: false
    };
  },
  computed: {
    active: function() {
      return this.parent.item === this && this.visible;
    }
  },
  render: function(createElement) {
    var defaultVNodes = this.$slots.default;
    var menuVNodes = findVNodes(defaultVNodes, 'CdMenu');
    var disabled = this.disabled;
    if (menuVNodes && !disabled) {
      var textVNodes = [];
      for (var i = 0; i < defaultVNodes.length; i++) {
        if (menuVNodes.indexOf(defaultVNodes[i]) < 0) {
          textVNodes.push(defaultVNodes[i]);
        }
      }

      return createElement(Dropdown, {
        class: 'cd-menu__item cd-menu__submenu',
        props: {
          tag: 'li',
          align: 'rightTop',
          action: [],
          showAction: ['click', 'mouseEnter'],
          visible: this.active,
          overlayClick: this.overlayClick
        },
        on: {
          visible: this.onVisible
        },
      }, [
        createElement('div', {
          class: 'cd-menu__text',
          on: {
            click: this.textClick
          },
          slot: 'toggle'
        }, textVNodes),
        createElement('template', {
          slot: 'target',
        }, menuVNodes)
      ]);
    } else {
      return createElement('li', {
        class: ['cd-menu__item', disabled ? 'cd-menu__item--disabled' : ''],
        on: {
          click: this.itemClick,
          mouseenter: this.mouseenter
        }
      }, [createElement('div', {
        class: 'cd-menu__text'
      }, defaultVNodes)]);
    }
  },
  methods: {
    textClick: function(evt) {
      this.click(evt, true);
    },
    itemClick: function(evt) {
      if (this.disabled) {
        evt.stopPropagation();
      } else {
        this.__dispatch(MENU_SIGN, 'visible', false);
      }
      this.click(evt, false);
    },
    click: function(evt, submenu) {
      this.__dispatch(MENU_SIGN, 'itemClick', evt, this.sign, [this.sign], submenu, this.disabled);
      this.$emit('click', evt, this.sign, [this.sign], submenu, this.disabled);
    },
    mouseenter: function() {
      this.__dispatch(MENU_SIGN, 'active', this);
    },
    overlayClick: function(evt) {
      return true;
    },
    onVisible: function(visible) {
      if (visible) {
        this.__dispatch(MENU_SIGN, 'active', this);
      }
      this.visible = visible;
    }
  },
  events: {
    itemClick: function(evt, sign, path, submenu, disabled) {
      path.unshift(this.sign);
      this.__dispatch(MENU_SIGN, 'itemClick', evt, sign, path, submenu, disabled);
    },
    visible: function(visible) {
      this.visible = visible;
      this.__dispatch(MENU_SIGN, 'visible', false);
    }
  }
};
</script>
