module.exports = intersectNode;

/**
 * @param node
 * @param point
 */
function intersectNode(node, point) {
  // console.info('Intersect Node');
  return node.intersect(point);
}
