export function string(len, clear) {
  var len = len || 32;
  var str = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  if (!clear) {
    str += '1ILilOo0'
  }
  var maxPos = str.length;
  var result = '';
  for (var i = 0; i < len; i += 1) {
    result += str.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function UUID() {
  // 8-4-4-4-12
  var UUID = [];
  var hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i++) {
    UUID[i] = hexDigits.charAt(Math.floor(Math.random() * 16));
  }
  UUID[8] = UUID[13] = UUID[18] = UUID[23] = '-';
  return UUID.join('');
}
