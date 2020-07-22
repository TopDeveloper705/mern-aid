import classDiagram from './diagrams/class/styles';
import er from './diagrams/er/styles';
import flowchart from './diagrams/flowchart/styles';
import gantt from './diagrams/gantt/styles';
import git from './diagrams/git/styles';
import info from './diagrams/info/styles';
import pie from './diagrams/pie/styles';
import sequence from './diagrams/sequence/styles';
import stateDiagram from './diagrams/state/styles';
import journey from './diagrams/user-journey/styles';

const themes = {
  flowchart,
  'flowchart-v2': flowchart,
  sequence,
  gantt,
  class: classDiagram,
  stateDiagram,
  state: stateDiagram,
  git,
  info,
  pie,
  er,
  journey
};

export const calcThemeVariables = (theme, userOverRides) => theme.calcColors(userOverRides);

const getStyles = (type, userStyles, options) => {
  return ` {
    font-family: ${options.fontFamily};
    font-size: ${options.fontSize};
    fill: ${options.textColor}
  }

  /* Classes common for multiple diagrams */

  .error-icon {
    fill: ${options.errorBkgColor};
  }
  .error-text {
    fill: ${options.errorTextColor};
    stroke: ${options.errorTextColor};
  }

  .edge-thickness-normal {
    stroke-width: 2px;
  }
  .edge-thickness-thick {
    stroke-width: 3.5px
  }
  .edge-pattern-solid {
    stroke-dasharray: 0;
  }

  .edge-pattern-dashed{
    stroke-dasharray: 3;
  }
  .edge-pattern-dotted {
    stroke-dasharray: 2;
  }

  .marker {
    fill: ${options.lineColor};
  }
  .marker.cross {
    stroke: ${options.lineColor};
  }

  svg {
    font-family: ${options.fontFamily};
    font-size: ${options.fontSize};
  }

  ${themes[type](options)}

  ${userStyles}

  ${type} { fill: apa;}
`;
};

export default getStyles;
