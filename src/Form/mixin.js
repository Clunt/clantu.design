import emitter from '../core/mixins/emitter';
import { validator } from '../core/util';
import { form as FORM_SIGN } from './sign';


function getValidation(trigger, validation) {
  validation = ( Array.isArray(validation) ? validation : [validation] ) || [];
  if (!trigger) return validation;
  var arr = [];
  for (var i = 0; i < validation.length; i++) {
    var triggers = (validation[i].trigger || '').split(',');
    if (triggers.indexOf(trigger) > -1) {
      arr.push(validation[i]);
    }
  }
  return arr;
}

function validate(value, validation, trigger) {
  var validation = getValidation(trigger, validation);
  var valueType = typeof value;
  var isString = valueType === 'string';
  var isNumber = valueType === 'number';
  var isUndefined = valueType === 'undefined';
  var valueLength = isString || isNumber ? String(value).length : NaN;
  var hasLength = !isNaN(valueLength);
  for (var i = 0; i < validation.length; i++) {
    var rule = validation[i];
    var message = rule.message || true;
    if (rule.required && !value && !isNumber) return message;
    if (typeof rule.minlength !== 'undefined' && hasLength && valueLength < rule.minlength) return message;
    if (typeof rule.maxlength !== 'undefined' && hasLength && valueLength > rule.maxlength) return message;
    if (typeof rule.validator === 'string' && typeof validator[rule.validator] === 'function' && !validator[rule.validator](value)) return message;
    if (typeof rule.validator === 'function') return rule.validator(value);
  }
}

export default {
  mixins: [emitter],
  props: {
    validation: {
      type: [Array, Object, Function]
    }
  },
  data: function() {
    return {
      error: false
    };
  },
  mounted: function() {
    this.__dispatch(FORM_SIGN, 'itemAdd', this);
  },
  beforeDestroy: function() {
    this.__dispatch(FORM_SIGN, 'itemDel', this);
  },
  methods: {
    __validate: function(value, trigger) {
      var error = this.error = validate(value, this.validation, trigger);
      return error;
    },
    __prompt: function(message) {
      this.error = message;
    },
    __initialize: function() {
      this.error = false;
    }
  }
};
