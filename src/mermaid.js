/**
 * Web page integration module for the mermaid framework. It uses the mermaidAPI for mermaid functionality and to render
 * the diagrams to svg code.
 */
// import { decode } from 'he';
import decode from 'entity-decode/browser';
import mermaidAPI from './mermaidAPI';
import { logger } from './logger';
import utils from './utils';

/**
 * ## init
 * Function that goes through the document to find the chart definitions in there and render them.
 *
 * The function tags the processed attributes with the attribute data-processed and ignores found elements with the
 * attribute already set. This way the init function can be triggered several times.
 *
 * Optionally, `init` can accept in the second argument one of the following:
 * - a DOM Node
 * - an array of DOM nodes (as would come from a jQuery selector)
 * - a W3C selector, a la `.mermaid`
 *
 * ```mermaid
 * graph LR;
 *  a(Find elements)-->b{Processed}
 *  b-->|Yes|c(Leave element)
 *  b-->|No |d(Transform)
 * ```
 * Renders the mermaid diagrams
 * @param nodes a css selector or an array of nodes
 */
const init = function() {
  const conf = mermaidAPI.getConfig();
  logger.debug('Starting rendering diagrams');
  let nodes;
  if (arguments.length >= 2) {
    /*! sequence config was passed as #1 */
    if (typeof arguments[0] !== 'undefined') {
      mermaid.sequenceConfig = arguments[0];
    }

    nodes = arguments[1];
  } else {
    nodes = arguments[0];
  }

  // if last argument is a function this is the callback function
  let callback;
  if (typeof arguments[arguments.length - 1] === 'function') {
    callback = arguments[arguments.length - 1];
    logger.debug('Callback function found');
  } else {
    if (typeof conf.mermaid !== 'undefined') {
      if (typeof conf.mermaid.callback === 'function') {
        callback = conf.mermaid.callback;
        logger.debug('Callback function found');
      } else {
        logger.debug('No Callback function found');
      }
    }
  }
  nodes =
    nodes === undefined
      ? document.querySelectorAll('.mermaid')
      : typeof nodes === 'string'
      ? document.querySelectorAll(nodes)
      : nodes instanceof window.Node
      ? [nodes]
      : nodes; // Last case  - sequence config was passed pick next

  logger.debug('Start On Load before: ' + mermaid.startOnLoad);
  if (typeof mermaid.startOnLoad !== 'undefined') {
    logger.debug('Start On Load inner: ' + mermaid.startOnLoad);
    mermaidAPI.initialize({ startOnLoad: mermaid.startOnLoad });
  }

  if (typeof mermaid.ganttConfig !== 'undefined') {
    mermaidAPI.initialize({ gantt: mermaid.ganttConfig });
  }

  let txt;

  for (let i = 0; i < nodes.length; i++) {
    const element = nodes[i];

    /*! Check if previously processed */
    if (!element.getAttribute('data-processed')) {
      element.setAttribute('data-processed', true);
    } else {
      continue;
    }

    const id = `mermaid-${Date.now()}`;

    // Fetch the graph definition including tags
    txt = element.innerHTML;

    // transforms the html to pure text
    txt = decode(txt)
      .trim()
      .replace(/<br\s*\/?>/gi, '<br/>');

    const init = utils.detectInit(txt);
    if (init) {
      logger.debug('Detected early reinit: ', init);
    }

    try {
      mermaidAPI.render(
        id,
        txt,
        (svgCode, bindFunctions) => {
          element.innerHTML = svgCode;
          if (typeof callback !== 'undefined') {
            callback(id);
          }
          if (bindFunctions) bindFunctions(element);
        },
        element
      );
    } catch (e) {
      logger.warn('Syntax Error rendering');
      logger.warn(e);
      if (this.parseError) {
        this.parseError(e);
      }
    }
  }
};

const initialize = function(config) {
  if (typeof config.mermaid !== 'undefined') {
    if (typeof config.mermaid.startOnLoad !== 'undefined') {
      mermaid.startOnLoad = config.mermaid.startOnLoad;
    }
    if (typeof config.mermaid.htmlLabels !== 'undefined') {
      mermaid.htmlLabels = config.mermaid.htmlLabels;
    }
  }
  mermaidAPI.initialize(config);
  logger.debug('Initializing mermaid ');
};

/**
 * ##contentLoaded
 * Callback function that is called when page is loaded. This functions fetches configuration for mermaid rendering and
 * calls init for rendering the mermaid diagrams on the page.
 */
const contentLoaded = function() {
  let config;

  if (mermaid.startOnLoad) {
    // No config found, do check API config
    config = mermaidAPI.getConfig();
    if (config.startOnLoad) {
      mermaid.init();
    }
  } else {
    if (typeof mermaid.startOnLoad === 'undefined') {
      logger.debug('In start, no config');
      config = mermaidAPI.getConfig();
      if (config.startOnLoad) {
        mermaid.init();
      }
    }
  }
};

if (typeof document !== 'undefined') {
  /*!
   * Wait for document loaded before starting the execution
   */
  window.addEventListener(
    'load',
    function() {
      contentLoaded();
    },
    false
  );
}

const mermaid = {
  startOnLoad: true,
  htmlLabels: true,

  mermaidAPI,
  parse: mermaidAPI.parse,
  render: mermaidAPI.render,

  init,
  initialize,

  contentLoaded
};

export default mermaid;
