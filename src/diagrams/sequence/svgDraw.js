import common from '../common/common';

export const drawRect = function(elem, rectData) {
  const rectElem = elem.append('rect');
  rectElem.attr('x', rectData.x);
  rectElem.attr('y', rectData.y);
  rectElem.attr('fill', rectData.fill);
  rectElem.attr('stroke', rectData.stroke);
  rectElem.attr('width', rectData.width);
  rectElem.attr('height', rectData.height);
  rectElem.attr('rx', rectData.rx);
  rectElem.attr('ry', rectData.ry);

  if (typeof rectData.class !== 'undefined') {
    rectElem.attr('class', rectData.class);
  }

  return rectElem;
};

export const drawText = function(elem, textData) {
  let prevTextHeight = 0,
    textHeight = 0;
  const lines = textData.wrap
    ? textData.text.split(common.lineBreakRegex)
    : [textData.text.replace(common.lineBreakRegex, ' ')];

  let textElems = [];
  let dy = 0;
  let yfunc = () => textData.y;
  if (
    typeof textData.valign !== 'undefined' &&
    typeof textData.textMargin !== 'undefined' &&
    textData.textMargin > 0
  ) {
    switch (textData.valign) {
      case 'top':
      case 'start':
        yfunc = () => textData.y + textData.textMargin;
        break;
      case 'middle':
      case 'center':
        yfunc = () => textData.y + (prevTextHeight + textHeight + textData.textMargin) / 2;
        break;
      case 'bottom':
      case 'end':
        yfunc = () =>
          textData.y +
          (prevTextHeight + textHeight + 2 * textData.textMargin) -
          textData.textMargin;
        break;
    }
  }
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (
      typeof textData.textMargin !== 'undefined' &&
      textData.textMargin === 0 &&
      typeof textData.fontSize !== 'undefined'
    ) {
      dy = i * textData.fontSize;
    }

    const textElem = elem.append('text');
    textElem.attr('x', textData.x);
    textElem.attr('y', yfunc());
    if (typeof textData.anchor !== 'undefined') {
      textElem.style('text-anchor', textData.anchor);
    }
    if (typeof textData.fontFamily !== 'undefined') {
      textElem.style('font-family', textData.fontFamily);
    }
    if (typeof textData.fontSize !== 'undefined') {
      textElem.style('font-size', textData.fontSize);
    }
    if (typeof textData.fontWeight !== 'undefined') {
      textElem.style('font-weight', textData.fontWeight);
    }
    if (typeof textData.fill !== 'undefined') {
      textElem.attr('fill', textData.fill);
    }
    if (typeof textData.class !== 'undefined') {
      textElem.attr('class', textData.class);
    }
    if (typeof textData.dy !== 'undefined') {
      textElem.attr('dy', textData.dy);
    } else if (dy !== 0) {
      textElem.attr('dy', dy);
    }

    const span = textElem.append('tspan');
    span.attr('x', textData.x);
    if (typeof textData.fill !== 'undefined') {
      span.attr('fill', textData.fill);
    }
    span.text(line);

    if (
      typeof textData.valign !== 'undefined' &&
      typeof textData.textMargin !== 'undefined' &&
      textData.textMargin > 0
    ) {
      textHeight += (textElem._groups || textElem)[0][0].getBBox().height;
      prevTextHeight = textHeight;
    }

    textElems.push(textElem);
  }

  return textElems.length === 1 ? textElems[0] : textElems;
};

export const drawLabel = function(elem, txtObject) {
  function genPoints(x, y, width, height, cut) {
    return (
      x +
      ',' +
      y +
      ' ' +
      (x + width) +
      ',' +
      y +
      ' ' +
      (x + width) +
      ',' +
      (y + height - cut) +
      ' ' +
      (x + width - cut * 1.2) +
      ',' +
      (y + height) +
      ' ' +
      x +
      ',' +
      (y + height)
    );
  }
  const polygon = elem.append('polygon');
  polygon.attr('points', genPoints(txtObject.x, txtObject.y, 50, 20, 7));
  polygon.attr('class', 'labelBox');

  txtObject.y = txtObject.y + txtObject.labelMargin;
  txtObject.x = txtObject.x + 0.5 * txtObject.labelMargin;
  return drawText(elem, txtObject);
};

let actorCnt = -1;
/**
 * Draws an actor in the diagram with the attaced line
 * @param elem - The diagram we'll draw to.
 * @param actor - The actor to draw.
 * @param conf - utils.drawText implementation discriminator object
 */
export const drawActor = function(elem, actor, conf) {
  const center = actor.x + actor.width / 2;

  const g = elem.append('g');
  if (actor.y === 0) {
    actorCnt++;
    g.append('line')
      .attr('id', 'actor' + actorCnt)
      .attr('x1', center)
      .attr('y1', 5)
      .attr('x2', center)
      .attr('y2', 2000)
      .attr('class', 'actor-line')
      .attr('stroke-width', '0.5px')
      .attr('stroke', '#999');
  }

  const rect = getNoteRect();
  rect.x = actor.x;
  rect.y = actor.y;
  rect.fill = '#eaeaea';
  rect.width = actor.width;
  rect.height = actor.height;
  rect.class = 'actor';
  rect.rx = 3;
  rect.ry = 3;
  drawRect(g, rect);

  _drawTextCandidateFunc(conf)(
    actor.description,
    g,
    rect.x,
    rect.y,
    rect.width,
    rect.height,
    { class: 'actor' },
    conf
  );
};

export const anchorElement = function(elem) {
  return elem.append('g');
};
/**
 * Draws an activation in the diagram
 * @param elem - element to append activation rect.
 * @param bounds - activation box bounds.
 * @param verticalPos - precise y cooridnate of bottom activation box edge.
 * @param conf - sequence diagram config object.
 * @param actorActivations - number of activations on the actor.
 */
export const drawActivation = function(elem, bounds, verticalPos, conf, actorActivations) {
  const rect = getNoteRect();
  const g = bounds.anchored;
  rect.x = bounds.startx;
  rect.y = bounds.starty;
  rect.class = 'activation' + (actorActivations % 3); // Will evaluate to 0, 1 or 2
  rect.width = bounds.stopx - bounds.startx;
  rect.height = verticalPos - bounds.starty;
  drawRect(g, rect);
};

/**
 * Draws a loop in the diagram
 * @param elem - elemenet to append the loop to.
 * @param bounds - bounds of the given loop.
 * @param labelText - Text within the loop.
 * @param conf
 */
export const drawLoop = function(elem, bounds, labelText, conf) {
  const g = elem.append('g');
  const drawLoopLine = function(startx, starty, stopx, stopy) {
    return g
      .append('line')
      .attr('x1', startx)
      .attr('y1', starty)
      .attr('x2', stopx)
      .attr('y2', stopy)
      .attr('class', 'loopLine');
  };
  drawLoopLine(bounds.startx, bounds.starty, bounds.stopx, bounds.starty);
  drawLoopLine(bounds.stopx, bounds.starty, bounds.stopx, bounds.stopy);
  drawLoopLine(bounds.startx, bounds.stopy, bounds.stopx, bounds.stopy);
  drawLoopLine(bounds.startx, bounds.starty, bounds.startx, bounds.stopy);
  if (typeof bounds.sections !== 'undefined') {
    bounds.sections.forEach(function(item) {
      drawLoopLine(bounds.startx, item, bounds.stopx, item).style('stroke-dasharray', '3, 3');
    });
  }

  let minSize =
    Math.round((3 * conf.messageFontSize) / 4) < 10
      ? conf.messageFontSize
      : Math.round((3 * conf.messageFontSize) / 4);

  let txt = getTextObj();
  txt.text = labelText;
  txt.x = bounds.startx;
  txt.y = bounds.starty;
  txt.labelMargin = 1.5 * 10; // This is the small box that says "loop"
  txt.fontFamily = conf.messageFontFamily;
  txt.fontSize = minSize;
  txt.fontWeight = conf.messageFontWeight;
  txt.class = 'labelText'; // Its size & position are fixed.

  let labelElem = drawLabel(g, txt);
  let labelBoxWidth = (labelElem._groups || labelElem)[0][0].getBBox().width;
  txt = getTextObj();
  txt.text = bounds.title;
  txt.x = bounds.startx + (bounds.stopx - bounds.startx) / 2 + labelBoxWidth;
  txt.y = bounds.starty + conf.boxMargin + conf.boxTextMargin;
  txt.anchor = 'middle';
  txt.class = 'loopText';
  txt.fontFamily = conf.messageFontFamily;
  txt.fontSize = minSize;
  txt.fontWeight = conf.messageFontWeight;
  txt.wrap = true;

  drawText(g, txt);

  if (typeof bounds.sectionTitles !== 'undefined') {
    bounds.sectionTitles.forEach(function(item, idx) {
      if (item.message) {
        txt.text = item.message;
        txt.x = bounds.startx + (bounds.stopx - bounds.startx) / 2;
        txt.y = bounds.sections[idx] + conf.boxMargin + conf.boxTextMargin;
        txt.class = 'loopText';
        txt.anchor = 'middle';
        txt.fontFamily = conf.messageFontFamily;
        txt.fontSize = minSize;
        txt.fontWeight = conf.messageFontWeight;
        txt.wrap = bounds.wrap;
        drawText(g, txt);
      }
    });
  }

  return g;
};

/**
 * Draws a background rectangle
 * @param elem diagram (reference for bounds)
 * @param bounds shape of the rectangle
 */
export const drawBackgroundRect = function(elem, bounds) {
  const rectElem = drawRect(elem, {
    x: bounds.startx,
    y: bounds.starty,
    width: bounds.stopx - bounds.startx,
    height: bounds.stopy - bounds.starty,
    fill: bounds.fill,
    class: 'rect'
  });
  rectElem.lower();
};
/**
 * Setup arrow head and define the marker. The result is appended to the svg.
 */
export const insertArrowHead = function(elem) {
  elem
    .append('defs')
    .append('marker')
    .attr('id', 'arrowhead')
    .attr('refX', 5)
    .attr('refY', 2)
    .attr('markerWidth', 6)
    .attr('markerHeight', 4)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M 0,0 V 4 L6,2 Z'); // this is actual shape for arrowhead
};
/**
 * Setup node number. The result is appended to the svg.
 */
export const insertSequenceNumber = function(elem) {
  elem
    .append('defs')
    .append('marker')
    .attr('id', 'sequencenumber')
    .attr('refX', 15)
    .attr('refY', 15)
    .attr('markerWidth', 60)
    .attr('markerHeight', 40)
    .attr('orient', 'auto')
    .append('circle')
    .attr('cx', 15)
    .attr('cy', 15)
    .attr('r', 6);
  // .style("fill", '#f00');
};
/**
 * Setup arrow head and define the marker. The result is appended to the svg.
 */
export const insertArrowCrossHead = function(elem) {
  const defs = elem.append('defs');
  const marker = defs
    .append('marker')
    .attr('id', 'crosshead')
    .attr('markerWidth', 15)
    .attr('markerHeight', 8)
    .attr('orient', 'auto')
    .attr('refX', 16)
    .attr('refY', 4);

  // The arrow
  marker
    .append('path')
    .attr('fill', 'black')
    .attr('stroke', '#000000')
    .style('stroke-dasharray', '0, 0')
    .attr('stroke-width', '1px')
    .attr('d', 'M 9,2 V 6 L16,4 Z');

  // The cross
  marker
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', '#000000')
    .style('stroke-dasharray', '0, 0')
    .attr('stroke-width', '1px')
    .attr('d', 'M 0,1 L 6,7 M 6,1 L 0,7');
  // this is actual shape for arrowhead
};

export const getTextObj = function() {
  return {
    x: 0,
    y: 0,
    fill: undefined,
    anchor: 'start',
    style: '#666',
    width: 100,
    height: 100,
    textMargin: 0,
    rx: 0,
    ry: 0,
    valign: undefined
  };
};

export const getNoteRect = function() {
  return {
    x: 0,
    y: 0,
    fill: '#EDF2AE',
    stroke: '#666',
    width: 100,
    anchor: 'start',
    height: 100,
    rx: 0,
    ry: 0
  };
};

const _drawTextCandidateFunc = (function() {
  function byText(content, g, x, y, width, height, textAttrs) {
    const text = g
      .append('text')
      .attr('x', x + width / 2)
      .attr('y', y + height / 2 + 5)
      .style('text-anchor', 'middle')
      .text(content);
    _setTextAttrs(text, textAttrs);
  }

  function byTspan(content, g, x, y, width, height, textAttrs, conf) {
    const { actorFontSize, actorFontFamily, actorFontWeight } = conf;

    const lines = content.split(common.lineBreakRegex);
    for (let i = 0; i < lines.length; i++) {
      const dy = i * actorFontSize - (actorFontSize * (lines.length - 1)) / 2;
      const text = g
        .append('text')
        .attr('x', x + width / 2)
        .attr('y', y)
        .style('text-anchor', 'middle')
        .style('font-size', actorFontSize)
        .style('font-weight', actorFontWeight)
        .style('font-family', actorFontFamily);
      text
        .append('tspan')
        .attr('x', x + width / 2)
        .attr('dy', dy)
        .text(lines[i]);

      text
        .attr('y', y + height / 2.0)
        .attr('dominant-baseline', 'central')
        .attr('alignment-baseline', 'central');

      _setTextAttrs(text, textAttrs);
    }
  }

  function byFo(content, g, x, y, width, height, textAttrs, conf) {
    const s = g.append('switch');
    const f = s
      .append('foreignObject')
      .attr('x', x)
      .attr('y', y)
      .attr('width', width)
      .attr('height', height);

    const text = f
      .append('div')
      .style('display', 'table')
      .style('height', '100%')
      .style('width', '100%');

    text
      .append('div')
      .style('display', 'table-cell')
      .style('text-align', 'center')
      .style('vertical-align', 'middle')
      .text(content);

    byTspan(content, s, x, y, width, height, textAttrs, conf);
    _setTextAttrs(text, textAttrs);
  }

  function _setTextAttrs(toText, fromTextAttrsDict) {
    for (const key in fromTextAttrsDict) {
      if (fromTextAttrsDict.hasOwnProperty(key)) { // eslint-disable-line
        toText.attr(key, fromTextAttrsDict[key]);
      }
    }
  }

  return function(conf) {
    return conf.textPlacement === 'fo' ? byFo : conf.textPlacement === 'old' ? byText : byTspan;
  };
})();

export default {
  drawRect,
  drawText,
  drawLabel,
  drawActor,
  anchorElement,
  drawActivation,
  drawLoop,
  drawBackgroundRect,
  insertArrowHead,
  insertSequenceNumber,
  insertArrowCrossHead,
  getTextObj,
  getNoteRect
};
