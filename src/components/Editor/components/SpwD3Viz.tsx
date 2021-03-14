import styled from 'styled-components';
import React, {useMemo} from 'react';
import {D3DataCollection} from '../hooks/d3/data';
import {Viz, VizInputs} from '@spwashi/react-d3';

const VizWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  font-size: calc(10px + 2vmin);
  color: white;
  text-align: center;

  &, button {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
  }

  .App-link {
    color: #61dafb;
  }

  .input-wrapper {
    padding: 1rem;
    flex: 0 0;
  }

  .input-wrapper input {
    display: block;
  }

  .number {
    font-size: 15px;
    width: 100px;
  }
`;

export function SpwD3Viz(props: { data?: D3DataCollection } = {data: new D3DataCollection}) {
    const {
              props:     vizConfig,
              Component: InputToggles,
          } = VizInputs();

    const {
              radius,
              nodeStrength,
              linkStrength,
              height,
              width,
              offsetX,
              offsetY,
              centeringForce,
              boundingBox,
              svgWidth,
              svgHeight,
          } = vizConfig;

    const data   = props.data;
    const nodes  = useMemo(() =>
                               (data?.nodes.nodes || [])
                                   .map(d => {
                                       d.r = ((d._r ?? 0) * radius) || d.r || 10;
                                       return d;
                                   }), [data, radius]);
    const links  = useMemo(() => (data?.links.edges || []), [nodes]);
    const forces = useMemo(() => ({
        center:            !!centeringForce,
        nodeLinkStrength:  linkStrength,
        nodeForceStrength: nodeStrength,
        boundingBox:       !!boundingBox,
    }), [centeringForce, linkStrength, nodeStrength, boundingBox]);
    return (
        <VizWrapper className="App">
            {InputToggles}
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Viz forces={forces}
                     nodes={nodes}
                     links={links}
                     radius={radius}
                     svgHeight={svgHeight}
                     svgWidth={svgWidth}
                     offsetX={offsetX}
                     offsetY={offsetY}
                     width={width}
                     height={height}/>
            </div>
        </VizWrapper>
    );
}

export default SpwD3Viz;