<style lang="scss" src="./index.scss"></style>
<script>
import { getIndex, event as Event } from '../core/util';


export default {
  name: 'CdLayer',
  props: {
    hint: Boolean,
    push: Boolean,
    menu: Boolean,
    mask: Boolean,
    visible: Boolean,
    escape: Boolean,
    middle: {
      type: Boolean,
      default: true
    },
    render: Boolean
  },
  data: function() {
    return {
      preClick: null,
      hintShow: false,
      zIndex: getIndex(),
      docEventsKeydown: null
    };
  },
  watch: {
    visible: function(visible) {
      this.docEventsKeydown && this.docEventsKeydown.remove && this.docEventsKeydown.remove();
      if (!visible) return
      this.zIndex = getIndex();
      this.bindEscape();
    }
  },
  render: function(createElement) {
    return createElement('transition', {
      on: {
        beforeEnter: this.onBeforeEnter,
        enter: this.onEnter,
        afterEnter: this.onAfterEnter,
        enterCancelled: this.onEnterCancelled,
        beforeLeave: this.onBeforeLeave,
        leave: this.onLeave,
        afterLeave: this.onAfterLeave,
        leaveCancelled: this.onLeaveCancelled
      }
    }, [
      this.render || this.visible ? createElement('div', {
        class: [
          'cd-layer',
          this.push ? 'cd-layer--push' : '',
          this.menu ? 'cd-layer--menu' : '',
          this.middle ? 'cd-layer--middle' : '',
          this.hintShow ? 'cd-layer--hint' : ''
        ],
        style: this.visible ? {
          zIndex: this.zIndex
        } : {
          zIndex: this.zIndex,
          display: 'none'
        },
        ref: 'layer'
      }, [
        createElement('div', {
          class: 'cd-layer__close',
          on: {
            click: this.close
          }
        }),
        createElement('div', {
          class: 'cd-layer__penetrate'
        }),
        createElement('div', {
          class: 'cd-layer__mask'
        }),
        createElement('div', {
          class: 'cd-layer__container',
          on: {
            mousedown: this.onPreClick,
            touchstart: this.onPreClick,
            touchend: this.click,
            mouseup: this.click
          }
        }, [
          createElement('div', {
            class: 'cd-layer__main',
            on: {
              click: this.onMainClick
            }
          }, [ this.$slots.default ])
        ]),
        this.$slots.additions
      ]) : null
    ]);
  },
  mounted: function() {
    this.bindEscape();
  },
  beforeDestroy: function() {
    this.unbindEscape();
  },
  methods: {
    bindEscape: function() {
      if (!this.escape) return;
      this.unbindEscape();
      this.docEventsKeydown = Event.bindEvent(document, 'keydown', function(event) {
        if (!this.escape) return;
        if(/^(input|textarea)$/.test(event.target.tagName.toLowerCase())) return;
        event.keyCode === 27 && this.$emit('close', 'escape', event);
      }.bind(this));
    },
    unbindEscape: function() {
      this.docEventsKeydown && this.docEventsKeydown.remove && this.docEventsKeydown.remove();
    },
    close: function(event) {
      this.$emit('close', 'click', event);
    },
    onPreClick: function(event) {
      this.preClick = event.target === event.currentTarget;
    },
    click: function(event) {
      if (!this.preClick || event.target !== event.currentTarget) return null;
      if (this.mask) {
        return this.$emit('close', 'mask', event);
      }
      this.$emit('click', event);
      if (this.hint) {
        this.hintShow = true;
        setTimeout(function() {
          this.hintShow = false;
        }.bind(this), 200);
      }
    },
    onMainClick: function(event) {
      this.$emit('mclick', event);
    },
    onBeforeEnter: function() {
      this.$emit('beforeEnter');
    },
    onEnter: function() {
      this.$emit('enter');
    },
    onAfterEnter: function() {
      this.$emit('afterEnter');
    },
    onEnterCancelled: function() {
      this.$emit('enterCancelled');
    },
    onBeforeLeave: function() {
      this.$emit('beforeLeave');
    },
    onLeave: function() {
      this.$emit('leave');
    },
    onAfterLeave: function() {
      this.$emit('afterLeave');
    },
    onLeaveCancelled: function() {
      this.$emit('leaveCancelled');
    }
  }
};
</script>
