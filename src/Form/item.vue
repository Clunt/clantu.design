<style lang="scss" src="./item.scss"></style>
<script>
import { item as ITEM_SIGN } from './sign';
import mixin from './mixin';

var ALL_KIND = ['default', 'frame'];


export default {
  name: 'CdFormItem',
  sign: ITEM_SIGN,
  mixins: [mixin],
  props: {
    value: {},
    kind: {
      default: 'default',
      validator: function(kind) {
        return ALL_KIND.indexOf(kind) > -1;
      }
    }
  },
  render: function(createElement) {
    var error = this.error;
    return createElement('div', {
      class: ['cd-form-item', error ? 'cd-form-item--error' : '', 'cd-form-item--kind-' + this.kind]
    }, [
      this.$slots.default,
      error && typeof error === 'string' ? createElement('div', {
        class: 'cd-form-item__error'
      }, [ this._v(this._s(error)) ]) : null
    ]);
  },
  methods: {
    validate: function(trigger) {
      return this.__validate(this.value, trigger);
    },
    prompt: function(message) {
      this.__prompt(message);
    },
    initialize: function() {
      this.__initialize();
    }
  },
  events: {
    focus: function() {
      this.__initialize();
    },
    blur: function() {
      this.validate('blur');
    },
    change: function() {
      this.$nextTick(function() {
        this.validate('change');
      });
    }
  }
};
</script>
