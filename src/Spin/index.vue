<style lang="scss" src="./index.scss"></style>
<script>
var ALL_KIND = ['default', 'line', 'flower'];
var ALL_SIZE = ['small', 'default', 'large', 'auto'];

// Spin
export default {
  name: 'CdSpin',
  props: {
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
    }
  },
  render: function(createElement) {
    var spinElementVNodes = [];
    var $slots = this.$slots;
    if (this.kind === 'flower') {
      for (var i = 1; i < 13; i++) {
        spinElementVNodes.push(createElement('span', { class: 'cd-spin__elements cd-spin__elements--' + i}));
      }
    }
    var spinVNode = createElement('div', {
      class: 'cd-spin__element'
    }, spinElementVNodes);
    var frontVNode = $slots.additions ? createElement('div', {
      class: 'cd-spin__front'
    }, [$slots.additions]) : null;
    var behindVNode = $slots.default ? createElement('div', {
      class: 'cd-spin__behind'
    }, [$slots.default]) : null;

    return createElement('div', {
      class: [
        'cd-spin',
        'cd-spin--kind-' + this.kind,
        'cd-spin--size-' + this.size
      ]
    }, [frontVNode, spinVNode, behindVNode]);
  }
};
</script>
