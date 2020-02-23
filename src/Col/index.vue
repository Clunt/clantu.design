<style lang="scss" src="./index.scss"></style>
<script>
export default {
  name: 'CdCol',
  props: {
    tag: {
      default: 'div'
    },
    span: [Number, String],
    offset: [Number, String],
    push: [Number, String],
    pull: [Number, String],
    xs: [Number, String, Object],
    sm: [Number, String, Object],
    md: [Number, String, Object],
    lg: [Number, String, Object]
  },
  render: function(createElement) {
    var attrs = {
      span: {
        span: this.span,
        offset: this.offset,
        push: this.push,
        pull: this.pull
      },
      xs: this.xs,
      sm: this.sm,
      md: this.md,
      lg: this.lg
    };
    var prefix = 'cd-col'
    var classes = [];
    var attr;
    var prefix_attr;
    for (var key in attrs) {
      attr = attrs[key];
      prefix_attr = prefix;
      if (key !== 'span') {
        prefix_attr += '-' + key;
      }
      if (typeof attr !== 'object') {
        attr = {
          span: attr
        };
      }
      if (Number(attr.span) || Number(attr.span) === 0) {
        classes.push(prefix_attr + '-' + attr.span);
      }
      if (Number(attr.offset)) {
        classes.push(prefix_attr + '-offset-' + attr.offset);
      }
      if (Number(attr.push)) {
        classes.push(prefix_attr + '-push-' + attr.push);
      }
      if (Number(attr.pull)) {
        classes.push(prefix_attr + '-pull-' + attr.pull);
      }
    }
    if (classes.length === 0) {
      classes.push(prefix);
    }
    return createElement(this.tag, {
      class: classes
    }, [this.$slots.default]);
  }
};
</script>
