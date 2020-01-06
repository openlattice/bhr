import { Colors } from 'lattice-ui-kit';
import { rgba } from 'polished';
import { css, keyframes } from 'styled-components';

const { PURPLES } = Colors;

const loading = keyframes`
  0% {
    background-position:
      -10vw 0, /* animation blur */
      0 0.25em;
  };

  100% {
    background-position:
      100vw 0, /* animation blur */
      0 0.25em;
  };
`;

const fullLineSkeleton = css`
  min-height: 1.5em;
  background-repeat: no-repeat;
  background-image:
    /* layer 0: animation blur */
    linear-gradient(
      90deg,
      ${rgba('white', 0)} 0,
      ${rgba('white', 0.8)} 50%,
      ${rgba('white', 0)} 100%
    ),
    /* layer 1: list item 1*/
    /* light rectangles with 1.5em height */
    linear-gradient(${PURPLES[6]} 1.5em, transparent 0);
  background-size:
    100% 100%, /* animation blur */
    100% 1.5em;
  background-position:
    -10vw 0, /* animation blur */
    0 0.25em;

  animation: ${loading} 2s infinite;
`;

export default fullLineSkeleton;
