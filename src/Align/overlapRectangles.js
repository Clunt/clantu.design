/**
 * 判断两个矩形是否相交，并且返回相交区域坐标参数
 * @param  {Object}  ra      [top, left, width, height]
 * @param  {Object}  rb
 * @return {Object|Boolean}  [top, left, width, height] || null
 */
export default function overlapRectangles(ra, rb) {
  rb = rb || ra;
  // [tl, br] -> [x, y]
  var raCoords = [
    [ra[1], ra[0]],
    [ra[1] + ra[2], ra[0] + ra[3]]
  ];
  var rbCoords = [
    [rb[1], rb[0]],
    [rb[1] + rb[2], rb[0] + rb[3]]
  ];
  var rcCoords = [
    [Math.max(raCoords[0][0], rbCoords[0][0]), Math.max(raCoords[0][1], rbCoords[0][1])],
    [Math.min(raCoords[1][0], rbCoords[1][0]), Math.min(raCoords[1][1], rbCoords[1][1])]
  ];

  return rcCoords[0][0] >= rcCoords[1][0] || rcCoords[0][1] >= rcCoords[1][1] ? null : [
    rcCoords[0][1],
    rcCoords[0][0],
    rcCoords[1][0] - rcCoords[0][0],
    rcCoords[1][1] - rcCoords[0][1]
  ];
};
