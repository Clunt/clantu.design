<style lang="scss" src="./axis.scss"></style>
<script>
import { bindEvent, normalizeWheel } from '../core/util/event';
import { emptySelection } from '../core/util/dom';
import { translate3d as isSupportTranslate3d } from '../core/util/support';
import Dropdown from '../Dropdown';
import Button from '../Button';

var SCROLL_BORDER = 96; // 滚动间隔超过多大展示坐标轴
var AXIS_HIDE_DELAY = 2000; // 自动隐藏时间
var TOUCH_TAN_MAX = 0.4452286853085361; // Math.tan(24 * 2 * Math.PI / 360)
var TOUCH_PRESHOW_DISTANCE = 12;
var TOUCH_SHOWING_DISTANCE = 96;


export default {
  props: {
    axis: {},
    anchor: {},
    viewHeight: {},
    scrollHeight: {},
    scrollTop: {},
    barHover: {},
    barScrolling: {},
    push: {
      type: Boolean,
      default: true
    },

    touchEventStart: {},
    touchEventMove: {},
    touchEventEnd: {}
  },
  data: function() {
    return {
      show: false, // 显示坐标轴
      showing: null, // 正在显示坐标轴（Touch事件） null 默认 false 不进行处理（先右后左） true 准备显示
      scrolling: false, // 显示坐标轴 手机端显示（按钮）
      hover: false, // 鼠标滑过
      moving: false, // 正在拖动
      cursorTop: null, // 鼠标定位高度
      axisHeight: this.viewHeight, // 坐标轴高度
      timerShow: null, // 延迟隐藏定时器
      timerScrolling: null, // 延迟隐藏定时器

      prevScrollTop: 0 // 上一次滚动高度
    };
  },
  computed: {
    visible: function() {
      return !!(this.show || this.showing || this.scrolling);
    },
    anchorTop: function() {
      return Math.min((this.anchor || 0) / (this.total || 1), 1) * 100;
    },
    total: function() {
      var axis = this.axis;
      var total = 0;
      for (var i = 0; i < axis.length; i++) {
        total += axis[i].count;
      }
      return total;
    }
  },
  watch: {
    visible: function(visible) {
      this.$emit('visible', visible);
    },
    barHover: function(hover) {
      if (hover) {
        this.showAxis();
      } else {
        this.hideAxis();
      }
    },
    viewHeight: function(viewHeight) {
      this.onResize();
    },
    scrollTop: function(scrollTop) {
      if (this.show) {
        this.showAxis();
      } else if (this.showing) {} else if (this.scrolling || Math.abs(scrollTop - this.prevScrollTop) > SCROLL_BORDER) {
        this.showScrolling();
      }
      this.prevScrollTop = scrollTop;
    },
    touchEventStart: function(startEvent) {
      if (!this.push) return;
      if (!startEvent) return;
      if (this.showing) return;
      this.showing = null;
    },
    touchEventMove: function(moveEvent) {
      if (!this.push) return;
      var showing = this.showing;
      if (showing === false) return;
      var startEvent = this.touchEventStart;
      if (!startEvent || !moveEvent) return;
      startEvent = startEvent.changedTouches ? startEvent.changedTouches[0] : startEvent;
      moveEvent = moveEvent.changedTouches ? moveEvent.changedTouches[0] : moveEvent;
      var distanceX = moveEvent.clientX - startEvent.clientX;
      var distanceY = moveEvent.clientY - startEvent.clientY;
      if (!distanceX) return;
      if (this.show) {
        if (showing) {
          var scaleOpacity = 1 - Math.min(Math.max(2 * (distanceX - TOUCH_PRESHOW_DISTANCE) / TOUCH_SHOWING_DISTANCE, 0), 1);
          var tooltipOpacity = 1 - Math.min(Math.max(2 * (distanceX - TOUCH_PRESHOW_DISTANCE - TOUCH_SHOWING_DISTANCE / 2) / TOUCH_SHOWING_DISTANCE, 0), 1);
          var tooltipTranslate = Math.min(Math.max((distanceX - TOUCH_PRESHOW_DISTANCE) / TOUCH_SHOWING_DISTANCE, 0), 1);
          this.showing = {
            scaleOpacity: scaleOpacity,
            tooltipOpacity: tooltipOpacity,
            tooltipTranslate: tooltipTranslate * 100
          };
        } else if (showing === null && distanceX < 0) {
          // 先向左滑动，本次触摸过程不会隐藏坐标轴
          this.showing = false;
        } else {
          this.showing = undefined;
          var distanceTan = Math.abs(distanceY / distanceX);
          if (distanceTan > TOUCH_TAN_MAX) {
            this.showing = false;
          } else if (distanceX > TOUCH_PRESHOW_DISTANCE) {
            this.hideScrolling(true);
            this.showing = {
              scaleOpacity: 1,
              tooltipOpacity: 1,
              tooltipTranslate: 0
            };
          }
        }
      } else {
        if (showing) {
          var scaleOpacity = Math.min(Math.max(-2 * (distanceX + TOUCH_PRESHOW_DISTANCE + TOUCH_SHOWING_DISTANCE / 2) / TOUCH_SHOWING_DISTANCE, 0), 1);
          var tooltipOpacity = Math.min(Math.max(-2 * (distanceX + TOUCH_PRESHOW_DISTANCE) / TOUCH_SHOWING_DISTANCE, 0), 1);
          var tooltipTranslate = Math.min(Math.max(-1 * (distanceX + TOUCH_PRESHOW_DISTANCE) / TOUCH_SHOWING_DISTANCE, 0), 1);
          this.showing = {
            scaleOpacity: scaleOpacity,
            tooltipOpacity: tooltipOpacity,
            tooltipTranslate: 100 - tooltipTranslate * 100
          };
        } else if (showing === null && distanceX > 0) {
          // 先向右滑动，本次触摸过程不会显示坐标轴
          this.showing = false;
        } else {
          this.showing = undefined;
          var distanceTan = Math.abs(distanceY / distanceX);
          if (distanceTan > TOUCH_TAN_MAX) {
            this.showing = false;
          } else if (distanceX - TOUCH_PRESHOW_DISTANCE < 0) {
            this.hideScrolling(true);
            this.showing = {};
          }
        }
      }
    },
    touchEventEnd: function(endEvent) {
      if (!this.push) return;
      if (!(this.show || this.showing || this.scrolling)) return;
      var startEvent = this.touchEventStart;
      if (!startEvent || !endEvent) return;
      startEvent = startEvent.changedTouches ? startEvent.changedTouches[0] : startEvent;
      endEvent = endEvent.changedTouches ? endEvent.changedTouches[0] : moveEvent;
      var distanceX = endEvent.clientX - startEvent.clientX;
      if (distanceX + TOUCH_PRESHOW_DISTANCE + TOUCH_SHOWING_DISTANCE < 0) {
        this.showAxis();
      } else if (distanceX > TOUCH_PRESHOW_DISTANCE + TOUCH_SHOWING_DISTANCE) {
        this.hideAxis(true);
        this.hideScrolling(true);
      }
      this.showing = null;
    }
  },
  render: function(createElement) {
    var self = this;
    var totalCount = this.total;
    var axisLength = this.axis.length;
    var axisHeight = this.axisHeight;
    var axisMaxHeight = this.axisHeight;
    var axisMinHeight = (function() {
      var axisMinHeight = 40;
      var axisMinHeightSuit = axisMinHeight * 1.5;
      if (totalCount === axisLength) {
        for (var groupLength = 5; groupLength < axisLength; groupLength += 5) {
          var axisMinHeightTmp = Math.round(groupLength * axisMaxHeight / axisLength);
          groupLength += groupLength === 5 ? 0 : 5;
          if (axisMinHeightTmp < axisMinHeightSuit) continue;
          return axisMinHeightTmp
        }
      }
      return axisMinHeight;
    }());

    function createAxisVnode(item, top, level, index) {
      return createElement('li', {
        class: [
          level > 1 ? 'scale__child' : '',
          level === 1 && index === 0 ? 'scale__first' : ''
        ],
        style: {
          top: top * 100 + '%'
        }
      }, [
        createElement('span', [item.name])
      ]);
    }

    function createScaleChildren(vnodes, list, prevCount, leftCount) {
      if (!list) return;
      var sectionCount = 0;
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var count = item.count;
        if (axisMaxHeight * sectionCount / totalCount >= axisMinHeight && axisMaxHeight * leftCount / totalCount >= axisMinHeight) {
          vnodes.push(createAxisVnode(item, prevCount / totalCount, 2, i));
          sectionCount = count;
        } else {
          sectionCount += count;
        }
        prevCount += count;
        leftCount -= count
      }
    }

    function createScale(list) {
      var vnodes = [];
      var prevCount = 0;
      var sectionCount = 0;
      var prevHide = false;
      var first = list[0];
      var lastItem = null;
      if (first) {
        vnodes.push(createAxisVnode(first, 0, 1, 0));
        createScaleChildren(vnodes, first.children, 0, first.count);
        prevCount = sectionCount = first.count;
      }
      for (var i = 1; i < list.length; i++) {
        var item = list[i];
        var count = item.count;
        var prevItem = list[i - 1];
        var canReplace = prevItem === lastItem && item.count > prevItem.count && prevItem.count / totalCount * axisMaxHeight < axisMinHeight;
        if (
          sectionCount / totalCount * axisMaxHeight >= axisMinHeight || canReplace
        ) {
          // 上方空间足够 / 替换上方空间
          if (canReplace) {
            vnodes.pop();
          } else {
            lastItem = item;
          }
          vnodes.push(createAxisVnode(item, prevCount / totalCount, 1, i));
          createScaleChildren(vnodes, item.children, prevCount, count);
          sectionCount = count;
        } else {
          sectionCount += count;
        }
        prevCount += count;
      }
      return vnodes;
    }

    var showing = this.showing;
    var scaleVNode = createElement('ul', {
      class: 'cd-scroll__axis-scale',
      style: {
        opacity: showing ? showing.scaleOpacity : undefined
      }
    }, createScale(this.axis));

    var anchorTop = this.anchorTop;
    var cursorTop = this.cursorTop;

    var anchorVNode = createElement('div', {
      class: ['cd-scroll__axis-line', 'cd-scroll__axis-line--anchor', 'cd-scroll__axis-line--show'],
      style: isSupportTranslate3d ? {
        transform: 'translate3d(0, ' + ( anchorTop * axisHeight / 100 ) + 'px, 0)'
      } : {
        top: anchorTop + '%'
      },
      on: {
        touchstart: this.onAnchorDown
      },
      ref: 'anchor'
    });

    var cursorVNode = createElement('div', {
      class: ['cd-scroll__axis-line', 'cd-scroll__axis-line--cursor', typeof cursorTop === 'number' ? 'cd-scroll__axis-line--show' : ''],
      style: typeof cursorTop === 'number'
        ? isSupportTranslate3d
          ? { transform: 'translate3d(0, ' + ( cursorTop * axisHeight / 100 ) + 'px, 0)' }
          : { top: cursorTop + '%' }
        : null
    });

    var tooltipTop = typeof cursorTop === 'number' ? cursorTop : anchorTop;
    var tooltipTarget = this.getTarget(tooltipTop / 100);
    var tooltipVNode = tooltipTarget ? createElement('div', {
      class: 'cd-scroll__axis-tooltip',
      style: {
        opacity: showing ? showing.tooltipOpacity : undefined,
        transform: 'translate3d(' + (showing ? showing.tooltipTranslate : 0) + '%, ' + ( tooltipTop * axisHeight / 100 ) + 'px, 0)'
      },
      ref: 'tooltip'
    }, [tooltipTarget[0]]) : createElement('div');

    return createElement('div', {
      class: [
        'cd-scroll__axis',
        this.show ? 'cd-scroll__axis--show' : '',
        this.showing ? 'cd-scroll__axis--showing' : '',
        this.scrolling ? 'cd-scroll__axis--scrolling' : ''
      ],
      on: {
        wheel: this.onWheel,
        mouseenter: this.onMouseEnter,
        mouseleave: this.onMouseLeave
      }
    }, [
      createElement('div', {
        class: 'cd-scroll__axis-core',
        on: {
          mousedown: this.onAxisDown,
          mousemove: this.onAxisMove,
          mouseleave: this.onAxisLeave,
          touchstart: this.onAxisDown
        },
        ref: 'axis'
      }, [scaleVNode, anchorVNode, cursorVNode, tooltipVNode])
    ]);
  },
  mounted: function() {
    this.onResize();
  },
  methods: {
    findTarget: function find(list, count, prevCount) {
      prevCount = prevCount || 0;
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var itemCount = item.count;
        if (prevCount + itemCount < count) {
          prevCount += itemCount;
        } else {
          return item.children ? find(item.children, count, prevCount) : item;
        }
      }
      return undefined;
    },
    getTarget: function(percent) {
      if (typeof percent !== 'number') return undefined;
      var totalCount = this.total;
      var floatCount = totalCount * Math.min(percent, 1);
      var count = Math.min(Math.floor(floatCount) + 1, totalCount);
      var target = this.findTarget(this.axis, count);
      return target ? [target.name, count, floatCount - count + 1, target] : undefined; // [name, count(index + 1), offset, target]
    },

    showAxis: function() {
      this.hideScrolling(true);
      this.show = true;
      clearTimeout(this.timerShow);
      this.timerShow = setTimeout(this.hideAxis, AXIS_HIDE_DELAY);
    },
    hideAxis: function(force) {
      if (!force && (this.hover || this.moving || this.barHover || this.barScrolling)) return this.showAxis();
      clearTimeout(this.timerShow);
      if (!force && this.showing) {
        this.timerShow = setTimeout(this.hideAxis, AXIS_HIDE_DELAY);
      } else {
        this.show = false;
      }
    },

    showScrolling: function() {
      this.scrolling = true;
      clearTimeout(this.timerScrolling);
      this.timerScrolling = setTimeout(this.hideScrolling, AXIS_HIDE_DELAY);
    },
    hideScrolling: function(force) {
      if (!force && (this.hover || this.moving || this.barHover || this.barScrolling)) return this.showScrolling();
      clearTimeout(this.timerScrolling);
      this.scrolling = false;
    },

    onWheel: function(event) {
      this.$emit('scroll', true, normalizeWheel(event).pixelY);
    },
    onMouseEnter: function() {
      this.hover = true;
      this.showAxis();
    },
    onMouseLeave: function() {
      this.hover = false;
      this.hideAxis();
    },

    onAnchorDown: function(event) {
      if (!this.$refs.axis || !this.$refs.anchor) return;
      event.stopPropagation();
      event = event.changedTouches ? event.changedTouches[0] : event;
      var anchorRect = this.$refs.anchor.getBoundingClientRect();
      var fixY = event.clientY - (anchorRect.top + anchorRect.height / 2);
      var axisTop = this.$refs.axis.getBoundingClientRect().top;
      var axisHeight = this.axisHeight;
      var getTarget = function(event) {
        event = event.changedTouches ? event.changedTouches[0] : event;
        return this.getTarget(Math.min(Math.max((event.clientY - fixY - axisTop) / axisHeight, 0), 1));
      }.bind(this);
      this.moving = true;
      this.cursorTop = null;
      this.showAxis();
      var touchmove = bindEvent(document, 'touchmove', onDrag.bind(this), {
        passive: false
      });
      var touchend = bindEvent(document, 'touchend', stopDrag.bind(this))
      var touchcancel = bindEvent(document, 'touchcancel', stopDrag.bind(this))

      function onDrag(event) {
        event.preventDefault();
        this.$emit('axis', getTarget(event));
        emptySelection();
      }

      function stopDrag(event) {
        touchmove.remove();
        touchend.remove();
        touchcancel.remove();
        this.moving = false;
      }
    },
    onAxisDown: function(event) {
      if (!this.$refs.axis) return;
      event = event.changedTouches ? event.changedTouches[0] : event;
      var axisTop = this.$refs.axis.getBoundingClientRect().top;
      var axisHeight = this.axisHeight;
      var getTarget = function(event) {
        event = event.changedTouches ? event.changedTouches[0] : event;
        return this.getTarget(Math.min(Math.max((event.clientY - axisTop) / axisHeight, 0), 1));
      }.bind(this);
      this.$emit('axis', getTarget(event));
      this.moving = true;
      this.cursorTop = null;
      this.showAxis();
      var mousemove = bindEvent(document, 'mousemove', onDrag.bind(this));
      var touchmove = bindEvent(document, 'touchmove', onDrag.bind(this), {
        passive: false
      });
      var mouseup = bindEvent(document, 'mouseup', stopDrag.bind(this))
      var touchend = bindEvent(document, 'touchend', stopDrag.bind(this))
      var touchcancel = bindEvent(document, 'touchcancel', stopDrag.bind(this))

      function onDrag(event) {
        event.preventDefault();
        this.$emit('axis', getTarget(event));
        emptySelection();
      }

      function stopDrag(event) {
        mousemove.remove();
        touchmove.remove();
        mouseup.remove();
        touchend.remove();
        touchcancel.remove();
        this.moving = false;
      }
    },
    onAxisMove: function(event) {
      if (!this.$refs.axis) return;
      if (this.barScrolling || this.moving) return this.cursorTop = null;
      var offsetY = event.clientY - this.$refs.axis.getBoundingClientRect().top;
      this.cursorTop = Math.min(Math.max(offsetY / this.axisHeight, 0) * 100, 100);
    },
    onAxisLeave: function() {
      this.cursorTop = null;
    },
    onResize: function() {
      this.$nextTick(function() {
        var axisHeight = this.viewHeight;
        try {
          axisHeight = this.$refs.axis.offsetHeight;
        } catch (e) {}
        this.axisHeight = axisHeight;
      });
    }
  }
};
</script>
