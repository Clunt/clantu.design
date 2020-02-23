<script>
var ALL_KIND = ['default'];
var ALL_POSITION = ['default'];
var ALL_PLACE = ['default'];

export default {
  props: {
    panes: {},
    current: {},
    kind: {
      default: 'default',
      validator: function(kind) {
        return ALL_KIND.indexOf(kind) > -1;
      }
    },
    position: {
      default: 'default',
      validator: function(position) {
        return ALL_POSITION.indexOf(position) > -1;
      }
    },
    place: {
      default: 'default',
      validator: function(place) {
        return ALL_PLACE.indexOf(place) > -1;
      }
    },
    separator: {
      default: '/',
      type: String
    }
  },
  data: function() {
    return {
    };
  },
  render: function(createElement) {
    var navVNodes = [];
    var paneLength = this.panes.length;
    this.panes.forEach(function(pane, index) {
      navVNodes.push(
        createElement('li', {
          class: ['cd-tab__nav__item', this.current === pane ? 'cd-tab__nav__item--active' : 'cd-tab__nav__item--inactive'],
          on: {
            click: function() {
              this.$emit('change', pane);
            }.bind(this)
          }
        }, [pane.nav])
      );
      if (this.separator && index + 1 < paneLength) {
        navVNodes.push(
          createElement('li', { class: 'cd-tab__nav__separator' }, [this.separator])
        );
      }
    }.bind(this));

    var prefix = 'cd-tab__nav--'
    var classes = ['cd-tab__nav'];
    if (this.kind) classes.push(prefix + 'kind-' + this.kind);
    if (this.position) classes.push(prefix + 'position-' + this.position);
    if (this.place) classes.push(prefix + 'place-' + this.place);
    return createElement('div', {
      class: classes
    }, [
      createElement('div', {
        class: 'cd-tab__nav__box'
      }, [
        createElement('ul', {
          class: 'cd-tab__nav__list'
        }, navVNodes)
      ])
    ]);
  }
};
</script>
