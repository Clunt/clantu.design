<style lang="scss" src="./index.scss"></style>
<script>
import emitter from '../core/mixins/emitter';
import { FormItem } from '../Form';

import calcTextareaHeight from './calcTextareaHeight';
import * as format from './format';


var ALL_TYPE = ['text', 'password', 'textarea', 'number', 'email'];
var ALL_SIZE = ['default', 'large', 'small'];
var ALL_KIND = ['default', 'frame'];

// Input
export default {
  name: 'CdInput',
  mixins: [emitter],
  props: {
    type: {
      default: 'text',
      validator: function(type) {
        return ALL_TYPE.indexOf(type) > -1;
      }
    },
    id: String,
    value: {},
    trim: {
      type: Boolean,
      default: true
    },
    maxlength: [Number, String],
    format: [String, Function],
    formatBlur: [String, Function],
    placeholder: String,
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
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    disabled: Boolean,
    name: String,
    readonly: Boolean,
    rows: [String, Number]
  },
  data: function() {
    return {
      isFocus: false,
      currentValue: this.value ? String(this.value) : '',
      textareaStyle: {}
    };
  },
  watch: {
    value: function(value) {
      this.currentValue = String(value);
    },
    currentValue: function(value) {
      if (value === this.value) return;
      this.resizeTextarea();
      this.$emit('input', value);
    }
  },
  render: function(createElement) {
    var isTextarea = this.type === 'textarea';
    var inputElTag = isTextarea ? 'textarea' : 'input';
    var inputElOption = {
      class: 'cd-input__element',
      directives: [{
        name: 'model',
        value: this.currentValue
      }],
      domProps: {
        value: this.currentValue
      },
      on: {
        input: this.onInput,
        blur: this.onBlur,
        focus: this.onFocus
      },
      attrs: {
        id: this.id,
        name: this.name,
        placeholder: this.placeholder,
        readonly: this.readonly,
        disabled: this.disabled,
      },
      ref: 'element'
    };
    if (isTextarea) {
      inputElOption.attrs.rows = this.rows;
      inputElOption.style = this.textareaStyle;
    } else {
      inputElOption.attrs.type = this.type;
    }
    var inputVNode = createElement(inputElTag, inputElOption);

    return createElement('div', {
      'class': [
        'cd-input',
        'cd-input--kind-' + this.kind,
        'cd-input--size-' + this.size,
        this.isFocus ? 'cd-input--focus' : '',
        this.disabled ? 'cd-input--disabled' : '',
        this.type === 'hidden' ? 'cd-input--hidden' : ''
      ]
    }, [
      this.$slots.default,
      inputVNode,
      createElement('div', {
        'class': 'cd-input__border'
      }, [ createElement('span') ])
    ]);
  },
  mounted: function() {
    this.resizeTextarea();
  },
  methods: {
    update: function() {
      this.currentValue = String(this.value);
    },
    onBlur: function(event) {
      var currentValue = this.currentValue;
      if (this.trim && this.type !== 'password') {
        currentValue = currentValue.trim();
      }
      if (typeof this.formatBlur === 'string' && typeof format[this.formatBlur] === 'function') {
        currentValue = format[this.formatBlur](currentValue);
      }
      if (typeof this.formatBlur === 'function') {
        currentValue = this.formatBlur(currentValue);
      }
      currentValue = String(currentValue);
      if (this.currentValue !== currentValue) {
        this.currentValue = currentValue;
      }

      this.isFocus = false;
      this.$emit('blur', event);
      this.__dispatch(FormItem.sign, 'blur', event, this);
    },
    onFocus: function(event) {
      this.isFocus = true;
      this.$emit('focus', event);
      this.__dispatch(FormItem.sign, 'focus', event, this);
    },
    onInput: function(event) {
      if (event.target.composing) return;
      var target = event.target;
      var value = String(target.value);
      var formattedValue = value;
      if (this.type === 'number') {
        formattedValue = formattedValue.replace(/[^\d]/g, '');
      }
      if (typeof this.maxlength !== 'undefined') {
        formattedValue = formattedValue.slice(0, this.maxlength);
      }
      if (typeof this.format === 'string' && typeof format[this.format] === 'function') {
        formattedValue = format[this.format](formattedValue);
      }
      if (typeof this.format === 'function') {
        formattedValue = this.format(formattedValue);
      }
      formattedValue = String(formattedValue);
      if (formattedValue !== value) {
        target.value = formattedValue;
      }
      this.currentValue = formattedValue;
      this.$emit('change');
      this.__dispatch(FormItem.sign, 'change', this);
    },
    resizeTextarea: function() {
      if (!this.autosize || this.type !== 'textarea') return;
      this.$nextTick(function() {
        this.textareaStyle = calcTextareaHeight(this.$refs.element, this.autosize.min, this.autosize.max);
      });
    }
  }
};
</script>
