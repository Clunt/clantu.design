var getPosition = {
  area_top_top: function(a, b, c, x, y, z, m, n) {
    return {
      type: 'top',
      attr: 'top',
      value: x - n,
      suit: n < x
    };
  },
  area_top_bottom: function(a, b, c, x, y, z, m, n) {
    return {
      type: 'bottom',
      attr: 'top',
      value: x + y,
      suit: n < z
    };
  },
  area_top_over: function(a, b, c, x, y, z, m, n) {
    return {
      type: 'over',
      attr: 'top',
      value: Math.max(x + y + z - n, 0),
      suit: true
    };
  },
  area_left_left: function(a, b, c, x, y, z, m, n) {
    return {
      type: 'left',
      attr: 'left',
      value: a - m,
      suit: m < a
    };
  },
  area_left_right: function(a, b, c, x, y, z, m, n) {
    return {
      type: 'right',
      attr: 'left',
      value: a + b,
      suit: m < c
    };
  },
  area_left_over: function(a, b, c, x, y, z, m, n) {
    return {
      type: 'over',
      attr: 'left',
      value: Math.max(a + b + c - m, 0),
      suit: true
    };
  },
  align_top_top: function(a, b, c, x, y, z, m, n) {
    return {
      type: 'top',
      attr: 'top',
      value: Math.max(x, 0),
      suit: n < y + z
    };
  },
  align_top_bottom: function(a, b, c, x, y, z, m, n) {
    return {
      type: 'bottom',
      attr: 'top',
      value: z < 0 ? x + y + z - n : x + y - n,
      suit: n < x + y
    };
  },
  align_top_middle: function(a, b, c, x, y, z, m, n) {
    return {
      type: 'middle',
      attr: 'top',
      value: x - (n - y) / 2,
      suit: (n - y) / 2 < Math.min(x, z)
    };
  },
  align_top_over: function(a, b, c, x, y, z, m, n) {
    return {
      type: 'over',
      attr: 'top',
      value: Math.max(x + y + z - n, 0),
      suit: true
    };
  },
  align_left_left: function(a, b, c, x, y, z, m, n) {
    return {
      type: 'left',
      attr: 'left',
      value: Math.max(a, 0),
      suit: m < b + c
    };
  },
  align_left_right: function(a, b, c, x, y, z, m, n) {
    return {
      type: 'right',
      attr: 'left',
      value: c < 0 ? a + b + c - m : a + b - m,
      suit: m < a + b
    };
  },
  align_left_center: function(a, b, c, x, y, z, m, n) {
    return {
      type: 'center',
      attr: 'left',
      value: a - (m - b) / 2,
      suit: (m - b) / 2 < Math.min(a, c)
    };
  },
  align_left_over: function(a, b, c, x, y, z, m, n) {
    return {
      type: 'over',
      attr: 'left',
      value: Math.max(a + b + c - m, 0),
      suit: true
    };
  }
};

/**
 * @param  {[type]} source    [description]
 * @param  {[type]} target    [description]
 * @param  {[type]} view      [description]
 * @param  {[type]} placement [description]
 * @param  {[type]} adjust    [横向自动 left, 纵向自动 top]
 * @return {[type]}           [description]
 */
export default function(target, source, view, placement, adjust) {
  adjust = Array.isArray(adjust) ? adjust : [adjust, adjust];
  var adjustX = adjust[0];
  var adjustY = adjust[1];

  var a = target.left;
  var b = target.width;
  var c = view.width - a - b;
  var x = target.top;
  var y = target.height;
  var z = view.height - x - y;
  var m = source.width;
  var n = source.height;

  // default bottomLeft
  var queue = {
    area: adjustY ? ['top_bottom', 'top_top', 'top_over'] : ['top_bottom'],
    align: adjustX ? ['left_left', 'left_right', 'left_center', 'left_over'] : ['left_left']
  };

  switch (placement) {
    case 'top':
      queue = {
        area: adjustY ? ['top_top', 'top_bottom', 'top_over'] : ['top_top'],
        align: adjustX ? ['left_center', 'left_left', 'left_right', 'left_over'] : ['left_center']
      };
      break;
    case 'topLeft':
      queue = {
        area: adjustY ? ['top_top', 'top_bottom', 'top_over'] : ['top_top'],
        align: adjustX ? ['left_left', 'left_right', 'left_center', 'left_over'] : ['left_left']
      };
      break;
    case 'topRight':
      queue = {
        area: adjustY ? ['top_top', 'top_bottom', 'top_over'] : ['top_top'],
        align: adjustX ? ['left_right', 'left_left', 'left_center', 'left_over'] : ['left_right']
      };
      break;
    case 'bottom':
      queue = {
        area: adjustY ? ['top_bottom', 'top_top', 'top_over'] : ['top_bottom'],
        align: adjustX ? ['left_center', 'left_left', 'left_right', 'left_over'] : ['left_center']
      };
      break;
    case 'bottomLeft':
      queue = {
        area: adjustY ? ['top_bottom', 'top_top', 'top_over'] : ['top_bottom'],
        align: adjustX ? ['left_left', 'left_right', 'left_center', 'left_over'] : ['left_left']
      };
      break;
    case 'bottomRight':
      queue = {
        area: adjustY ? ['top_bottom', 'top_top', 'top_over'] : ['top_bottom'],
        align: adjustX ? ['left_right', 'left_left', 'left_center', 'left_over'] : ['left_right']
      };
      break;
    case 'left':
      queue = {
        area: adjustX ? ['left_left', 'left_right', 'left_over'] : ['left_left'],
        align: adjustY ? ['top_middle', 'top_top', 'top_bottom', 'top_over'] : ['top_middle']
      };
      break;
    case 'leftTop':
      queue = {
        area: adjustX ? ['left_left', 'left_right', 'left_over'] : ['left_left'],
        align: adjustY ? ['top_top', 'top_bottom', 'top_middle', 'top_over'] : ['top_top']
      };
      break;
    case 'leftBottom':
      queue = {
        area: adjustX ? ['left_left', 'left_right', 'left_over'] : ['left_left'],
        align: adjustY ? ['top_bottom', 'top_top', 'top_middle', 'top_over'] : ['top_bottom']
      };
      break;
    case 'right':
      queue = {
        area: adjustX ? ['left_right', 'left_left', 'left_over'] : ['left_right'],
        align: adjustY ? ['top_middle', 'top_top', 'top_bottom', 'top_over'] : ['top_middle']
      };
      break;
    case 'rightTop':
      queue = {
        area: adjustX ? ['left_right', 'left_left', 'left_over'] : ['left_right'],
        align: adjustY ? ['top_top', 'top_bottom', 'top_middle', 'top_over'] : ['top_top']
      };
      break;
    case 'rightBottom':
      queue = {
        area: adjustX ? ['left_right', 'left_left', 'left_over'] : ['left_right'],
        align: adjustY ? ['top_bottom', 'top_top', 'top_middle', 'top_over'] : ['top_bottom']
      };
      break;
  }

  var area;
  for (var i = 0; i < queue.area.length; i++) {
    area = getPosition['area_' + queue.area[i]](a, b, c, x, y, z, m, n);
    if (area.suit) break;
  }
  var align;
  for (var j = 0; j < queue.align.length; j++) {
    align = getPosition['align_' + queue.align[j]](a, b, c, x, y, z, m, n);
    if (align.suit) break;
  }

  var typeReg = /^(top|left|bottom|right)$/;
  var noneReg = /^over$/;
  var type = noneReg.test(align.type) ? 'over' : area.type;
  if (typeReg.test(area.type) && typeReg.test(align.type)) {
    type += align.type.substring(0, 1).toUpperCase() + align.type.substring(1);
  }

  var position = {
    type: type
  };
  position[area.attr] = area.value;
  position[align.attr] = align.value;

  return position;
};
