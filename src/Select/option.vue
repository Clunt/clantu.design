<script>
import emitter from '../core/mixins/emitter';
import { findParent } from '../core/util/findVNode';

import {
  select as SELECT_SIGN,
  option as OPTION_SIGN
} from './sign';


export default {
  name: 'CdSelectOption',
  sign: OPTION_SIGN,
  mixins: [emitter],
  props: {
    disabled: Boolean,
    selection: String,
    value: {}
  },
  data: function() {
    return {
    };
  },
  computed: {
    selected: function() {
      var $parent = findParent(this, SELECT_SIGN) || {};
      return $parent.selectedOption === this;
    }
  },
  render: function(createElement) {
    return createElement('div', {
      class: ['cd-select__option', this.selected ? 'cd-select__option--selected' : '', this.disabled ? 'cd-select__option--disabled' : ''],
      on: {
        click: this.select
      }
    }, [this.$slots.default]);
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
