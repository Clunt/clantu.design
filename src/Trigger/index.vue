<script>
import { cloneVNodes } from '../core/util/cloneVNode';
import { bindEvent } from '../core/util/event';
import { touch as isSupportTouch } from '../core/util/support';

// trigger target 应该被移动至body末尾
var ALL_HANDLERS = [
  'click',
  'hover',
  'mouseDown',
  'touchStart',
  'mouseEnter',
  'mouseLeave',
  'triggerEnter',
  'triggerLeave',
  'targetEnter',
  'targetLeave',
  'focus',
  'blur'
];

export default {
  name: 'CdTrigger',
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    rebuild: {
      default: true,
      type: Boolean
    },
    visible: {
      validator: function(visible) {
        return typeof visible === 'boolean';
      }
    },
    defaultVisible: {
      type: Boolean,
      default: false
    },
    action: {
      default: function() {
        return [];
      },
      validator: function(action) {
        return Array.isArray(action) || (typeof action === 'string' && ALL_HANDLERS.indexOf(action) > -1);
      }
    },
    showAction: {
      default: function() {
        return [];
      },
      validator: function(action) {
        return Array.isArray(action) || (typeof action === 'string' && ALL_HANDLERS.indexOf(action) > -1);
      }
    },
    hideAction: {
      default: function() {
        return [];
      },
      validator: function(action) {
        return Array.isArray(action) || (typeof action === 'string' && ALL_HANDLERS.indexOf(action) > -1);
      }
    },
    overlayClick: {
      type: Function
    },
    mouseEnterDelay: {
      default: 0
    },
    mouseLeaveDelay: {
      default: 0.1
    },
    focusDelay: {
      default: 0
    },
    blurDelay: {
      default: 0.15
    }
  },
  data: function() {
    return {
      targetVisible: this.defaultVisible,
      delayTimer: null,
      focusTime: void 0,
      preClickTime: void 0,
      preTouchTime: void 0,
      documentClickEvents: {}
    };
  },
  computed: {
    controlled: function() {
      return typeof this.visible === 'boolean'
    },
    currentVisible: {
      get: function() {
        return this.controlled ? this.visible : this.targetVisible;
      },
      set: function(val) {
        if (!this.controlled) {
          this.targetVisible = val;
        }
        this.$emit('visible', val);
      }
    }
  },
  watch: {
    currentVisible: function(visible) {
      this.toggleDocumentEvent(visible);
    }
  },
  render: function(createElement) {
    var target = createElement('transition', [
      this.rebuild
      ? this.currentVisible
        ? this.$slots.target
        : this._e()
      : cloneVNodes(this.$slots.target, {
          style: this.currentVisible ? {} : {
            display: 'none'
          }
        })
    ]);

    var triggerVNode = cloneVNodes(this.$slots.trigger, {
      on: {
        mouseenter: this.mouseenter,
        mouseleave: this.mouseleave,
        focus: this.focus,
        blur: this.blur,
        touchstart: this.touchstart,
        mousedown: this.mousedown,
        click: this.click
      }
    });

    var targetVNode = cloneVNodes(target, {
      on: {
        mouseenter: this.targetEnter,
        mouseleave: this.targetLeave,
        click: this.targetClick
      }
    });

    return createElement(this.tag, {
      class: ['cd-trigger', this.currentVisible ? 'cd-trigger--open' : '']
    }, [triggerVNode, targetVNode]);
  },
  mounted: function() {
    this.toggleDocumentEvent(this.currentVisible);
  },
  beforeDestroy: function() {
    this.toggleDocumentEvent(false);
  },
  methods: {
    _setTargetVisible: function(visible) {
      this._clearDelayTimer();
      this.currentVisible = visible;
    },
    _delaySetTargetVisible: function(visible, delayS) {
      var self = this;
      var delay = delayS * 1000
      this._clearDelayTimer();
      this.delayTimer = setTimeout(function() {
        self._setTargetVisible(visible)
      }, delay);
    },
    _clearDelayTimer: function() {
      if (this.delayTimer) {
        clearTimeout(this.delayTimer);
        this.delayTimer = null;
      }
    },
    toggleDocumentEvent: function(visible) {
      var events = this.documentClickEvents;
      if (visible) {
        events.mousedown = events.mousedown || bindEvent(document, 'mousedown', this.documentClick);
        events.touchstart = events.touchstart || bindEvent(document, 'touchstart', this.documentClick);
      } else {
        events.mousedown && ( events.mousedown = events.mousedown.remove() );
        events.touchstart && ( events.touchstart = events.touchstart.remove() );
      }
    },
    documentClick: function(evt) {
      var target = evt.target;
      var $children = this.$children;
      for (var i = 0; i < $children.length; i++) {
        var el = $children[i].$el;
        if (el == target || el.contains(target)) {
          return;
        }
      }
      this._setTargetVisible(false);
    },
    targetClick: function(evt) {
      if (typeof this.overlayClick !== 'function' || !this.overlayClick(evt)) {
        this._setTargetVisible(false);
      }
    },
    targetEnter: function() {
      if (this.isTargetEnterToShow()) {
        this._delaySetTargetVisible(true, this.mouseEnterDelay);
      }
    },
    targetLeave: function() {
      if (this.isTargetLeaveToHide()) {
        this._delaySetTargetVisible(false, this.mouseLeaveDelay);
      }
    },
    click: function() {
      if (this.isClickToHide() || this.isClickToShow()) {
        if (this.focusTime) {
          var preTime = void 0;
          if (this.preClickTime && this.preTouchTime) {
            preTime = Math.min(this.preClickTime, this.preTouchTime);
          } else if (this.preClickTime) {
            preTime = this.preClickTime;
          } else if (this.preTouchTime) {
            preTime = this.preTouchTime;
          }
          if (Math.abs(preTime - this.focusTime) < 20) {
            return;
          }
          this.focusTime = 0;
        }
        this.preClickTime = 0;
        this.preTouchTime = 0;
        var nextVisible = !this.currentVisible;
        if ((nextVisible && this.isClickToShow()) || (!nextVisible && this.isClickToHide())) {
          this._setTargetVisible(nextVisible);
        }
      }
    },
    touchstart: function() {
      if (this.isClickToHide() || this.isClickToShow()) {
        this.preTouchTime = Date.now();
      }
    },
    mousedown: function() {
      if (this.isClickToHide() || this.isClickToShow()) {
        this.preClickTime = Date.now();
      }
    },
    mouseenter: function() {
      if (this.isMouseEnterToShow()) {
        this._delaySetTargetVisible(true, this.mouseEnterDelay);
      }
    },
    mouseleave: function() {
      if (this.isMouseLeaveToHide()) {
        this._delaySetTargetVisible(false, this.mouseLeaveDelay);
      }
    },
    focus: function() {
      if (this.isFocusToShow()) {
        this.focusTime = Date.now();
        this._delaySetTargetVisible(true, this.focusDelay);
      }
    },
    blur: function() {
      if (this.isBlurToHide()) {
        this._delaySetTargetVisible(false, this.blurDelay);
      }
    },
    isClickToShow: function() {
      var action = this.action;
      var showAction = this.showAction;
      return action.indexOf('click') !== -1 || showAction.indexOf('click') !== -1;
    },
    isClickToHide: function() {
      var action = this.action;
      var hideAction = this.hideAction;
      return action.indexOf('click') !== -1 || hideAction.indexOf('click') !== -1;
    },
    isTargetEnterToShow: function() {
      var action = this.action;
      var showAction = this.showAction;
      return !isSupportTouch && ( action.indexOf('hover') !== -1 || showAction.indexOf('mouseEnter') !== -1 || showAction.indexOf('targetEnter') !== -1 );
    },
    isTargetLeaveToHide: function() {
      var action = this.action;
      var hideAction = this.hideAction;
      return action.indexOf('hover') !== -1 || hideAction.indexOf('mouseLeave') !== -1 || hideAction.indexOf('targetLeave') !== -1;
    },
    isMouseEnterToShow: function() {
      var action = this.action;
      var showAction = this.showAction;
      return !isSupportTouch && ( action.indexOf('hover') !== -1 || showAction.indexOf('mouseEnter') !== -1  || showAction.indexOf('triggerEnter') !== -1 );
    },
    isMouseLeaveToHide: function() {
      var action = this.action;
      var hideAction = this.hideAction;
      return action.indexOf('hover') !== -1 || hideAction.indexOf('mouseLeave') !== -1 || hideAction.indexOf('triggerLeave') !== -1;
    },
    isFocusToShow: function() {
      var action = this.action;
      var showAction = this.showAction;
      return action.indexOf('focus') !== -1 || showAction.indexOf('focus') !== -1;
    },
    isBlurToHide: function() {
      var action = this.action;
      var hideAction = this.hideAction;
      return action.indexOf('focus') !== -1 || hideAction.indexOf('blur') !== -1;
    }
  }
};
</script>
