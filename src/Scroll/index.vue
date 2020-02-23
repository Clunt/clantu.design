<style lang="scss" src="./index.scss"></style>
<script>
import { random, dynamics, event as Event } from '../core/util';
import Resize from '../Resize';

import Axis from './axis';
import Bar from './bar';

import SCROLL_SIGN from './sign';

function getEventClientPosition(event) {
  if (!event) return [0, 0];
  var touchEvent = event.changedTouches ? event.changedTouches[0] : event;
  return [touchEvent.clientX, touchEvent.clientY];
}

export default {
  name: 'CdScroll',
  sign: SCROLL_SIGN,
  props: {
    size: {},
    adjust: {
      // 自动计算容器实际宽度（包含barline宽）
      type: Boolean,
      default: true
    },
    maxheight: {},
    pull: {}, // 拖拽刷新
    // 滚动轴
    kind: {},
    // 坐标轴
    axis: {},
    anchor: {},
    push: {},
    disabled: Boolean
  },
  data: function() {
    var size = this.size || [0, 0];
    return {
      locked: false,

      barHover: false,
      barScrolling: false,
      axisScrolling: false,
      axisVisible: false,

      viewWidth: size[0],
      viewHeight: size[1],
      viewOffset: null,
      scrollWidth: 0,
      scrollHeight: 0,
      scrollTop: 0,
      scrollLeft: 0,

      touchState: null,

      touchEventStart: null,
      touchEventMove: null,
      touchEventEnd: null,

      scrollSmoothId: null
    };
  },
  computed: {
    viewStyle: function() {
      var style = {};
      this.locked && (style.overflow = 'hidden');
      this.maxheight && (style.maxHeight = this.maxheight + 'px');
      this.viewOffset && (style.transform = 'translate3d(' + this.viewOffset.join('px,') + 'px, 0)');
      return style;
    }
  },
  watch: {
    size: function(size) {
      try {
        this.viewWidth = size[0];
        this.viewHeight = size[1];
      } catch (e) {}
    }
  },
  render: function(createElement) {
    var self = this;

    var viewVNode = createElement('div', {
      class: 'cd-scroll__view',
      style: this.viewStyle,
      on: {
        scroll: this.onScroll,
        wheel: this.onWheel,
        touchstart: this.onTouchStart,
        touchmove: this.onTouchMove,
        touchend: this.onTouchEnd,
        touchcancel: this.onTouchEnd
      },
      ref: 'view'
    }, [
      createElement('div', {
        class: 'cd-scroll__main',
        style: this.adjust && this.viewWidth ? {
          width: this.viewWidth + 'px'
        } : {}
      }, [
        this.$slots.default,
        createElement(Resize, {
          on: {
            resize: this.onMainResize
          }
        })
      ])
    ]);

    var barVNode = createElement(Bar, {
      props: {
        kind: this.kind,
        viewHeight: this.viewHeight,
        scrollHeight: this.scrollHeight,
        scrollTop: this.scrollTop
      },
      on: {
        scroll: this.scroll,
        scrollstart: this.onBarScrollStart,
        scrollend: this.onBarScrollEnd,
        hover: this.onBarHover
      }
    });

    var axisVNode = this.axis && this.axis.length > 0 ? createElement(Axis, {
      props: {
        viewHeight: this.viewHeight,

        scrollHeight: this.scrollHeight,
        scrollTop: this.scrollTop,

        barHover: this.barHover,
        barScrolling: this.barScrolling,

        touchEventStart: this.touchEventStart,
        touchEventMove: this.touchEventMove,
        touchEventEnd: this.touchEventEnd,

        axis: this.axis,
        anchor: this.anchor,
        push: this.push
      },
      on: {
        axis: this.onAxis,
        scroll: this.scroll,
        visible: this.onAxisVisible
      }
    }) : createElement('div');

    var resizeVNode = this.size ? null : createElement(Resize, {
      on: {
        resize: this.onResize
      }
    });

    return createElement('div', {
      class: [
        'cd-scroll',
        this.axisVisible ? 'cd-scroll--axis' : '',
        this.disabled ? 'cd-scroll--disabled' : ''
      ]
    }, [viewVNode, barVNode, axisVNode, resizeVNode]);
  },
  mounted: function() {
    this.viewWidth = this.$el.offsetWidth;
    this.viewHeight = this.$el.offsetHeight;
  },
  beforeDestroy: function() {
    this.scrollSmoothId = null;
  },
  methods: {
    // 公用方法
    lock: function() {
      this.locked = true;
    },
    unlock: function() {
      this.locked = false;
    },

    // offset, scrollTop, smooth, callback
    // scrollTop, smooth, callback
    // offset, scrollTop, callback
    // scrollTop, callback
    scroll: function(offset, scrollTop, smooth, callback) {
      if (this.locked) return;
      if (typeof offset !== 'boolean') {
        callback = smooth;
        smooth = scrollTop;
        scrollTop = offset;
        offset = false;
      }
      if (typeof smooth === 'function') {
        callback = smooth;
        smooth = true;
      }
      if (smooth) return this.scrollSmooth(offset, scrollTop, smooth, callback);
      this.scrollSmoothId = null;
      if (offset) {
        this.$refs.view.scrollTop += scrollTop;
      } else {
        this.$refs.view.scrollTop = scrollTop;
      }
      if (typeof callback === 'function') {
        callback();
      }
    },
    scrollSmooth: function(offset, scrollTop, duration, callback) {
      if (this.locked) return;
      if (typeof offset !== 'boolean') {
        callback = duration;
        duration = scrollTop;
        scrollTop = offset;
        offset = false;
      }
      if (typeof duration === 'function') {
        callback = duration;
        duration = true;
      }
      var cubic_bezier = null;
      // 300 | true | ..
      // [300, [0, 0, 1, 1]] | [0, 0, 1, 1]
      if (typeof duration === 'number') {
        duration = duration || 300;
      } else if (Array.isArray(duration)) {
        if (duration.length === 2) {
          cubic_bezier = duration[1];
          duration = Number(duration[0]) || 300;
        } else {
          cubic_bezier = duration;
          duration = 300;
        }
      } else {
        duration = 300;
      }
      duration = duration === true ? 300 : Number(duration) || 300;
      var initial = this.$refs.view.scrollTop;
      var final = Math.round(offset ? initial + scrollTop : scrollTop);
      var scrollSmoothId = this.scrollSmoothId = random.UUID();
      dynamics([initial], [final], duration, function(delta, t, completed) {
        if (this.scrollSmoothId !== scrollSmoothId) return true;
        if (this.locked) return true;
        try { this.$refs.view.scrollTop = delta[0] } catch (e) { return true; }
        completed && typeof callback === 'function' && callback();
      }.bind(this), cubic_bezier);
    },

    goTop: function(animate) {
      this.scroll(0, animate);
    },
    goBottom: function(animate) {
      this.scroll(this.scrollHeight - this.viewHeight, animate);
    },

    // 事件绑定
    onScroll: function(event) {
      this.scrollTop = event.target.scrollTop;
      this.scrollLeft = event.target.scrollLeft;
      this.$emit('scroll', event, {
        scrollTop: event.target.scrollTop,
        scrollLeft: event.target.scrollLeft,
        scrollWidth: this.scrollWidth,
        scrollHeight: this.scrollHeight,
        viewWidth: this.viewWidth,
        viewHeight: this.viewHeight
      });
    },
    onWheel: function(event) {
      this.$emit('wheel', event, Event.normalizeWheel(event), {
        scrollTop: this.scrollTop,
        scrollLeft: this.scrollLeft,
        scrollWidth: this.scrollWidth,
        scrollHeight: this.scrollHeight,
        viewWidth: this.viewWidth,
        viewHeight: this.viewHeight
      });
      if (this.locked) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    },

    // 手势
    onTouchStart: function(event) {
      var scrollTop = this.scrollTop;
      var scrollLeft = this.scrollLeft;
      var scrollWidth = this.scrollWidth;
      var scrollHeight = this.scrollHeight;
      var viewWidth = this.viewWidth;
      var viewHeight = this.viewHeight;

      var clientPosition = getEventClientPosition(event);
      this.touchEventStart = event;
      this.touchEventEnd = null;
      this.$emit('move', event, {
        isFirst: true,
        isFinal: false,
        distance: [0, 0],
        scrollTop: scrollTop,
        scrollLeft: scrollLeft,
        scrollWidth: scrollWidth,
        scrollHeight: scrollHeight,
        viewWidth: viewWidth,
        viewHeight: viewHeight
      });


      if (this.pull) {
        if (this.touchState) {
          // 继续之前逻辑
          this.touchState = {
            pull: this.touchState.pull,
            lock: this.touchState.lock,
            native: this.touchState.native,
            delta: this.viewOffset || [0, 0],
            position: clientPosition
          };
          if (!this.touchState.native) {
            event.cancelable && event.preventDefault();
            return false;
          }
        } else {
          this.touchState = {
            pull: 0,
            lock: 0,
            native: false,
            delta: [0, 0],
            position: clientPosition
          };
        }
      }

      if (this.locked) {
        event.cancelable && event.preventDefault();
        return false;
      }
    },
    onTouchMove: function(event) {
      var scrollTop = this.scrollTop;
      var scrollLeft = this.scrollLeft;
      var scrollWidth = this.scrollWidth;
      var scrollHeight = this.scrollHeight;
      var viewWidth = this.viewWidth;
      var viewHeight = this.viewHeight;

      var clientPositionStart = getEventClientPosition(this.touchEventStart);
      var clientPositionMove = getEventClientPosition(event);
      var distance = [
        clientPositionMove[0] - clientPositionStart[0],
        clientPositionMove[1] - clientPositionStart[1]
      ];
      this.touchEventMove = event;
      this.$emit('move', event, {
        isFirst: false,
        isFinal: false,
        distance: distance,
        scrollTop: scrollTop,
        scrollLeft: scrollLeft,
        scrollWidth: scrollWidth,
        scrollHeight: scrollHeight,
        viewWidth: viewWidth,
        viewHeight: viewHeight
      });

      if (this.pull && this.touchState) {
        var touchState = this.touchState;
        var scrollTopMax = Math.max(scrollHeight - viewHeight, 0);
        var diffY = clientPositionMove[1] - touchState.position[1];
        if (touchState.pull) {
          // 拖拽中
          var pullDistance = touchState.native
              ? -1 * (touchState.pull < 0 ? scrollTop - (scrollHeight - viewHeight) : scrollTop)
              : Math.round(diffY / 2 + touchState.delta[1]);
          var pullOffset = Math.max(touchState.pull * pullDistance, 0);
          this.$emit('pull', touchState.pull, pullDistance, pullOffset);
          if (!touchState.native) {
            var touchScroll = touchState.pull > 0 ? Math.max(pullDistance, 0) : Math.min(pullDistance, 0);
            this.viewOffset = [0, touchScroll];
            event.cancelable && event.preventDefault();
            return false;
          }
        } else if (scrollTop < 0 || scrollTop > scrollTopMax) {
          // IOS safari native smooth pull
          touchState.native = true;
          touchState.pull = scrollTop > 0 ? -1 : 1; // 默认手势下拉
        } else {
          if (scrollTop === 0 || scrollTop === scrollTopMax) {
            if (touchState.lock) {
              touchState.pull = scrollTop === 0 && diffY > 0 ? 1 : scrollTop === scrollTopMax && diffY < 0 ? -1 : 0;
              touchState.lock = 0;
            } else {
              touchState.lock = 1;
            }
          }
          touchState.position = clientPositionMove;
        }
      }

      if (this.locked) {
        event.cancelable && event.preventDefault();
        return false;
      }
    },
    onTouchEnd: function(event) {
      var scrollTop = this.scrollTop;
      var scrollLeft = this.scrollLeft;
      var scrollWidth = this.scrollWidth;
      var scrollHeight = this.scrollHeight;
      var viewWidth = this.viewWidth;
      var viewHeight = this.viewHeight;

      var clientPositionStart = getEventClientPosition(this.touchEventStart);
      var clientPositionEnd = getEventClientPosition(event);
      var distance = [
        clientPositionEnd[0] - clientPositionStart[0],
        clientPositionEnd[1] - clientPositionStart[1]
      ];
      this.touchEventEnd = event;
      this.$emit('move', event, {
        isFirst: false,
        isFinal: true,
        distance: distance,
        scrollTop: scrollTop,
        scrollLeft: scrollLeft,
        scrollWidth: scrollWidth,
        scrollHeight: scrollHeight,
        viewWidth: viewWidth,
        viewHeight: viewHeight
      });

      this.$nextTick(function() {
        this.touchEventStart = null;
        this.touchEventMove = null;
      });

      if (this.pull && this.touchState && this.touchState.pull) {
        var touchState = this.touchState;
        var diffY = clientPositionEnd[1] - touchState.position[1];
        // 拖拽中
        var pullDistance = touchState.native
            ? -1 * (touchState.pull < 0 ? scrollTop - (scrollHeight - viewHeight) : scrollTop)
            : Math.round(diffY / 2 + touchState.delta[1]);
        var pullOffset = Math.max(touchState.pull * pullDistance, 0);
        // 视图偏移距离
        var viewOffset = this.viewOffset || [0, 0];
        // 视图偏移还原所需时间
        var viewOffsetDuration = Math.abs(viewOffset[1] / 0.36) || 1;
        // 优化：当native reset时，监听scroll变换并emit
        this.$emit(
          'pull',
          touchState.pull,
          pullDistance,
          pullOffset,
          touchState.native ? 'native' : 'virtual',
          viewOffsetDuration
        );

        if (touchState.native) {
          this.viewOffset = null;
          this.touchState = null;
        } else {
          var id = this.touchState.id = random.UUID();
          dynamics([viewOffset[1]], [0], viewOffsetDuration, function(delta, t, complete) {
            if (!this.touchState || this.touchState.id !== id) return true;
            this.viewOffset = [0, delta[0]];
            complete && requestAnimationFrame(function() {
              this.touchState = null;
              this.viewOffset = null;
            }.bind(this));
          }.bind(this), [0, 1, 1, 1]);
        }
      } else {
        this.touchState = null;
        this.viewOffset = null;
      }
    },

    onResize: function(width, height) {
      this.viewWidth = width;
      this.viewHeight = height;
      this.$emit('resize', width, height);
    },
    onMainResize: function(width, height) {
      this.scrollWidth = width;
      this.scrollHeight = height;
    },

    onAxis: function(target) {
      this.$emit('axis', target);
    },
    onAxisVisible: function(visible) {
      this.axisVisible = visible;
    },

    // 子元素事件
    onBarHover: function(hover) {
      this.barHover = hover;
    },
    onBarScrollStart: function() {
      this.barScrolling = true;
    },
    onBarScrollEnd: function() {
      this.barScrolling = false;
    },
  }
};
</script>
