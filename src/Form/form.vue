<style lang="scss" src="./form.scss"></style>
<script>
import { form as FORM_SIGN } from './sign';


export default {
  name: 'CdForm',
  sign: FORM_SIGN,
  data: function() {
    return {
      items: []
    };
  },
  render: function(createElement) {
    return createElement('form', {
      class: 'cd-form',
      on: {
        submit: this.submit
      }
    }, [ this.$slots.default ]);
  },
  methods: {
    submit: function(evt) {
      event.preventDefault();
      this.$emit('submit', evt);
    },
    validate: function() {
      var error = null;
      for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (item.validate()) {
          error = error || [];
          error.push(item);
        }
      }
      return error;
    },
    initialize: function() {
      for (var i = 0; i < this.items.length; i++) {
        var initialize = this.items[i].initialize;
        typeof initialize === 'function' && initialize();
      }
    }
  },
  events: {
    itemAdd: function(item) {
      this.items.push(item);
    },
    itemDel: function(item) {
      var index = this.items.indexOf(item);
      if (index > -1) {
        this.items.splice(index, 1);
      }
    }
  }
};
</script>
