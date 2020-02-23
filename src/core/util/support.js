export let touch = 'ontouchend' in window.document ? true : false;

export let webp = (function() {
  var img = new Image();
  img.onload = img.onerror = function(){
    webp = img.height == 1;
  };
  img.src = 'data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBoAAAAwAQCdASoBAAEAAAAMJaQAA3AA/v89WAAAAA==';
  return false;
})();

export let translate3d = (function() {
  if (!window.getComputedStyle) return false;

  var el = document.createElement('p'),
    has3d,
    transforms = {
      'webkitTransform': '-webkit-transform',
      'OTransform': '-o-transform',
      'msTransform': '-ms-transform',
      'MozTransform': '-moz-transform',
      'transform': 'transform'
    };

  document.body.insertBefore(el, null);

  for (var t in transforms) {
    if (el.style[t] !== undefined) {
      el.style[t] = "translate3d(1px,1px,1px)";
      has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
    }
  }

  document.body.removeChild(el);

  return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
})();

export let directory = (function() {
  var input = document.createElement('input');
  input.type = 'file';
  var support = ('webkitdirectory' in input || 'directory' in input) && 'multiple' in input ? true : false;
  try {
    document.body.removeChild(input);
  } catch (e) {}
  return support
})();
