import './index.scss';
import Vue from 'vue';
import Button from '../../Button';
import Icon from '../../Icon';

var div = document.createElement('div');
document.body.appendChild(div);

var messageId = 1;
var message = new Vue({
  el: div,
  data: function() {
    return {
      messages: []
    };
  },
  render: function(createElement) {
    var messages = this.messages;
    var messagesVNode = [];
    for (var i = 0; i < messages.length; i++) {
      var message = messages[i];
      if (!message || !message.content) continue;
      var messageVNode = createElement('div', {
        class: ['cd-message__item', message.close ? 'cd-message__item--closable' : ''],
        on: {
          click: function(message) {
            if (message.closable !== false && !message.close) {
              this.remove(message.id, 'CONTENT');
            }
          }.bind(this, message)
        },
        key: message.id
      }, [
        message.title
          ? typeof message.title === 'object'
            ? createElement('div', {
              class: 'item__title',
            }, [
              typeof message.title.render === 'function' ? createElement(message.title) : message.title
            ])
            : createElement('div', {
              class: 'item__title',
              domProps: {
                innerHTML: this._s(message.title)
              }
            })
          : null,
        typeof message.content === 'object'
          ? createElement('div', {
            class: 'item__content',
          }, [
            typeof message.content.render === 'function' ? createElement(message.content) : message.content
          ])
          : createElement('div', {
            class: 'item__content',
            domProps: {
              innerHTML: this._s(message.content)
            }
          }),
        message.close ? createElement(Button, {
          props: {
            tag: 'span'
          },
          class: 'item__close',
          on: {
            click: function(message) {
              this.remove(message.id, 'CLOSE');
            }.bind(this, message)
          }
        }, [
          createElement(Icon, {
            props: {
              type: 'times',
              small: true
            }
          })
        ]) : null
      ]);
      messagesVNode.push(messageVNode);
    }
    return createElement('transition-group', {
      tag: 'div',
      class: 'cd-message'
    }, messagesVNode);
  },
  methods: {
    add: function(item) {
      var self = this;
      var id = messageId++;
      var duration = typeof item.duration === 'number' ? item.duration : 4500;
      item.id = id;
      item.content = item.content || '';
      item.title = item.title || '';
      item.close = typeof item.close === 'undefined' ? false : item.close;
      item.closable = typeof item.closable === 'undefined' ? true : item.closable;
      this.messages.push(item);
      if (duration) {
        setTimeout(function() {
          self.remove(id, 'AUTO');
        }, duration);
      }
      return item;
    },
    update: function(id, option) {
      if (!option) return;
      var messages = this.messages;
      for (var i = 0; i < messages.length; i++) {
        var message = messages[i];
        if (message.id === id) {
          if (typeof option.content !== 'undefined') {
            message.content = option.content;
          }
          if (typeof option.title !== 'undefined') {
            message.title = option.title;
          }
          if (typeof option.callback !== 'undefined') {
            message.callback = option.callback;
          }
          if (typeof option.close !== 'undefined') {
            message.close = option.close;
          }
          if (typeof option.closable !== 'undefined') {
            message.closable = option.closable;
          }
          break;
        }
      }
    },
    remove: function(id, type) {
      var messages = this.messages;
      for (var i = 0; i < messages.length; i++) {
        var message = messages[i];
        if (message.id === id) {
          messages.splice(i, 1);
          if (typeof message.callback == 'function') {
            message.callback(type);
          }
          break;
        }
      }
    }
  }
});


/**
 * option
 *   title
 *   close
 *   duration
 */
function show(content, option, callback) {
  if (typeof option === 'function') {
    callback = option;
    option = {};
  }
  option = option || {};
  option.content = content;
  option.callback = callback;
  return message.add(option);
};

show.update = function(id, option) {
  if (!option) return;
  message.update(id, option);
};

show.remove = function(id) {
  message.remove(id);
};

export default show;
