import React, { useEffect, useState, useRef } from 'react';

import Line from './Line';
import Area from './Area';
import Text from './Text';

type NullableNumber = number | null;

type Point = {
  x: number;
  y: number;
  name: string;
  snapped: boolean;
};

type NullablePoint = Point | null;

export default function Canvas(props) {
  const [sCanvasLeft, setCanvasLeft] = useState<NullableNumber>(null);
  const [sCanvasTop, setCanvasTop] = useState<NullableNumber>(null);

  const [sMouseX, setMouseX] = useState<NullableNumber>(null);
  const [sMouseY, setMouseY] = useState<NullableNumber>(null);

  const [sSnappedPoint, setSnappedPoint] = useState<NullablePoint>(null);

  const rMainCanvasDiv = useRef<HTMLDivElement>(null);

  // setting the canvas dimensions in the page
  useEffect(() => {
    if (!rMainCanvasDiv?.current) {
      console.log(
        '[Canvas - Error] : Cannot set client dimensions - Found null Ref'
      );

      return;
    }

    const boundingRect = rMainCanvasDiv.current.getBoundingClientRect();

    setCanvasLeft(Math.round(boundingRect.left));
    setCanvasTop(Math.round(boundingRect.top));

    props.fSetCanvasWidth(Math.round(boundingRect.width));
    props.fSetCanvasHeight(Math.round(boundingRect.height));
  }, []);

  function snapToPoint(x, y, pointSet, maxDelta = 10) {
    if (!pointSet) {
      return;
    }

    const closestPoint = pointSet
      .map((point) => {
        const xDelta = Math.abs(point.x - x);
        const yDelta = Math.abs(point.y - y);

        const deltaSquared = xDelta * xDelta + yDelta * yDelta;

        return [point, deltaSquared];
      })
      .filter(([point, deltaSquared]) => deltaSquared < maxDelta * maxDelta)
      .sort(
        ([pointA, deltaSquaredA], [pointB, deltaSquaredB]) =>
          deltaSquaredA - deltaSquaredB
      )
      .map(([point, deltaSquared]) => point)?.[0];

    if (closestPoint) {
      setSnappedPoint(closestPoint);

      return closestPoint;
    } else {
      setSnappedPoint(null);
    }
  }

  function handleMouseMove(evt) {
    if (!sCanvasLeft || !sCanvasTop) {
      console.log(
        '[Canvas - Error] : MouseMove event failed - Client dimensions are null'
      );

      return;
    }

    const instantX = evt.clientX - sCanvasLeft;
    const instantY = evt.clientY - sCanvasTop;

    const closestPoint = snapToPoint(
      instantX,
      instantY,
      props.sSavedPoints,
      20
    );

    setMouseX(instantX);
    setMouseY(instantY);

    const xWithSnap = closestPoint ? closestPoint.x : instantX;
    const yWithSnap = closestPoint ? closestPoint.y : instantY;

    // save cached line if we're selecting the second point
    if (props.sSelecting === 'line-second-point') {
      const newCachedLines = [
        {
          first: {
            x: props.sCachedPoints.tools.line[0].x,
            y: props.sCachedPoints.tools.line[0].y
          },
          second: {
            x: xWithSnap,
            y: yWithSnap
          }
        }
      ];

      props.fSetCachedLines(newCachedLines);
    }
  }

  function handleMouseClick(evt) {
    if (props.sSelecting === null) {
      return;
    }

    //* line tool
    // cache the first point
    if (props.sSelecting === 'line-first-point') {
      const newCachedPoints = {
        ...props.sCachedPoints,
        tools: {
          ...props.sCachedPoints.tools,
          line: [
            {
              x: sSnappedPoint ? sSnappedPoint.x : sMouseX,
              y: sSnappedPoint ? sSnappedPoint.y : sMouseY,
              snapped: sSnappedPoint ? true : false,
              snappedPoint: sSnappedPoint
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

      let firstPoint = {
        x: cachedFirstPoint.x,
        y: cachedFirstPoint.y,
        name: name1,
        snapped: cachedFirstPoint.snapped
      };

      let secondPoint = {
        x: sSnappedPoint ? sSnappedPoint.x : sMouseX,
        y: sSnappedPoint ? sSnappedPoint.y : sMouseY,
        name: name2,
        snapped: sSnappedPoint ? true : false
      };

      const newSavedPoints = [...props.sSavedPoints];

      if (!firstPoint.snapped) {
        newSavedPoints.push(firstPoint);
      } else {
        firstPoint = cachedFirstPoint.snappedPoint;
      }

      if (!secondPoint.snapped) {
        newSavedPoints.push(secondPoint);
      } else {
        if (sSnappedPoint) {
          secondPoint = sSnappedPoint;
        }
      }

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

    //* area tool
    if (props.sSelecting.startsWith('area-point-')) {
      // save it
      if (!sSnappedPoint) {
        const newSavedAreas = [
          ...props.sSavedAreas,
          {
            points: props.sCachedPoints.tools.area
          }
        ];

        console.log('SAVING');

        props.fSetSavedAreas(newSavedAreas);

        props.fSetSelecting(null);

        props.fClearCache();

        return;
      }

      console.log(props.sCachedPoints);
      const newCachedPoints = {
        ...props.sCachedPoints,
        tools: {
          ...props.sCachedPoints.tools,
          area: [
            ...props.sCachedPoints.tools.area,
            {
              x: sSnappedPoint ? sSnappedPoint.x : sMouseX,
              y: sSnappedPoint ? sSnappedPoint.y : sMouseY,
              snapped: sSnappedPoint ? true : false,
              snappedPoint: sSnappedPoint
            }
          ]
        }
      };

      props.fSetCachedPoints(newCachedPoints);
      props.fSetSelecting(
        'area-point-' + (props.sCachedPoints.tools.area.length + 1)
      );
    }

    //* text tool
    if (props.sSelecting === 'text') {
      // save it
      const newSavedTexts = [
        ...props.sSavedTexts,
        {
          x: sMouseX,
          y: sMouseY,
          text: 'text',
          name: `text-${new Date().getTime()}`
        }
      ];

      props.fSetSavedTexts(newSavedTexts);

      props.fSetSelecting(null);
    }
  }

  function handleAbort(evt) {
    props.fSetSelecting(null);

    props.fClearCache();
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

  function changeSavedTextValue(textName, newValue) {
    const newSavedTexts = props.sSavedTexts.map((text) => {
      if (text.name === textName) {
        return {
          ...text,
          text: newValue
        };
      }

      return text;
    });

    props.fSetSavedTexts(newSavedTexts);
  }

  return (
    <div
      className='relative mx-auto mt-6 bg-white border border-gray-700 aspect-video grow'
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseClick}
      onMouseLeave={handleAbort}
      ref={rMainCanvasDiv}
    >
      <div className='absolute hidden z-50 w-full h-full'>
        <canvas
          width={props.sCanvasWidth}
          height={props.sCanvasHeight}
          ref={props.rExportCanvas}
          className=''
        ></canvas>
      </div>

      <div className='absolute z-10 w-full h-full'>
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

        {/* debug */}
        <div className='absolute mt-6'>
          {!sMouseX || !sMouseY ? null : (
            <span>{`Current World Pos: X = ${
              sMouseX + (props.sCanvasCenterWorldX - props.sCanvasWidth / 2)
            }, Y = ${
              -sMouseY + (props.sCanvasCenterWorldY + props.sCanvasHeight / 2)
            }`}</span>
          )}
        </div>
        {/* debug 2 */}
        <div className='absolute flex justify-end w-full'>
          <span>{`Currently Placing: ${props.sSelecting}`}</span>
        </div>
      </div>

      {/* render saved points */}
      <div className='absolute z-20 w-full h-full'>
        {props.sSavedPoints.map((point, index) => {
          return (
            <div
              //  todo add name popup
              key={`saved-point-${index}`}
              className='absolute w-2 h-2 bg-red-600 rounded-full'
              style={{ top: point.y - 1, left: point.x - 1 }}
            />
          );
        })}

        {/* render line cached points */}
        {props.sCachedPoints.tools.line.map((point, index) => {
          return (
            <div
              key={`saved-point-${index}`}
              className='absolute w-1 h-1 bg-red-600 rounded-full'
              style={{ top: point.y, left: point.x }}
            />
          );
        })}

        {/* render cached lines */}
        {props.sCachedLines.map((line, index) => {
          return (
            <Line
              key={`cached-line-${index}`}
              first={line.first}
              second={line.second}
              fChangeSavedPointData={changeSavedPointData}
              // grid units
              sGridSize={props.sGridSize}
              sGridDimension={props.sGridDimension}
              sGridUnit={props.sGridUnit}
              sCanvasWidth={props.sCanvasWidth}
            />
          );
        })}

        {/* render area and cached points */}
        {props.sCachedPoints.tools.area.map((point, index) => {
          return (
            <div
              key={`area-cached-point-${index}`}
              className='absolute w-2 h-2 bg-green-600 rounded-full'
              style={{ top: point.y - 1, left: point.x - 1 }}
            />
          );
        })}

        <Area
          points={props.sCachedPoints.tools.area}
          savedLines={props.sSavedLines}
          sCanvasWidth={props.sCanvasWidth}
          sCanvasHeight={props.sCanvasHeight}
          bg='red'
          textColor='#22c55e'
          // grid units
          sGridSize={props.sGridSize}
          sGridDimension={props.sGridDimension}
          sGridUnit={props.sGridUnit}
        />

        {/* render saved areas */}
        {props.sSavedAreas.map((area, index) => {
          return (
            <Area
              key={`saved-area-${index}`}
              points={area.points}
              savedLines={props.sSavedLines}
              sCanvasWidth={props.sCanvasWidth}
              sCanvasHeight={props.sCanvasHeight}
              bg='#4ade80'
              textColor='#22c55e'
              // grid units
              sGridSize={props.sGridSize}
              sGridDimension={props.sGridDimension}
              sGridUnit={props.sGridUnit}
            />
          );
        })}
      </div>

      <div className='absolute z-30 w-full h-full'>
        {/* render saved lines */}
        {props.sSavedLines.map((line, index) => {
          return (
            <Line
              key={`cached-line-${index}`}
              first={line.first}
              second={line.second}
              fChangeSavedPointData={changeSavedPointData}
              // grid units
              sGridSize={props.sGridSize}
              sGridDimension={props.sGridDimension}
              sGridUnit={props.sGridUnit}
              sCanvasWidth={props.sCanvasWidth}
            />
          );
        })}

        {/* render saved texts */}
        {props.sSavedTexts.map((text, index) => {
          return (
            <Text
              key={`saved-text-${index}`}
              x={text.x}
              y={text.y}
              text={text.text}
              saved={true}
              name={text.name}
              fChangeSavedTextValue={changeSavedTextValue}
            />
          );
        })}
      </div>

      {/* render current icon */}
      {props.sSelecting === null ? null : props.sSelecting ===
          'line-first-point' || props.sSelecting === 'line-second-point' ? (
        <div
          className='absolute w-1 h-1 bg-red-500 rounded-full'
          style={{
            top: (sSnappedPoint ? sSnappedPoint.y : sMouseY) ?? 0,
            left: (sSnappedPoint ? sSnappedPoint.x : sMouseX) ?? 0
          }}
        />
      ) : props.sSelecting === 'text' ? (
        <Text x={sMouseX} y={sMouseY} />
      ) : (
        <div
          className='absolute w-1 h-1 bg-green-500 rounded-full'
          style={{
            top: (sSnappedPoint ? sSnappedPoint.y : sMouseY) ?? 0,
            left: (sSnappedPoint ? sSnappedPoint.x : sMouseX) ?? 0
          }}
        />
      )}
    </div>
  );
}
