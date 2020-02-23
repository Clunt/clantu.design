<style lang="scss" src="./tab.scss"></style>
<script>
import TouchDirection from '../core/libs/TouchDirection';
import Nav from './nav';
import { tab as TAB_SIGN } from './sign';

var ALL_SIZE = ['default'];
var ALL_KIND = ['default'];

export default {
  name: 'CdTab',
  sign: TAB_SIGN,
  props: {
    kind: {
      default: 'default',
      validator: function(kind) {
        return ALL_KIND.indexOf(kind) > -1;
      }
    },
    size: {
      default: 'default',
      validator: function(kind) {
        return ALL_KIND.indexOf(kind) > -1;
      }
    },
    sign: [String, Number],
    nav: Object,
    drag: Boolean
  },
  data: function() {
    return {
      panes: [],
      current: null,
      prev: null,
      next: null,
      offset: null,
      dragging: null
    };
  },
  watch: {
    sign: function(sign) {
      if (this.current && this.current.sign === sign) return;
      var pane = null;
      var panes = this.panes;
      for (var i = 0; i < panes.length; i++) {
        if (sign === panes[i].sign) {
          pane = panes[i];
        }
      }
      if (pane) {
        this.current = pane;
        this.prev = null;
        this.next = null;
      }
    },
    current: function(pane) {
      this.$emit('change', pane.sign, pane);
    }
  },
  render: function(createElement) {
    var prefix = 'cd-tab--'
    var classes = ['cd-tab'];
    if (this.size) classes.push(prefix + 'size-' + this.size);
    if (this.kind) classes.push(prefix + 'kind-' + this.kind);
    var navOption = this.nav || {};

    var paneListStyle = {};
    if (this.offset) {
      paneListStyle.transform = 'translate(' + this.offset[0] + 'px,' + this.offset[1] + 'px)';
      if (this.offset[2]) {
        paneListStyle.transition = 'transform ' + this.offset[2] + 'ms';
      }
    }
    return createElement('div', {
      class: classes
    }, [
      createElement(Nav, {
        props: {
          panes: this.panes,
          current: this.current,
          kind: navOption.kind,
          position: navOption.position,
          place: navOption.place
        },
        on: {
          change: this.onChange
        }
      }),
      createElement('div', {
        class: 'cd-tab__pane',
        style: this.offset ? {
          overflow: 'hidden'
        } : {},
        on: this.drag ? {
          touchstart: this.onDrag
        } : {},
        ref: 'pane'
      }, [
        createElement('div', {
          class: 'cd-tab__pane__list',
          style: paneListStyle
        }, [this.$slots.default])
      ])
    ]);
  },
  methods: {
    onChange: function(pane) {
      if (this.current === pane) return;
      this.current = pane;
      this.prev = null;
      this.next = null;
    },
    onDrag: function() {
      if (!this.drag || this.dragging) return;
      var pane = (function(panes, currentPane) {
        var currentIndex = -1;
        var paneLength = panes.length;
        for (var i = 0; i < paneLength; i++) {
          if (currentPane == panes[i]) {
            currentIndex = i;
          }
        }
        if (currentIndex < 0) return null;
        return {
          current: currentPane,
          prev: panes[currentIndex - 1] || null,
          next: panes[currentIndex + 1] || null
        }
      }(this.panes, this.current));
      if (!pane || !(pane.prev || pane.next)) return;
      var self = this;
      var stop = function() {
        clearTimeout(self.dragging);
        self.dragging = null;
        self.offset = null;
        self.prev = null;
        self.next = null;
      };
      var width = this.$refs.pane.getBoundingClientRect().width;
      var touch = new TouchDirection(event, {
        directions: [
          [60, 120],
          [240, 300]
        ],
        onMove: function(event, client, distance) {
          event.cancelable && event.preventDefault();
          var offsetX = distance[0];
          if (offsetX > 0) {
            offsetX = Math.min(offsetX, width);
            if (pane.prev) {
              self.prev = pane.prev;
            } else {
              offsetX = 0;
            }
          }
          if (offsetX < 0) {
            offsetX = Math.max(offsetX, -width);
            if (pane.next) {
              self.next = pane.next;
            } else {
              offsetX = 0;
            }
          }

          self.offset = [offsetX, 0];
        },
        onStop: function(event, client, distance) {
          if (Math.abs(distance[0]) < 50) return stop();
          var offsetX = distance[0];
          var direction = offsetX > 0 ? -1 : 1;
          var current = null;
          if (direction > 0) {
            if (pane.next) {
              current = pane.next;
            }
          } else {
            if (pane.prev) {
              current = pane.prev;
            }
          }
          if (!current) return stop();
          var duration = 300;
          duration = Math.round(duration * Math.max(width - Math.abs(offsetX), 0) / width);
          clearTimeout(self.dragging);
          self.offset = [-1 * direction * width, 0, duration];
          self.dragging = setTimeout(function () {
            self.current = current;
            stop();
          }, duration);
        }
      });
    }
  },
  events: {
    paneAdd: function(pane) {
      this.panes.push(pane);
      if (!this.current) {
        this.current = pane;
      }
      if (this.sign === pane.sign) {
        this.current = pane;
      }
    },
    paneDel: function(pane) {
      var index = this.panes.indexOf(pane);
      if (index > -1) {
        this.panes.splice(index, 1);
      }
    },
    paneChange: function(pane) {
      if (this.sign === pane.sign) {
        this.current = pane;
      }
    }
  }
};
</script>
