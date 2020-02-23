<template src="./index.html"></template>
<style lang="scss" src="./index.scss"></style>
<script>
export default {
  name: 'CdResize',
  data: function() {
    return {
      timer: null
    };
  },
  mounted: function() {
    this.reset();
  },
  methods: {
    resize: function() {
      var $refs = this.$refs;
      try {
        this.$emit('resize', $refs.x.offsetWidth, $refs.y.offsetHeight);
      } catch (e) {}
    },
    onScroll: function() {
      this.reset();
      clearTimeout(this.timer);
      this.timer = setTimeout(this.resize, 20);
    },
    reset: function() {
      var $refs = this.$refs;
      try {
        $refs.xp.style.width = $refs.xe.offsetWidth + 1 + 'px'; // x_placeholder
        $refs.yp.style.height = $refs.ye.offsetHeight + 1 + 'px'; // y_placeholder
        $refs.xe.scrollLeft = $refs.xe.scrollWidth; // x_expand
        $refs.xs.scrollLeft = $refs.xs.scrollWidth; // x_shrink
        $refs.ye.scrollTop = $refs.ye.scrollHeight; // y_expand
        $refs.ys.scrollTop = $refs.ys.scrollHeight; // y_shrink
      } catch (e) {}
    }
  }
};
</script>
