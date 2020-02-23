<style lang="scss" src="./index.scss"></style>
<script>
import Button from '../Button';


export default {
  name: 'CdLoading',
  props: {
    tag: {
      default: 'div'
    },
    type: {
      default: 'default' // icon
    },
    refresh: Boolean,
    state: {}, // false 加载完，null / {} 正在加载，'' / '错误信息' 加载出错
    single: {
      default: true
    }
  },
  render: function(createElement) {
    // TODO
    // this.loading
    // this.error
    // 内嵌模版渲染错误文案
    var classes = '';
    var vnode = null;
    var state = this.state;
    if (typeof state === 'object' && !Array.isArray(state)) {
      classes = 'cd-loading cd-loading--loading';
      if (this.$slots.loading) {
        vnode = this.$slots.loading;
      } else if (this.type === 'icon') {
        vnode = [
          createElement('div', {
            class: 'loading__placeholer'
          }, []),
          createElement('div', {
            class: 'loading__text'
          }, this.loading ? [this._v(this._s(this.loading))] : this.refresh ? [
            createElement('span', null, '若长时间没有反应请'),
            createElement(Button, {
              props: {
                kind: 'ghost',
                size: 'mini',
              },
              on: {
                click: this.onRefresh
              }
            }, ['刷新页面重试'])
          ] : ['若长时间没有反应请刷新页面重试']
          )
        ];
      } else {
        vnode = createElement('span', {
          class: 'loading__info'
        }, this._v(this._s(this.loading || '加载中')));
      }
    } else if (state) {
      classes = 'cd-loading cd-loading--error';
      if (this.$slots.error) {
        vnode = this.$slots.error;
      } else if (this.type === 'icon') {
        vnode = [
          createElement('div', {
            class: 'loading__info'
          }, [this._v(this._s(state || this.error || '加载失败'))]),
          createElement('div', {
            class: 'loading__handle'
          }, [
            createElement(Button, {
              props: {
                kind: 'ghost',
                size: 'small',
              },
              on: {
                click: this.onReload
              }
            }, ['点此重新加载'])
          ].concat(this.refresh ? [
            ' 或 ',
            createElement(Button, {
              props: {
                kind: 'ghost',
                size: 'small',
              },
              on: {
                click: this.onRefresh
              }
            }, ['刷新页面重试'])
          ] : []))
        ];
      } else {
        vnode = createElement('span', {
          class: 'loading__info'
        }, this._v(this._s(this.error || '加载失败')));
      }
    } else {
      vnode = this.$slots.default;
    }
    return createElement(this.tag, {
      class: classes
    }, [].concat(vnode ? vnode : []));
  },
  methods: {
    onRefresh: function() {
      window.location.reload();
    },
    onReload: function() {
      this.$emit('reload');
    }
  }
};
</script>
