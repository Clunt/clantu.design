<style lang="scss" src="./index.scss"></style>
<script>
import Align from '../Align';
import Trigger from '../Trigger';


export default {
  name: 'CdDropdown',
  props: {
    // Trigger Props
    tag: {
      default: 'div'
    },
    append: {},
    rebuild: {},
    visible: {},
    defaultVisible: {},
    action: {
      default: 'click'
    },
    showAction: {},
    hideAction: {},
    overlayClick: {},
    mouseEnterDelay: {},
    mouseLeaveDelay: {},
    focusDelay: {},
    blurDelay: {},

    // TODO
    render: {},

    // Menu Props
    align: {},
    space: {},
    adjust: {},
    interval: {}
  },
  data: function() {
    return {
      el: null,
      hidden: !this.visible
    };
  },
  render: function(createElement) {
    var toggle = createElement('template', {
      slot: 'trigger'
    }, this.$slots.toggle || []);

    var target = createElement(Align, {
      props: {
        target: this.$el,
        align: this.align,
        space: this.space,
        adjust: this.adjust,
        hidden: this.hidden,
        interval: this.interval || (this.rebuild ? 0 : 30)
      },
      slot: 'target',
      ref: 'target'
    }, this.$slots.target || []);

    return createElement(Trigger, {
      class: 'cd-dropdown',
      props: {
        tag: this.tag,
        rebuild: this.rebuild,
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
    }, [toggle, target]);
  },
  mounted() {
    this.append && this.$refs.target && document.body.appendChild(this.el = this.$refs.target.$el);
  },
  updated() {
  },
  beforeDestroy() {
    this.el && this.el.parentNode === document.body && document.body.removeChild(this.el);
  },
  methods: {
    onVisible: function(visible) {
      this.hidden = !visible;
      this.$emit('visible', visible);
    }
  }
};
</script>
