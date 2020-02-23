<script>
import align from './align';
import cloneVNode from '../core/util/cloneVNode';


export default {
  name: 'CdAlign',
  props: {
    target: {},
    align: {
      type: String,
      default: 'bottomLeft'
    },
    adjust: {
      type: [Boolean, Array],
      default: true
    },
    space: {
      type: [Number, Array]
    },
    hidden: {
      type: Boolean,
      default: false
    },
    interval: {
      type: Number,
      default: 0
    }
  },
  data: function() {
    return {
      timer: null,
      alignment: null,
      visibility: this.hidden ? 'hidden' : ''
    };
  },
  watch: {
    hidden: function() {
      this.init();
    }
  },
  render: function(createElement) {
    var defaultVNodes = this.$slots.default;
    var alignment = this.alignment;
    var alignStyle = {
      position: 'fixed',
      zIndex: 900000,
      visibility: this.visibility
    };
    var alignClass = ['cd-core-align', this.classes];

    if (alignment) {
      alignClass.push('cd-core-align--' + alignment[0]);
      alignStyle.top = alignment[1] + 'px';
      alignStyle.left = alignment[2] + 'px';
    }

    if (defaultVNodes.length === 1) {
      return cloneVNode(defaultVNodes[0], {
        class: alignClass,
        style: alignStyle
      });
    } else {
      return createElement('div', {
        class: alignClass,
        style: alignStyle
      }, [this.$slots.default]);
    }
  },
  mounted: function() {
    this.init();
  },
  beforeDestroy: function() {
    this.unlisten();
  },
  methods: {
    init: function() {
      this.visibility = 'hidden';
      !this.hidden && setTimeout(() => {
        this.updateAlignment();
        this.$nextTick(this.listen);
      }, 50);
    },
    update: function() {
      this.$nextTick(this.updateAlignment);
    },
    updateAlignment: function() {
      // 对齐的目标
      var target = this.target || this.$parent.$el;
      var alignment = align(target, this.$el, this.align, this.adjust, this.space);
      if (alignment && (!this.alignment || alignment.join(',') !== this.alignment.join(','))) {
        this.alignment = alignment;
      }
    },
    listen: function() {
      this.visibility = '';
      clearInterval(this.timer);
      if (this.interval) {
        this.timer = setInterval(this.updateAlignment, this.interval);
      }
    },
    unlisten: function() {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
</script>
