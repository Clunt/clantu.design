<script>
import emitter from '../core/mixins/emitter';
import { findParent } from '../core/util/findVNode';

import {
  tab as TAB_SIGN,
  pane as PANE_SIGN
} from './sign';


export default {
  mixins: [emitter],
  name: 'CdTabPane',
  sign: PANE_SIGN,
  props: {
    nav: {},
    sign: {},
    disabled: Boolean,
    transition: {},
    render: {}
  },
  watch: {
    sign: function() {
      this.__dispatch(TAB_SIGN, 'paneChange', this);
    }
  },
  computed: {
    visiblePrev: function() {
      return findParent(this, TAB_SIGN).prev === this;
    },
    visibleNext: function() {
      return findParent(this, TAB_SIGN).next === this;
    },
    visible: function() {
      return this.visiblePrev || this.visibleNext || findParent(this, TAB_SIGN).current === this;
    }
  },
  created: function() {
    this.__dispatch(TAB_SIGN, 'paneAdd', this);
  },
  beforeDestroy: function() {
    this.__dispatch(TAB_SIGN, 'paneDel', this);
  },
  render: function(createElement) {
    var paneVNode = this.render || this.visible ? createElement('div', {
      class: [
        'cd-tab__pane__item',
        this.visiblePrev ? 'cd-tab__pane__item--prev' : '',
        this.visibleNext ? 'cd-tab__pane__item--next' : ''
      ],
      style: !this.visible ? {
        display: 'none'
      } : {}
    }, [ this.$slots.default ]) : null;
    return this.transition ? createElement('transition', [ paneVNode ]) : paneVNode;
  },
  methods: {
  }
};
</script>
