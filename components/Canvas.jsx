import { useEffect, useState, useRef } from 'react';

import Line from './Line';

export default function Canvas(props) {
  const [sCanvasLeft, setCanvasLeft] = useState(null);
  const [sCanvasTop, setCanvasTop] = useState(null);

  const [sMouseX, setMouseX] = useState(null);
  const [sMouseY, setMouseY] = useState(null);

  const rMainCanvasDiv = useRef(null);

  useEffect(() => {
    const boundingRect = rMainCanvasDiv.current.getBoundingClientRect();

    setCanvasLeft(Math.round(boundingRect.left));
    setCanvasTop(Math.round(boundingRect.top));
  }, []);

  function handleMouseMove(evt) {
    setMouseX(evt.clientX - sCanvasLeft);
    setMouseY(evt.clientY - sCanvasTop);

    if (props.sSelecting === 'line-second-point') {
      const newCachedLines = [
        {
          first: {
            x: props.sCachedPoints.tools.line[0].x,
            y: props.sCachedPoints.tools.line[0].y
          },
          second: {
            x: evt.clientX - sCanvasLeft,
            y: evt.clientY - sCanvasTop
          }
        }
      ];

      props.fSetCachedLines(newCachedLines);
    }
  }

  function handleMouseClick(evt) {
    //* line tool
    // cache the first point
    if (props.sSelecting === 'line-first-point') {
      const newCachedPoints = {
        ...props.sCachedPoints,
        tools: {
          ...props.sCachedPoints.tools,
          line: [
            {
              x: sMouseX,
              y: sMouseY
            }
          ]
        }
      };

      console.log(newCachedPoints);

      props.fSetCachedPoints(newCachedPoints);
      props.fSetSelecting('line-second-point');
    }
    // save both of the points
    else if (props.sSelecting === 'line-second-point') {
      const cachedFirstPoint = props.sCachedPoints.tools.line[0];

      const initialLen = props.sSavedPoints.length;
      //todo maybe come up with better names?
      const name1 = `A-${initialLen + 1}`;
      const name2 = `A-${initialLen + 2}`;

      const firstPoint = {
        x: cachedFirstPoint.x,
        y: cachedFirstPoint.y,
        name: name1
      };

      const secondPoint = {
        x: sMouseX,
        y: sMouseY,
        name: name2
      };

      const newSavedPoints = [...props.sSavedPoints, firstPoint, secondPoint];

      const newSavedLines = [
        ...props.sSavedLines,
        {
          first: firstPoint,
          second: secondPoint
        }
      ];

      const newCachedPoints = {
        ...props.sCachedPoints,
        tools: {
          ...props.sCachedPoints.tools,
          line: []
        }
      };

      // remove select mode
      props.fSetSelecting(null);

      // clear cached line points
      props.fSetCachedPoints(newCachedPoints);
      props.fSetCachedLines([]);

      // save points & line
      props.fSetSavedPoints(newSavedPoints);
      props.fSetSavedLines(newSavedLines);
    }
  }

  function handleAbort(evt) {
    props.fSetSelecting(null);
    props.fSetCachedPoints({
      tools: {
        line: []
      }
    });

    props.fSetCachedLines([]);
  }

  function changeSavedPointData(name, x, y) {
    const newSavedPoints = props.sSavedPoints.map((point) => {
      if (point.name === name) {
        return {
          name,
          x,
          y
        };
      } else {
        return point;
      }
    });

    const newSavedLines = props.sSavedLines.map((line) => {
      let newFirst = line.first;
      let newSecond = line.second;

      if (line.first.name === name) {
        newFirst = {
          name,
          x,
          y
        };
      }

      if (line.second.name === name) {
        newSecond = {
          name,
          x,
          y
        };
      }

      return {
        first: newFirst,
        second: newSecond
      };
    });

    props.fSetSavedPoints(newSavedPoints);
    props.fSetSavedLines(newSavedLines);
  }

  return (
    <div
      className='relative mx-auto mt-6 bg-white border border-gray-700 aspect-video grow'
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseClick}
      onMouseLeave={handleAbort}
      ref={rMainCanvasDiv}
    >
      {/* grid vertical lines*/}
      <div className='absolute flex flex-row justify-between w-full h-full p-0'>
        {Array(props.sGridSize)
          .fill(0)
          .map((_, index) => {
            return (
              <div
                key={`grid-line-v-${index}`}
                className='w-px h-full bg-gray-400 bg-opacity-60'
              ></div>
            );
          })}
      </div>
      {/* grid horizontal lines*/}
      <div className='absolute flex flex-col justify-between w-full h-full p-0'>
        {Array((props.sGridSize * 9) / 16)
          .fill(0)
          .map((_, index) => {
            return (
              <div
                key={`grid-line-v-${index}`}
                className='w-full h-px bg-gray-400 bg-opacity-60'
              ></div>
            );
          })}
      </div>
      {/* debug */}
      <div className='absolute'>
        <span>{`Current Pos: X = ${sMouseX}, Y = ${sMouseY}`}</span>
      </div>
      {/* debug 2 */}
      <div className='absolute flex justify-end w-full'>
        <span>{`Currently Placing: ${props.sSelecting}`}</span>
      </div>
      {/* render saved points */}
      <div className='absolute w-full h-full'>
        {props.sSavedPoints.map((point, index) => {
          return (
            <div
              //  todo add name popup
              key={`saved-point-${index}`}
              className='absolute w-1 h-1 bg-red-600 rounded-full'
              style={{ top: point.y, left: point.x }}
            />
          );
        })}
      </div>

      {/* render saved lines */}
      <div className='absolute z-10 w-full h-full'>
        {props.sSavedLines.map((line, index) => {
          return (
            <Line
              key={`cached-line-${index}`}
              first={line.first}
              second={line.second}
              fChangeSavedPointData={changeSavedPointData}
            />
          );
        })}
      </div>
      {/* render line cached points */}
      <div className='absolute w-full h-full'>
        {props.sCachedPoints.tools.line.map((point, index) => {
          return (
            <div
              key={`saved-point-${index}`}
              className='absolute w-1 h-1 bg-red-600 rounded-full'
              style={{ top: point.y, left: point.x }}
            />
          );
        })}
      </div>
      {/* render cached lines */}
      <div className='absolute w-full h-full'>
        {props.sCachedLines.map((line, index) => {
          return (
            <Line
              key={`cached-line-${index}`}
              first={line.first}
              second={line.second}
              fChangeSavedPointData={changeSavedPointData}
            />
          );
        })}
      </div>
      {/* render current icon */}
      {props.sSelecting === null ? null : props.sSelecting ===
        'line-first-point' ? (
        <div
          className='absolute w-1 h-1 bg-red-500 rounded-full'
          style={{
            top: sMouseY,
            left: sMouseX
          }}
        />
      ) : (
        <div
          className='absolute w-1 h-1 bg-red-500 rounded-full'
          style={{
            top: sMouseY,
            left: sMouseX
          }}
        />
      )}
    </div>
  );
}
