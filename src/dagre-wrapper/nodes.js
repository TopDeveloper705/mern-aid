import intersect from './intersect/index.js';
import { select } from 'd3';
import { logger } from '../logger'; // eslint-disable-line
import { labelHelper, updateNodeBounds, insertPolygonShape } from './shapes/util';
import { getConfig } from '../config';
import createLabel from './createLabel';
import note from './shapes/note';

const question = (parent, node) => {
  const { shapeSvg, bbox } = labelHelper(parent, node, undefined, true);

  const w = bbox.width + node.padding;
  const h = bbox.height + node.padding;
  const s = (w + h) * 0.9;
  const points = [
    { x: s / 2, y: 0 },
    { x: s, y: -s / 2 },
    { x: s / 2, y: -s },
    { x: 0, y: -s / 2 }
  ];

  const questionElem = insertPolygonShape(shapeSvg, s, s, points);
  updateNodeBounds(node, questionElem);
  node.intersect = function(point) {
    return intersect.polugon(node, points, point);
  };

  return shapeSvg;
};

const hexagon = (parent, node) => {
  const { shapeSvg, bbox } = labelHelper(parent, node, undefined, true);

  const f = 4;
  const h = bbox.height + node.padding;
  const m = h / f;
  const w = bbox.width + 2 * m + node.padding;
  const points = [
    { x: m, y: 0 },
    { x: w - m, y: 0 },
    { x: w, y: -h / 2 },
    { x: w - m, y: -h },
    { x: m, y: -h },
    { x: 0, y: -h / 2 }
  ];
  const hex = insertPolygonShape(shapeSvg, w, h, points);
  updateNodeBounds(node, hex);

  node.intersect = function(point) {
    return intersect.polygon(node, point);
  };

  return shapeSvg;
};

const rect_left_inv_arrow = (parent, node) => {
  const { shapeSvg, bbox } = labelHelper(parent, node, undefined, true);

  const w = bbox.width + node.padding;
  const h = bbox.height + node.padding;
  const points = [
    { x: -h / 2, y: 0 },
    { x: w, y: 0 },
    { x: w, y: -h },
    { x: -h / 2, y: -h },
    { x: 0, y: -h / 2 }
  ];

  const el = insertPolygonShape(shapeSvg, w, h, points);
  updateNodeBounds(node, el);

  node.intersect = function(point) {
    return intersect.polygon(node, point);
  };

  return shapeSvg;
};
const lean_right = (parent, node) => {
  const { shapeSvg, bbox } = labelHelper(parent, node, undefined, true);

  const w = bbox.width + node.padding;
  const h = bbox.height + node.padding;
  const points = [
    { x: (-2 * h) / 6, y: 0 },
    { x: w - h / 6, y: 0 },
    { x: w + (2 * h) / 6, y: -h },
    { x: h / 6, y: -h }
  ];

  const el = insertPolygonShape(shapeSvg, w, h, points);
  updateNodeBounds(node, el);

  node.intersect = function(point) {
    return intersect.polygon(node, point);
  };

  return shapeSvg;
};

const lean_left = (parent, node) => {
  const { shapeSvg, bbox } = labelHelper(parent, node, undefined, true);

  const w = bbox.width + node.padding;
  const h = bbox.height + node.padding;
  const points = [
    { x: (2 * h) / 6, y: 0 },
    { x: w + h / 6, y: 0 },
    { x: w - (2 * h) / 6, y: -h },
    { x: -h / 6, y: -h }
  ];

  const el = insertPolygonShape(shapeSvg, w, h, points);
  updateNodeBounds(node, el);

  node.intersect = function(point) {
    return intersect.polygon(node, point);
  };

  return shapeSvg;
};

const trapezoid = (parent, node) => {
  const { shapeSvg, bbox } = labelHelper(parent, node, undefined, true);

  const w = bbox.width + node.padding;
  const h = bbox.height + node.padding;
  const points = [
    { x: (-2 * h) / 6, y: 0 },
    { x: w + (2 * h) / 6, y: 0 },
    { x: w - h / 6, y: -h },
    { x: h / 6, y: -h }
  ];
  const el = insertPolygonShape(shapeSvg, w, h, points);
  updateNodeBounds(node, el);

  node.intersect = function(point) {
    return intersect.polygon(node, point);
  };

  return shapeSvg;
};

const inv_trapezoid = (parent, node) => {
  const { shapeSvg, bbox } = labelHelper(parent, node, undefined, true);

  const w = bbox.width + node.padding;
  const h = bbox.height + node.padding;
  const points = [
    { x: h / 6, y: 0 },
    { x: w - h / 6, y: 0 },
    { x: w + (2 * h) / 6, y: -h },
    { x: (-2 * h) / 6, y: -h }
  ];
  const el = insertPolygonShape(shapeSvg, w, h, points);
  updateNodeBounds(node, el);

  node.intersect = function(point) {
    return intersect.polygon(node, point);
  };

  return shapeSvg;
};
const rect_right_inv_arrow = (parent, node) => {
  const { shapeSvg, bbox } = labelHelper(parent, node, undefined, true);

  const w = bbox.width + node.padding;
  const h = bbox.height + node.padding;
  const points = [
    { x: 0, y: 0 },
    { x: w + h / 2, y: 0 },
    { x: w, y: -h / 2 },
    { x: w + h / 2, y: -h },
    { x: 0, y: -h }
  ];
  const el = insertPolygonShape(shapeSvg, w, h, points);
  updateNodeBounds(node, el);

  node.intersect = function(point) {
    return intersect.polygon(node, point);
  };

  return shapeSvg;
};
const cylinder = (parent, node) => {
  const { shapeSvg, bbox } = labelHelper(parent, node, undefined, true);

  const w = bbox.width + node.padding;
  const rx = w / 2;
  const ry = rx / (2.5 + w / 50);
  const h = bbox.height + ry + node.padding;

  const shape =
    'M 0,' +
    ry +
    ' a ' +
    rx +
    ',' +
    ry +
    ' 0,0,0 ' +
    w +
    ' 0 a ' +
    rx +
    ',' +
    ry +
    ' 0,0,0 ' +
    -w +
    ' 0 l 0,' +
    h +
    ' a ' +
    rx +
    ',' +
    ry +
    ' 0,0,0 ' +
    w +
    ' 0 l 0,' +
    -h;

  const el = shapeSvg
    .attr('label-offset-y', ry)
    .insert('path', ':first-child')
    .attr('d', shape)
    .attr('transform', 'translate(' + -w / 2 + ',' + -(h / 2 + ry) + ')');

  updateNodeBounds(node, el);

  node.intersect = function(point) {
    const pos = intersect.rect(node, point);
    const x = pos.x - node.x;

    if (
      rx != 0 &&
      (Math.abs(x) < node.width / 2 ||
        (Math.abs(x) == node.width / 2 && Math.abs(pos.y - node.y) > node.height / 2 - ry))
    ) {
      // ellipsis equation: x*x / a*a + y*y / b*b = 1
      // solve for y to get adjustion value for pos.y
      let y = ry * ry * (1 - (x * x) / (rx * rx));
      if (y != 0) y = Math.sqrt(y);
      y = ry - y;
      if (point.y - node.y > 0) y = -y;

      pos.y += y;
    }

    return pos;
  };

  return shapeSvg;
};

const rect = (parent, node) => {
  const { shapeSvg, bbox, halfPadding } = labelHelper(parent, node, 'node ' + node.classes, true);

  logger.trace('Classes = ', node.classes);
  // add the rect
  const rect = shapeSvg.insert('rect', ':first-child');

  rect
    .attr('class', 'basic label-container')
    .attr('rx', node.rx)
    .attr('ry', node.ry)
    .attr('x', -bbox.width / 2 - halfPadding)
    .attr('y', -bbox.height / 2 - halfPadding)
    .attr('width', bbox.width + node.padding)
    .attr('height', bbox.height + node.padding);

  updateNodeBounds(node, rect);

  node.intersect = function(point) {
    return intersect.rect(node, point);
  };

  return shapeSvg;
};
const rectWithTitle = (parent, node) => {
  // const { shapeSvg, bbox, halfPadding } = labelHelper(parent, node, 'node ' + node.classes);

  let classes;
  if (!node.classes) {
    classes = 'node default';
  } else {
    classes = 'node ' + node.classes;
  }
  // Add outer g element
  const shapeSvg = parent
    .insert('g')
    .attr('class', classes)
    .attr('id', node.id);

  // Create the title label and insert it after the rect
  const rect = shapeSvg.insert('rect', ':first-child');
  // const innerRect = shapeSvg.insert('rect');
  const innerLine = shapeSvg.insert('line');

  const label = shapeSvg.insert('g').attr('class', 'label');

  const text2 = node.labelText.flat();
  logger.info('Label text', text2[0]);

  const text = label.node().appendChild(createLabel(text2[0], node.labelStyle, true, true));
  let bbox;
  if (getConfig().flowchart.htmlLabels) {
    const div = text.children[0];
    const dv = select(text);
    bbox = div.getBoundingClientRect();
    dv.attr('width', bbox.width);
    dv.attr('height', bbox.height);
  }
  logger.info('Text 2', text2);
  const textRows = text2.slice(1, text2.length);
  let titleBox = text.getBBox();
  const descr = label
    .node()
    .appendChild(createLabel(textRows.join('<br/>'), node.labelStyle, true, true));

  if (getConfig().flowchart.htmlLabels) {
    const div = descr.children[0];
    const dv = select(descr);
    bbox = div.getBoundingClientRect();
    dv.attr('width', bbox.width);
    dv.attr('height', bbox.height);
  }
  // bbox = label.getBBox();
  // logger.info(descr);
  const halfPadding = node.padding / 2;
  select(descr).attr(
    'transform',
    'translate( ' +
      // (titleBox.width - bbox.width) / 2 +
      (bbox.width > titleBox.width ? 0 : (titleBox.width - bbox.width) / 2) +
      ', ' +
      (titleBox.height + halfPadding + 5) +
      ')'
  );
  select(text).attr(
    'transform',
    'translate( ' +
      // (titleBox.width - bbox.width) / 2 +
      (bbox.width < titleBox.width ? 0 : -(titleBox.width - bbox.width) / 2) +
      ', ' +
      0 +
      ')'
  );
  // Get the size of the label

  // Bounding box for title and text
  bbox = label.node().getBBox();

  // Center the label
  label.attr(
    'transform',
    'translate(' + -bbox.width / 2 + ', ' + (-bbox.height / 2 - halfPadding + 3) + ')'
  );

  rect
    .attr('class', 'outer title-state')
    .attr('x', -bbox.width / 2 - halfPadding)
    .attr('y', -bbox.height / 2 - halfPadding)
    .attr('width', bbox.width + node.padding)
    .attr('height', bbox.height + node.padding);

  innerLine
    .attr('class', 'divider')
    .attr('x1', -bbox.width / 2 - halfPadding)
    .attr('x2', bbox.width / 2 + halfPadding)
    .attr('y1', -bbox.height / 2 - halfPadding + titleBox.height + halfPadding)
    .attr('y2', -bbox.height / 2 - halfPadding + titleBox.height + halfPadding);

  updateNodeBounds(node, rect);

  node.intersect = function(point) {
    return intersect.rect(node, point);
  };

  return shapeSvg;
};

const stadium = (parent, node) => {
  const { shapeSvg, bbox } = labelHelper(parent, node, undefined, true);

  const h = bbox.height + node.padding;
  const w = bbox.width + h / 4 + node.padding;

  // add the rect
  const rect = shapeSvg
    .insert('rect', ':first-child')
    .attr('rx', h / 2)
    .attr('ry', h / 2)
    .attr('x', -w / 2)
    .attr('y', -h / 2)
    .attr('width', w)
    .attr('height', h);

  updateNodeBounds(node, rect);

  node.intersect = function(point) {
    return intersect.rect(node, point);
  };

  return shapeSvg;
};
const circle = (parent, node) => {
  const { shapeSvg, bbox, halfPadding } = labelHelper(parent, node, undefined, true);
  const circle = shapeSvg.insert('circle', ':first-child');

  // center the circle around its coordinate
  circle
    .attr('rx', node.rx)
    .attr('ry', node.ry)
    .attr('r', bbox.width / 2 + halfPadding)
    .attr('width', bbox.width + node.padding)
    .attr('height', bbox.height + node.padding);

  updateNodeBounds(node, circle);

  node.intersect = function(point) {
    return intersect.circle(node, point);
  };

  return shapeSvg;
};

const subroutine = (parent, node) => {
  const { shapeSvg, bbox } = labelHelper(parent, node, undefined, true);

  const w = bbox.width + node.padding;
  const h = bbox.height + node.padding;
  const points = [
    { x: 0, y: 0 },
    { x: w, y: 0 },
    { x: w, y: -h },
    { x: 0, y: -h },
    { x: 0, y: 0 },
    { x: -8, y: 0 },
    { x: w + 8, y: 0 },
    { x: w + 8, y: -h },
    { x: -8, y: -h },
    { x: -8, y: 0 }
  ];
  const el = insertPolygonShape(shapeSvg, w, h, points);
  updateNodeBounds(node, el);

  node.intersect = function(point) {
    return intersect.polygon(node, point);
  };

  return shapeSvg;
};

const start = (parent, node) => {
  const shapeSvg = parent
    .insert('g')
    .attr('class', 'node default')
    .attr('id', node.id);
  const circle = shapeSvg.insert('circle', ':first-child');

  // center the circle around its coordinate
  circle
    .attr('class', 'state-start')
    .attr('r', 7)
    .attr('width', 14)
    .attr('height', 14);

  updateNodeBounds(node, circle);

  node.intersect = function(point) {
    return intersect.circle(node, point);
  };

  return shapeSvg;
};

const forkJoin = (parent, node, dir) => {
  const shapeSvg = parent
    .insert('g')
    .attr('class', 'node default')
    .attr('id', node.id);

  let width = 70;
  let height = 10;

  if (dir === 'LR') {
    width = 10;
    height = 70;
  }

  const shape = shapeSvg
    .append('rect')
    .style('stroke', 'black')
    .style('fill', 'black')
    .attr('x', (-1 * width) / 2)
    .attr('y', (-1 * height) / 2)
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'fork-join');

  updateNodeBounds(node, shape);
  node.height = node.height + node.padding / 2;
  node.width = node.width + node.padding / 2;
  node.intersect = function(point) {
    return intersect.rect(node, point);
  };

  return shapeSvg;
};

const end = (parent, node) => {
  const shapeSvg = parent
    .insert('g')
    .attr('class', 'node default')
    .attr('id', node.id);
  const innerCircle = shapeSvg.insert('circle', ':first-child');
  const circle = shapeSvg.insert('circle', ':first-child');

  circle
    .attr('class', 'state-start')
    .attr('r', 7)
    .attr('width', 14)
    .attr('height', 14);

  innerCircle
    .attr('class', 'state-end')
    .attr('r', 5)
    .attr('width', 10)
    .attr('height', 10);

  updateNodeBounds(node, circle);

  node.intersect = function(point) {
    return intersect.circle(node, point);
  };

  return shapeSvg;
};

const shapes = {
  question,
  rect,
  rectWithTitle,
  circle,
  stadium,
  hexagon,
  rect_left_inv_arrow,
  lean_right,
  lean_left,
  trapezoid,
  inv_trapezoid,
  rect_right_inv_arrow,
  cylinder,
  start,
  end,
  note,
  subroutine,
  fork: forkJoin,
  join: forkJoin
};

let nodeElems = {};

export const insertNode = (elem, node, dir) => {
  nodeElems[node.id] = shapes[node.shape](elem, node, dir);
};
export const setNodeElem = (elem, node) => {
  nodeElems[node.id] = elem;
};
export const clear = () => {
  nodeElems = {};
};

export const positionNode = node => {
  const el = nodeElems[node.id];
  logger.trace(
    'Transforming node',
    node,
    'translate(' + (node.x - node.width / 2 - 5) + ', ' + (node.y - node.height / 2 - 5) + ')'
  );
  const padding = 8;
  if (node.clusterNode) {
    el.attr(
      'transform',
      'translate(' +
        (node.x - node.width / 2 - padding) +
        ', ' +
        (node.y - node.height / 2 - padding) +
        ')'
    );
  } else {
    el.attr('transform', 'translate(' + node.x + ', ' + node.y + ')');
  }
};
