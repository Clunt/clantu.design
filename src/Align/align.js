import { getWindowSize } from '../core/util/dom';
import placement from './placement';
import isElementVisible from './isElementVisible';


// t b c
// l r c
// 根据可视宽度调整宽高，且支持设置最小宽高
// 设置偏移量
// 设置箭头指向
// ————————————————————
// |·0/0·|·0/1·|·0/2·|
// |—————|—————|—————|
// |·1/0·|·1/1·|·1/2·|
// |—————|—————|—————|
// |·2/0·|·2/1·|·2/2·|
// ————————————————————



/**
 * Align source to target
 * @param  {Object} source
 * @param  {Object} target
 * @param  {String} type   Align type
 * @param  {Boolean/Object} adjust true, false, [adjustX, adjustY]
 * @return {Array}        [type:String, style:Object]
 */
export default function(target, source, type, adjust, space) {
  if (!source) return null;
  var overlapRectangles = Array.isArray(target) ? target : isElementVisible(target);
  if (!overlapRectangles) return null;


  var viewSize = getWindowSize();
  var sourceRect = source.getBoundingClientRect();
  if (typeof space === 'number') {
    space = [
      space < 1 ? viewSize[0] * space : space,
      space < 1 ? viewSize[1] * space : space
    ];
  } else if (Array.isArray(space) && typeof space[0] === 'number' && typeof space[1] === 'number') {
    space = [
      space[0] < 1 ? viewSize[0] * space[0] : space[0],
      space[1] < 1 ? viewSize[1] * space[1] : space[1]
    ];
  } else {
    space = [0, 0];
  }

  var position = placement({
    top: overlapRectangles[0] - space[1],
    left: overlapRectangles[1] - space[0],
    width: overlapRectangles[2],
    height: overlapRectangles[3]
  }, sourceRect, {
    width: viewSize[0] - space[0] * 2,
    height: viewSize[1] - space[1] * 2
  }, type, adjust, space);

  return [position.type, position.top + space[1], position.left + space[0]];
};
