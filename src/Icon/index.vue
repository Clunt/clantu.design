<style lang="scss" src="./index.scss"></style>
<script>
export default {
  name: 'CdIcon',
  props: {
    tag: {
      default: 'span'
    },
    type: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: 'default'
    },
    small: Boolean,
    thin: Boolean
  },
  render: function(createElement) {
    var iconClass = 'cdicon-' + this.type;
    if (this.small) {
      iconClass += '--small';
    } else if (this.thin) {
      iconClass += '--thin';
    }
    return createElement(this.tag, {
      class: [
        'cd-icon',
        'cd-icon--size--' + this.size,
        'cdicon', iconClass
      ]
    }, [this.$slots.default]);
  }
};
</script>
