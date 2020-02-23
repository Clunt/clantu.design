var INTERVAL = 1000 / 60;

function cubicBezier(cubic_bezier, t) {
  // P0 * Math.pow(1 - t, 3) + 3 * P1 * t * Math.pow(1 - t, 2) + 3 * P2 * Math.pow(t, 2) * (1 - t) + P3 * Math.pow(t, 3)
  cubic_bezier = Array.isArray(cubic_bezier) && cubic_bezier.length === 4 ? cubic_bezier : [0, 0, 1, 1];
  return 3 * cubic_bezier[1] * t * Math.pow(1 - t, 2) + 3 * cubic_bezier[3] * Math.pow(t, 2) * (1 - t) + Math.pow(t, 3);
}

export default function(initial_values, final_values, duration, callback) {
  initial_values = Array.isArray(initial_values) ? initial_values : [initial_values];
  final_values = Array.isArray(final_values) ? final_values : [final_values];
  var cubic_beziers = Array.prototype.slice.call(arguments).splice(4);
  var cubic_bezier = cubic_beziers[cubic_beziers.length - 1];
  var values = final_values.map(function(value, index) {
    return value - (initial_values[index] || 0);
  });
  var total = Math.round(duration / INTERVAL);
  var times = 0;
  function loop() {
    if (++times >= total) return callback(final_values, 1, true);
    var t = times / total;
    var current_values = values.map(function(value, index) {
      return values[index] * cubicBezier(cubic_beziers[index] || cubic_bezier, t) + (initial_values[index] || 0);
    });
    if (callback(current_values, t)) return;
    requestAnimationFrame(loop);
  }
  loop();
}
