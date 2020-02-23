<style lang="scss" src="./menu.scss"></style>
<script>
import emitter from '../core/mixins/emitter';
import {
  menu as MENU_SIGN,
  item as ITEM_SIGN
} from './sign';

var ALL_SIZE = ['default', 'small', 'large'];


export default {
  name: 'CdMenu',
  sign: MENU_SIGN,
  props: {
    size: {
      default: 'default',
      validator: function(size) {
        return ALL_SIZE.indexOf(size) > -1;
      }
    }
  },
  mixins: [emitter],
  data: function() {
    return {
      item: null
    };
  },
  render: function(createElement) {
    return createElement('ul', {
      class: 'cd-menu cd-menu--' + this.size
    }, this.$slots.default);
  },
  methods: {
  },
  events: {
    itemClick: function(evt, sign, path, submenu, disabled) {
      this.$emit('click', evt, sign, path, submenu, disabled);
      this.__dispatch(ITEM_SIGN, 'itemClick', evt, sign, path, submenu, disabled);
    },
    active: function(item) {
      this.item = item;
    },
    visible: function(visible) {
      this.__dispatch(ITEM_SIGN, 'visible', visible);
    }
  }
};
</script>
