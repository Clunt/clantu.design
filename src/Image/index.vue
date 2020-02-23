<style lang="scss" src="./index.scss"></style>
<script>
import residual from './residual';

// TODO loading show/hide
export default {
  name: 'CdImage',
  props: ['src', 'alt', 'thumbnail'],
  data: function() {
    return {
      timestamp: +new Date(),
      loadState: 'LOADING'
    };
  },
  render: function(createElement) {
    if (!this.src) return createElement('span', {
      class: 'cd-image'
    });
    // TODO loading view
    return createElement('img', {
      class: 'cd-image',
      key: this.timestamp,
      attrs: {
        src: this.src
      },
      on: {
        load: this.load,
        error: this.error
      }
    });
  },
  beforeDestroy: function() {
    this.loadState = null;
    residual.del(this);
  },
  methods: {
    load: function() {
      this.loadState = 'COMPLETE';
    },
    error: function() {
      if (!this.loadState) return
      this.loadState = 'ERROR';
      residual.add(this);
    },
    retry: function() {
      if (this.loadState === 'COMPLETE') return;
      this.loadState = 'LOADING';
      this.timestamp = +new Date();
    }
  }
};
</script>
