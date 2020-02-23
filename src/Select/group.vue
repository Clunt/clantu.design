<script>
import emitter from '../core/mixins/emitter';
import { findParent } from '../core/util/findVNode';

import {
  select as SELECT_SIGN,
  group as GROUP_SIGN
} from './sign';


export default {
  name: 'CdSelectGroup',
  sign: GROUP_SIGN,
  mixins: [emitter],
  props: {
    label: {}
  },
  computed: {
    selected: function() {
      var $parent = findParent(this, SELECT_SIGN) || {};
      return $parent.selectedOption === this;
    }
  },
  render: function(createElement) {
    return createElement('div', {
      class: 'cd-select__group'
    }, [
      createElement('div', {
        class: 'cd-select__group__label',
        on: {
          click: function() {
            return event.stopPropagation();
          }
        }
      }, this.label),
      createElement('div', {
        class: 'cd-select__group__children'
      }, [this.$slots.default])
    ]);
  },
  mounted: function() {
    this.__dispatch(SELECT_SIGN, 'add', this);
  },
  beforeDestroy: function() {
    this.__dispatch(SELECT_SIGN, 'del', this);
  },
  methods: {
    select: function(event) {
      if (this.disabled) return event.stopPropagation();
      this.__dispatch(SELECT_SIGN, 'change', this);
    }
  }
};
</script>
