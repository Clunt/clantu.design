import Vue from 'vue';
import { isVNode } from '../core/util/vdom';
import ModalForm from './form';
import wait from '../prototype/wait'


export function open(opt) {
  var div = document.createElement('div');
  document.body.appendChild(div);

  var node = new Vue({
    el: div,
    data: function () {
      return {
        visible: false,
      };
    },
    render: function (createElement) {
      return this.visible ? createElement(ModalForm, {
        props: {
          visible: this.visible,
          title: opt.title,
        },
        on: {
          submit: this.submit,
          close: this.cancel,
        }
      }, [isVNode(opt.content) ? opt.content : createElement(opt.content)]) : null;
    },
    mounted: function () {
      this.visible = true;
    },
    methods: {
      submit: function () {
        const submit = opt.submit;
        if (typeof submit === 'function') {
          wait();
          new Promise(resolve => resolve(submit())).then(res => {
            if (res === true) {
              return;
            }
            this.close();
          }, (e) => {
          }).finally(() => {
            wait.close();
          });
        } else {
          this.close();
        }
      },
      cancel: function () {
        this.close();
        typeof opt.cancel === 'function' && opt.cancel();
      },
      close: function () {
        this.visible = false;
        setTimeout(() => {
          this.$destroy();
          this.$el.remove();
        }, 0);
      },
    }
  });
}

export {
  ModalForm,
}
