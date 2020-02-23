import './index.scss';
import Vue from 'vue';
import Spin from '../../Spin';
import Layer from '../../Layer';


var div = document.createElement('div');
document.body.appendChild(div);

var wait = new Vue({
  el: div,
  data: function() {
    return {
      visible: false
    };
  },
  render: function(createElement) {
    if (!this.visible) return createElement('span');
    return createElement(Layer, {
      class: 'cd-wait',
      props: {
        visible: true
      }
    }, [
      createElement(Spin, {
        props: {
          kind: 'line'
        },
        slot: 'additions'
      })
    ]);
  },
  methods: {
    open: function() {
      this.visible = true;
    },
    close: function() {
      this.visible = false;
    }
  }
});


function open() {
  wait.open();
}

open.close = function() {
  wait.close();
}

export default open;
