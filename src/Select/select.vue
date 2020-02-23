<style lang="scss" src="./select.scss"></style>
<script>
import emitter from '../core/mixins/emitter';
import Icon from '../Icon';
import Scroll from '../Scroll';
import Resize from '../Resize';
import Dropdown from '../Dropdown';
import { FormItem } from '../Form';

import { select as SELECT_SIGN } from './sign';

var ALL_SIZE = ['default', 'large', 'small'];
var ALL_KIND = ['default', 'frame'];
var ALL_ALIGN = ['default', 'center'];

// Select
export default {
  name: 'CdSelect',
  sign: SELECT_SIGN,
  mixins: [emitter],
  props: {
    name: String,
    disabled: Boolean,
    placeholder: String,
    missholder: String,
    value: {},
    default: {},
    kind: {
      default: 'default',
      validator: function(kind) {
        return ALL_KIND.indexOf(kind) > -1;
      }
    },
    size: {
      default: 'default',
      validator: function(size) {
        return ALL_SIZE.indexOf(size) > -1;
      }
    },
    align: {
      default: 'default',
      validator: function(align) {
        return ALL_ALIGN.indexOf(align) > -1;
      }
    },
    action: {},
    interval: {}
  },
  data: function() {
    return {
      visible: false,

      options: [],
      selectedOption: null,
      selectedValue: this.value,

      selectionWidth: 0
    };
  },
  watch: {
    value: function(value) {
      if (value === this.selectedValue) return;
      this.selectedValue = value;
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i].value === value) {
          this.selectedOption = this.options[i];
          break;
        }
      }
    },
    selectedValue: function(value) {
      this.$emit('input', value);
      this.$emit('change', value);
      this.__dispatch(FormItem.sign, 'change', this);
    }
  },
  computed: {
    selection: function() {
      if (this.selectedValue === this.default) return this.placeholder;
      var selectedOption = this.selectedOption || {};
      return selectedOption.selection || (selectedOption.$slots || {}).default || this.missholder || '';
    }
  },
  render: function(createElement) {
    var selectionVNode = createElement('div', {
      class: [
        'cd-select__selection',
        'cd-select--kind-' + this.kind,
        'cd-select--size-' + this.size,
        'cd-select--align-' + this.align,
      ],
      slot: 'toggle'
    }, [
      createElement('div', {
        class: [
          'selection__text',
          this.selectedValue === this.default ? 'selection__text--placeholder' : ''
        ]
      }, [this.selection || createElement('span', { domProps:{ innerHTML: '&nbsp;' } })]),
      createElement('div', {
        class: 'selection__border'
      }, [createElement('span')]),
      createElement(Icon, {
        class: 'selection__arrow',
        props: {
          type: 'arrow-down',
          small: true
        }
      }),
      createElement(Resize, {
        on: {
          resize: this.onResize
        }
      })
    ]);

    var optionsVNode = createElement('div', {
      class: [
        'cd-select__options',
        'cd-select--kind-' + this.kind,
        'cd-select--size-' + this.size,
        'cd-select--align-' + this.align,
      ],
      style: {
        width: this.selectionWidth + 'px'
      },
      slot: 'target'
    }, [
      createElement('div', { class: 'cd-select__options__penetrate' }),
      createElement('div', {
        class: 'cd-select__options__box'
      }, [this.$slots.default])
    ]);


    var inputVNode = createElement('input', {
      attrs: {
        name: this.name,
        type: 'hidden'
      },
      domProps: {
        value: this.value
      }
    });

    return createElement(Dropdown, {
      class: 'cd-select',
      props: {
        rebuild: false, // select 组件事件必须禁止rebuild，否则有bug
        append: true,
        align: this.align === 'center' ? 'bottom' : 'bottomLeft',
        action: this.action,
        space: 0.1,
        interval: this.interval
      },
      on: {
        visible: this.onVisible
      }
    }, [selectionVNode, optionsVNode, inputVNode]);
  },
  methods: {
    onVisible: function(visible) {
      this.visible = visible;
      if (visible) {
        this.__dispatch(FormItem.sign, 'focus', this);
      }
    },
    onResize: function(width, height) {
      this.selectionWidth = width;
    }
  },
  events: {
    add: function(option) {
      this.options.push(option);
      if (option.value === this.selectedValue) {
        this.selectedOption = option;
      }
    },
    del: function(option) {
      var index = this.options.indexOf(option);
      if (index > -1) {
        this.options.splice(index, 1);
      }
    },
    change: function(option) {
      this.selectedOption = option;
      this.selectedValue = option.value;
    }
  }
};
</script>
