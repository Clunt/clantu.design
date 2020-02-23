<style lang="scss" src="./form.scss"></style>
<script>
import Layer from '../Layer';
import Icon from '../Icon';
import Button from '../Button';

export default {
  name: 'CdModalForm',
  props: ['visible', 'title', 'escape', 'closable', 'submit'],
  render: function(createElement) {
    return createElement(Layer, {
      class: 'cd-modal cd-modal--form',
      props: {
        visible: this.visible,
        escape: this.escape,
        push: true,
        hint: true,
      },
      on: {
        close: this.onLayerClose
      }
    }, [
      createElement('div', {
        class: 'cd-modal__title'
      }, this.title),
      createElement('div', {
        class: 'cd-modal__content'
      }, [this.$slots.default]),
      createElement('div', {
        class: 'cd-modal__fns'
      }, [
        createElement(Button, {
          props: {
            kind: 'primary'
          },
          on: {
            click: this.onSubmit
          }
        }, this.submit || '确定')
      ]),
      createElement(Button, {
        class: 'cd-modal__close',
        on: {
          click: this.close
        },
        slot: 'additions'
      }, [
        createElement(Icon, {
          props: {
            type: 'times'
          }
        })
      ]),
      createElement(Button, {
        class: 'cd-modal__sure',
        on: {
          click: this.onSubmit
        },
        slot: 'additions'
      }, [
        createElement(Icon, {
          props: {
            type: 'tick'
          }
        })
      ])
    ]);
  },
  methods: {
    onLayerClose: function(type, event) {
      if (
        this.closable && type === 'click'
        || this.escape && type === 'escape'
      ) {
        this.$emit('close');
      }
    },
    onSubmit: function() {
      this.$emit('submit');
    },
    close: function() {
      this.$emit('close');
    }
  }
};
</script>
