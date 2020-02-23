function Debounce(duration, callback) {
  if (!(duration && typeof duration === 'number' && typeof callback === 'function')) return;
  this.id = null;
  this.timestamp = 0;
  this.duration = duration;
  this.callback = callback;
}

Debounce.prototype.update = function() {
  if (!this.duration) return;
  var arg = arguments;
  var timestamp = Date.now();
  clearTimeout(this.id);
  if (this.timestamp + this.duration < timestamp) {
    this.timestamp = timestamp;
    this.callback.apply(this, arg);
  } else {
    this.id = setTimeout(function () {
      this.callback.apply(this, arg);
    }.bind(this), this.duration);
  }
};

export default Debounce;
