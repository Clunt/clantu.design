import * as Event from '../util/event';
var COMPUTE_INTERVAL = 25;

var noop = function() {};

var TOUCH_RADIUS = 18; // 触发拖拽距离
// direction: Array, // Clock [Start Deg, End Deg]
// directions: Array, // Clock [[Start Deg, End Deg]]
// radius: Number, // Start Move radius
// passive: Boolean, // Listen Document Touch Move/End/Cancel
// onStart: Function
// onMove: Function
// onStop: Function
// onCancel: Function

function TouchDirection(event, option) {
  if (!event) return;
  option = option || {};
  event = event.changedTouches ? event.changedTouches[0] : event;
  var directions = option.directions || [];
  if (option.direction) {
    directions.push(option.direction);
  }
  this.delay = false;
  this.enabled = false;
  this.disabled = false;
  this.hold = option.hold;
  this.x = this.lastX = event.clientX;
  this.y = this.lastY = event.clientY;
  this.t = this.lastT = Date.now();
  this.vx = this.lastVx = 0;
  this.vy = this.lastVy = 0;
  this.directions = directions;
  this.radius = option.radius || TOUCH_RADIUS;
  this.onBegin = option.onBegin || noop;
  this.onStart = option.onStart || noop;
  this.onMove = option.onMove || noop;
  this.onStop = option.onStop || noop;
  this.onCancel = option.onCancel || noop;
  this.onDestroy = option.onDestroy || noop;
  this.events = null;
  this._delay(option.delay);
  if (!option.passive) {
    this.active();
  }
}

TouchDirection.prototype._delay = function(delay) {
  if (!delay) return this.begin();
  this.delay = !!delay;
  setTimeout(function() {
    if (this.disabled) return;
    this.delay = false;
    this.begin();
  }.bind(this), delay);
};

TouchDirection.prototype.begin = function () {
  this.onBegin();
};

TouchDirection.prototype.start = function(event) {
  if (this.disabled) return;
  var touchEvent = event.changedTouches ? event.changedTouches[0] : event;
  var clientX = touchEvent.clientX
  var clientY = touchEvent.clientY
  var distanceX = clientX - this.x;
  var distanceY = clientY - this.y;
  var radius = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  if (radius < this.radius) return;
  var deg = -1 * (Math.atan2(-distanceY, distanceX) * 180 / Math.PI - 90);
  if (deg < 0) {
    deg += 360;
  }
  var enabled = false;
  var directions = this.directions;
  for (var i = 0; i < directions.length; i++) {
    var direction = directions[i];
    if (deg > direction[0] && deg < direction[1]) {
      enabled = true;
      break;
    }
  }
  if (enabled) {
    // 修正坐标
    this.x = this.lastX = clientX;
    this.y = this.lastY = clientY;
    this.t = this.lastT = Date.now();
    this.vx = this.lastVx = 0;
    this.vy = this.lastVy = 0;
    this.enabled = true;
    this.onStart(event);
    this.move(event);
  } else {
    this.disabled = true;
    this.cancel();
  }
};

TouchDirection.prototype.move = function(event) {
  if (this.delay) return this.cancel();
  if (!this.enabled) return this.start(event);
  var touchEvent = event.changedTouches ? event.changedTouches[0] : event;
  var clientX = touchEvent.clientX
  var clientY = touchEvent.clientY
  var timestamp = Date.now();
  var distanceX = clientX - this.x;
  var distanceY = clientY - this.y;
  var distanceT = timestamp - this.lastT;
  if (!this.lastVx || !this.lastVy || distanceT > COMPUTE_INTERVAL) {
    this.lastVx = (clientX - this.lastX) / distanceT || 0;
    this.lastVy = (clientY - this.lastY) / distanceT || 0;
  }
  this.lastX = clientX;
  this.lastY = clientY;
  this.lastT = Date.now();
  this.onMove(event, [clientX, clientY], [distanceX, distanceY]);
};

TouchDirection.prototype.stop = function(event) {
  if (this.delay) return this.cancel();
  if (!this.enabled) return this.destroy();
  var touchEvent = event.changedTouches ? event.changedTouches[0] : event;
  var clientX = touchEvent.clientX
  var clientY = touchEvent.clientY
  var distanceX = clientX - this.x;
  var distanceY = clientY - this.y;
  this.onStop(event, [clientX, clientY], [distanceX, distanceY], {
    velocityX: this.lastVx,
    velocityY: this.lastVy
  });
  this.destroy();
};

TouchDirection.prototype.cancel = function() {
  this.onCancel();
  this.destroy();
};

TouchDirection.prototype.active = function() {
  this.events = {
    cancel: Event.bindEvent(document, 'touchcancel', this.stop.bind(this)), // 取消当作终止操作
    stop: Event.bindEvent(document, 'touchend', this.stop.bind(this)),
    move: Event.bindEvent(document, 'touchmove', this.move.bind(this), {
      passive: false
    })
  };
};

TouchDirection.prototype.destroy = function() {
  var events = this.events;
  if (!events) return;
  if (events.cancel) {
    events.cancel.remove();
  }
  if (events.stop) {
    events.stop.remove();
  }
  if (events.move) {
    events.move.remove();
  }
  this.events = null;
  this.disabled = true;
  this.onDestroy();
};

export default TouchDirection;
