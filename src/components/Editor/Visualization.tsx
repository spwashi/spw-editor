import styled from 'styled-components';
import {useData, Viz, VizInputs} from '@spwashi/react-d3';
import * as React from 'react';
import {useMemo} from 'react';

const AppWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  font-size: calc(10px + 2vmin);
  color: white;
  text-align: center;


  > div {
    width: 100%;
    margin: 0 2rem;
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
  }

  .App-link {
    color: #61dafb;
  }

  .input-wrapper {
    padding: 1rem;
    flex: 0 0 30%;
  }

  .input-wrapper input {
    display: block;
  }

  .number {
    font-size: 15px;
    width: 100px;
  }
`;

export function Visual() {
    const {
              props:     props,
              Component: InputToggles,
          } = VizInputs();

    const {
              radius,
              radialDecay,
              nodeStrength,
              linkStrength,
              height,
              width,
              offsetX,
              offsetY,
              steps,
              count,
              colorsCount,
              theta,
              centeringForce,
              svgWidth,
              svgHeight,
          } = props;

    const svgSize  = {width: svgWidth, height: svgHeight};
    const nodeInfo = {count, steps, theta, radius, radialDecay};
    const data     = useData('list_1', nodeInfo, svgSize);
    const links    = useMemo(() =>
                                 [
                                     {source: 1, target: 0},
                                 ], [data]);
    return (
        <AppWrapper className="App">
            <div className="App-wrapper">
                <div style={{width: '50%'}}>
                    <Viz
                        forces={{
                            center:            !!centeringForce,
                            nodeLinkStrength:  linkStrength,
                            nodeForceStrength: nodeStrength,
                        }}
                        data={data}
                        links={links}
                        radius={radius}
                        radialDecay={radialDecay}
                        colorsCount={colorsCount}
                        svgHeight={svgHeight}
                        svgWidth={svgWidth}
                        offsetX={offsetX}
                        offsetY={offsetY}
                        width={width}
                        height={height}
                    />
                </div>
                {InputToggles}
            </div>
        </AppWrapper>
    );
}