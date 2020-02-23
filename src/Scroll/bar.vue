<style lang="scss" src="./bar.scss"></style>
<script>
import { bindEvent, normalizeWheel } from '../core/util/event';
import { emptySelection } from '../core/util/dom';
import { translate3d as isSupportTranslate3d } from '../core/util/support';

var THUMB_MIN_HEIGHT = 20;
var AUTO_SCROLL_DURATION = 300; // 最大滚动时间
var AUTO_SCROLL_SPEED = 1800; // 每秒滚动高度
var AUTO_SCROLL_DELAY = 360;
var SCROLLING_HIDE_DELAY = 300;

var ALL_KIND = ['default', 'tiny'];

export default {
  props: {
    kind: {
      default: 'default',
      validator: function(kind) {
        return ALL_KIND.indexOf(kind) > -1;
      }
    },
    viewHeight: {},
    scrollHeight: {},
    scrollTop: {}
  },
  data: function() {
    return {
      hover: false,
      moving: false,
      scrolling: false,
      timerScrolling: null,
      trackHeight: this.viewHeight
    };
  },
  computed: {
    thumbTop: function() {
      return Math.round(this.scrollTop * (this.trackHeight - this.thumbHeight) / (this.scrollHeight - this.viewHeight));
    },
    thumbHeight: function() {
      return Math.max(
        Math.round(this.trackHeight * this.viewHeight / this.scrollHeight),
        THUMB_MIN_HEIGHT
      );
    }
  },
  watch: {
    hover: function(hover) {
      this.$emit('hover', hover);
    },
    moving: function(value) {
      this.$emit(value ? 'scrollstart' : 'scrollend');
    },
    scrollTop: function() {
      this.scrolling = true;
      clearTimeout(this.timerScrolling);
      this.timerScrolling = setTimeout(function() {
        this.scrolling = false;
      }.bind(this), SCROLLING_HIDE_DELAY);
    },
    scrollHeight: function(scrollHeight) {
      this.onResize();
    },
    viewHeight: function() {
      this.onResize();
    }
  },
  render: function(createElement) {
    if (this.viewHeight >= this.scrollHeight) return createElement('div');
    return createElement('div', {
      class: [
        'cd-scroll__bar',
        'cd-scroll__bar--kind-' + this.kind,
        this.moving ? 'cd-scroll__bar--moving' : '',
        this.scrolling ? 'cd-scroll__bar--scrolling' : ''
      ],
      on: {
        wheel: this.onBarWheel,
        mouseenter: this.onBarMouseEnter,
        mouseleave: this.onBarMouseLeave,
        mousedown: this.onBarMouseDown,
        dblclick: this.onBarDoubleClick
      }
    }, [
      createElement('div', {
        class: 'cd-scroll__bar-track',
        ref: 'track'
      }, [
        createElement('div', {
          class: 'cd-scroll__bar-thumb',
          on: {
            mousedown: this.onThumbMouseDown
          },
          style: isSupportTranslate3d ? {
            height: this.thumbHeight + 'px',
            transform: 'translate3d(0, ' + this.thumbTop + 'px, 0)'
          } : {
            top: this.thumbTop + 'px',
            height: this.thumbHeight + 'px'
          },
          ref: 'thumb'
        })
      ])
    ]);
  },
  mounted: function() {
    this.onResize();
  },
  methods: {
    onResize: function() {
      var viewHeight = this.viewHeight;
      var scrollHeight = this.scrollHeight;
      if (viewHeight >= scrollHeight) return this.trackHeight = 0;
      this.$nextTick(function() {
        var trackHeight = this.viewHeight;
        try {
          trackHeight = this.$refs.track.offsetHeight;
        } catch (e) {}
        this.trackHeight = trackHeight;
      });
    },
    onBarWheel: function(event) {
      this.$emit('scroll', true, normalizeWheel(event).pixelY);
    },
    onBarMouseEnter: function() {
      this.hover = true;
    },
    onBarMouseLeave: function() {
      this.hover = false;
    },
    onBarMouseDown: function(event) {
      if (event.target === this.$refs.thumb) return null;
      if (!this.$refs.track) return;
      var self = this;
      var scrollTimer = null;
      var scrollAuto = false;
      var scrollLocked = false;
      var scrollInterval = 10;
      var cursorY = event.clientY;
      var barClientTop = this.$refs.track.getBoundingClientRect().top;
      var scrollDirection = cursorY > barClientTop + this.thumbTop + this.thumbHeight / 2 ? 1 : -1;
      var scrollTopOffset = scrollDirection * this.viewHeight;
      var scrollDuration = Math.min(Math.abs(Math.round(scrollTopOffset / AUTO_SCROLL_SPEED * 1000)), AUTO_SCROLL_DURATION);
      var scrollTopOffsetPiece = Math.round(scrollTopOffset * scrollInterval / scrollDuration);

      var scroll = function() {
        if (scrollLocked) return true;
        var currentDirection = cursorY - (barClientTop + self.thumbTop + self.thumbHeight / 2);
        if (!currentDirection || currentDirection / scrollDirection < 0) return true;
        self.$emit('scroll', true, scrollTopOffsetPiece);
      };

      var autoScroll = function() {
        if (!scrollAuto) return;
        if (scrollTimer || scroll()) return;
        clearInterval(scrollTimer);
        scrollTimer = setInterval(function() {
          if (scroll()) {
            offAutoScroll();
          }
        }, scrollInterval);
      };

      var offAutoScroll = function() {
        clearInterval(scrollTimer);
        scrollTimer = null;
      };

      // 开始滚动
      this.moving = true;
      this.$emit('scroll', true, scrollTopOffset, scrollDuration);

      setTimeout(function() {
        scrollAuto = true;
        autoScroll();
      }, scrollDuration + AUTO_SCROLL_DELAY);

      var mouseenter = bindEvent(this.$el, 'mouseenter', function() {
        scrollLocked = false;
      }.bind(this));
      var mouseleave = bindEvent(this.$el, 'mouseleave', function() {
        scrollLocked = true;
        offAutoScroll();
      }.bind(this));
      var mousemove = bindEvent(document, 'mousemove', function(event) {
        cursorY = event.clientY;
        var thumbClientTop = barClientTop + this.thumbTop;
        var thumbClientBottom = thumbClientTop + this.thumbHeight;
        if (cursorY < thumbClientTop - 10 || cursorY > thumbClientBottom + 10) {
          autoScroll();
        }
      }.bind(this));
      var mouseup = bindEvent(document, 'mouseup', function() {
        this.$emit('scroll', true, 0);
        this.moving = false;
        scrollLocked = true;
        mouseenter.remove();
        mouseleave.remove();
        mousemove.remove();
        mouseup.remove();
      }.bind(this));
    },
    onBarDoubleClick: function(event) {
      if (!this.$refs.track) return;
      this.$emit('scroll', (this.scrollHeight - this.viewHeight) * (event.clientY - this.$refs.track.getBoundingClientRect().top - this.thumbHeight / 2) / (this.trackHeight - this.thumbHeight));
      emptySelection();
    },
    onThumbMouseDown: function(event) {
      var fixY = event.clientY - this.thumbTop;
      this.moving = true;
      var mousemove = bindEvent(document, 'mousemove', function(event) {
        this.$emit('scroll', (event.clientY - fixY) * (this.scrollHeight - this.viewHeight) / (this.trackHeight - this.thumbHeight));
        emptySelection();
      }.bind(this));
      var mouseup = bindEvent(document, 'mouseup', function() {
        this.moving = false;
        mousemove.remove();
        mouseup.remove();
      }.bind(this));
    }
  }
};
</script>
