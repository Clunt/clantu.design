import Button from '../Button';
import message from '../prototype/message';


function Residual() {
  var self = this;
  this.images = [];
  this.message = null;
  this.content = function(createElement) {
    return createElement('span', [
      '请检查网络后，',
      createElement(Button, {
        tag: 'span',
        props: {
          kind: 'inherit',
          size: 'mini',
        },
        on: {
          click: function() {
            self.retry();
          }
        }
      }, ['点此重新加载']),
      ' ' + self.images.length + ' 张照片'
    ]);
  };
}

Residual.prototype.add = function(image) {
  this.images.push(image);
  if (this.message) return this.update();
  var self = this;
  this.message = message({
    render: this.content
  }, {
    title: '照片加载失败',
    close: true,
    duration: 0
  }, function(type) {
    self.message = null;
  });
};

Residual.prototype.del = function(image) {
  var index = this.images.indexOf(image);
  if (index > -1) {
    this.images.splice(index, 1);
  }
  this.update();
};

Residual.prototype.retry = function() {
  var images = this.images;
  while (images.length > 0) {
    images.shift().retry();
  }
  this.update();
};

Residual.prototype.update = function() {
  if (!this.message) return;
  if (this.images.length > 0) {
    this.message.content = {
      render: this.content
    };
  } else {
    message.remove(this.message.id);
    this.message = null;
  }
};

export default new Residual();
