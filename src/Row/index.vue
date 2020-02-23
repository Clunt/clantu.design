<style lang="scss" src="./index.scss"></style>
<script>
export default {
  name: 'CdRow',
  props: {
    tag: {
      default: 'div'
    }
  },
  render: function(createElement) {
    return createElement(this.tag, {
      'class': 'cd-row'
    }, [this.$slots.default]);
  }
};
</script>
