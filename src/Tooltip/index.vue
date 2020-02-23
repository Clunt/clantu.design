<style lang="scss" src="./index.scss"></style>
<script>
import Align from '../Align';
import Trigger from '../Trigger';


export default {
  name: 'CdTooltip',
  props: {
    arrow: {
      type: Boolean,
      default: true
    },
    // Trigger Props
    tag: {
      default: 'div'
    },
    visible: {},
    tag: {},
    visible: {},
    size: {
      default: 'default'
    },
    defaultVisible: {},
    action: {
      default: 'hover'
    },
    showAction: {},
    hideAction: {},
    overlayClick: {},
    mouseEnterDelay: {},
    mouseLeaveDelay: {},
    focusDelay: {},
    blurDelay: {},
    // Menu Props
    align: {},
    adjust: {},
    hidden: {},
    interval: {},
    rebuild: {},
  },
  render: function(createElement) {
    var toggle = createElement('template', {
      slot: 'trigger'
    }, [this.$slots.default]);

    var menu = createElement(Align, {
      class: [
        'cd-tooltip__popup',
        this.arrow ? 'cd-tooltip__popup--arrow' : '',
      ],
      props: {
        target: this.$el,
        align: this.align,
        adjust: this.adjust,
        hidden: this.hidden,
        interval: this.interval || (this.rebuild ? 0 : 30)
      },
      slot: 'target',
      ref: 'menu'
    }, [createElement('div', {
      class: 'cd-tooltip__box'
    }, [this.$slots.tooltip]), this.arrow ? createElement('span', {
      class: 'cd-tooltip__arrow'
    }) : null]);

    return createElement(Trigger, {
      class: [
        'cd-tooltip',
        'cd-tooltip--size-' + this.size,
      ],
      props: {
        tag: this.tag,
        visible: this.visible,
        tag: this.tag,
        visible: this.visible,
        overlayClick: this.overlayClick,
        defaultVisible: this.defaultVisible,
        action: this.action,
        showAction: this.showAction,
        hideAction: this.hideAction,
        mouseEnterDelay: this.mouseEnterDelay,
        mouseLeaveDelay: this.mouseLeaveDelay,
        focusDelay: this.focusDelay,
        blurDelay: this.blurDelay
      },
      on: {
        visible: this.onVisible
      }
    }, [toggle, menu]);
  },
  methods: {
    onVisible: function(visible) {
      this.$emit('visible', visible);
    }
  }
};
</script>
