<style lang="scss" src="./index.scss"></style>
<script>
var ALL_SIZE = ['default', 'small', 'large', 'mini'];
var ALL_KIND = ['default', 'primary', 'danger', 'ghost', 'link', 'warn', 'inherit'];

export default {
  name: 'CdButton',
  props: {
    tag: {
      default: 'button'
    },
    size: {
      default: 'default',
      validator: function(size) {
        return ALL_SIZE.indexOf(size) > -1;
      }
    },
    kind: {
      default: 'default',
      validator: function(kind) {
        return ALL_KIND.indexOf(kind) > -1;
      }
    },
    active: Boolean,
    disabled: Boolean
  },
  render: function(createElement) {
    var prefix = 'cd-button--'
    var classes = ['cd-button'];
    if (this.size) classes.push(prefix + 'size-' + this.size);
    if (this.kind) classes.push(prefix + 'kind-' + this.kind);
    if (this.disabled) classes.push(prefix + 'disabled');
    if (this.active) classes.push(prefix + 'active');
    return createElement(this.tag, {
      class: classes,
      attrs: this.tag === 'button' ? {
        type: 'button',
        disabled: this.disabled,
      } : {},
      on: {
        click: function(event) {
          if (this.disabled) return;
          this.$emit('click', event)
        }.bind(this)
      }
    }, [this.$slots.default]);
  }
};
</script>
