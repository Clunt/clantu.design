// [width, height]
// type
//   contain
export default function(outer, inner, type) {
  var rect = [0, 0, 0, 0, false];
  if (typeof outer !== 'object' || typeof inner !== 'object') return rect;
  var outerWidth = Math.max(outer[0] || 0, 0);
  var outerHeight = Math.max(outer[1] || 0, 0);
  var innerWidth = Math.max(inner[0] || 0, 0);
  var innerHeight = Math.max(inner[1] || 0, 0);
  if (!outerWidth * outerHeight * innerWidth * innerHeight) return rect;
  var scale = innerWidth > outerWidth || innerHeight > outerHeight;
  if (innerWidth > outerWidth || innerHeight > outerHeight) {
    if (innerWidth / innerHeight > outerWidth / outerHeight) {
      innerHeight = Math.max(Math.round(outerWidth * innerHeight / innerWidth), 1);
      innerWidth = outerWidth;
    } else {
      innerWidth = Math.max(Math.round(outerHeight * innerWidth / innerHeight), 1);
      innerHeight = outerHeight;
    }
  }
  return [(outerWidth - innerWidth) / 2, (outerHeight - innerHeight) / 2, innerWidth, innerHeight, scale];
};
