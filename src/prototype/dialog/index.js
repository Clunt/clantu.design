import Vue from 'vue';
import Layer from '../../Layer';
import Button from '../../Button';

var DIALOGS = [];

function Dialog(message, option, callback) {
  var dialogNode = document.createElement('div');
  document.body.appendChild(dialogNode);

  option = option || {};
  var dialog = new Vue({
    el: dialogNode,
    data: function() {
      return {
        visible: false,
        defaultClass: option.defaultClass || '',
        class: option.class || '',
        title: option.title || '',
        message: message,
        buttons: option.buttons || [],
        callback: callback,
        closable: !!option.closable
      }
    },
    render: function(createElement) {
      var buttonVNodes = [];
      var buttons = this.buttons;
      for (var i = 0; i < buttons.length; i++) {
        var button = buttons[i];
        buttonVNodes.push(
          createElement(Button, {
            props: {
              kind: button.kind,
              size: button.size
            },
            on: {
              click: function(button) {
                this._callback(button.sign);
              }.bind(this, button)
            }
          }, [this._v(this._s(button.name))])
        );
      }
      return createElement(Layer, {
        class: ['cd-dialog', this.title ? 'cd-dialog--title' : '', this.defaultClass, this.class],
        props: {
          hint: !this.closable,
          visible: this.visible
        },
        on: {
          afterLeave: this.onAfterLeave,
          click: this.onLayerClick
        }
      }, [
        this.title ? createElement('div', {
          class: 'cd-dialog__title',
          domProps: typeof this.title === 'object' ? {} : {
            innerHTML: this._s(this.title)
          }
        }, [typeof this.title === 'object' ? ( this.title.__proto__.constructor === Object ? createElement(this.title) : this.title ) : null]) : null,
        createElement('div', {
          class: 'cd-dialog__message',
          domProps: typeof this.message === 'object' ? {} : {
            innerHTML: this._s(this.message)
          }
        }, [typeof this.message === 'object' ? ( this.message.__proto__.constructor === Object ? createElement(this.message) : this.message ) : null]),
        buttonVNodes.length ? createElement('div', {
          class: 'cd-dialog__buttons'
        }, buttonVNodes) : null
      ]);
    },
    mounted: function() {
      // 过渡动画
      this.visible = true;
    },
    destroyed: function() {
      if (this.$el && typeof this.$el.remove === 'function') {
        this.$el.remove();
      }
      var dialogIndex = DIALOGS.indexOf(this);
      if (dialogIndex > -1) {
        DIALOGS.splice(dialogIndex, 1);
      }
    },
    methods: {
      onAfterLeave: function() {
        this.$destroy();
      },
      onLayerClick: function() {
        if (this.closable) {
          this._callback(null);
        }
      },
      close: function() {
        this.visible = false;
      },
      _callback: function() {
        if (typeof this.callback !== 'function') return this.close();
        var callback = this.callback;
        var promise = callback.apply(this, arguments);
        if (typeof promise === 'function') {
          promise(function() {
            this.close();
          }.bind(this));
        } else if (!promise) {
          this.close();
        }
      }
    }
  });

  DIALOGS.push(dialog);

  return dialog;
}

Dialog.close = function() {
  while (DIALOGS.length) {
    var dialog = DIALOGS.shift();
    if (typeof dialog.$destroy === 'function') {
      dialog.$destroy();
    }
  }
};

export default Dialog;
