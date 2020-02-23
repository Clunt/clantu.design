export function email(str) {
  var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return str.length < 100 && reg.test(str);
}

export function password(str) {
  return str.length >= 6 && str.length <= 100;
}

export function number(str) {
  var reg = /^\d+$/;
  return reg.test(str);
}

export function phone(str) {
  var reg = /^1(3|4|5|7|8)[0-9]{9}$/;
  return reg.test(str);
}
