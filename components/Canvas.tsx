import React, { useEffect, useState, useRef } from 'react';

import Line from './Line';
import Area from './Area';
import Text from './Text';

import { custom } from '../types/t';

type Props = {
  params: custom.CanvasParams;

  // unit functions
  unitLengthToPixels: (unitLength: number) => number;
  pixelLengthToUnits: (pixelLength: number) => number;
  screenToWorld: (screen: custom.PixelSpacePoint) => custom.WorldSpacePoint;
  worldToScreen: (world: custom.WorldSpacePoint) => custom.PixelSpacePoint;

  mode: custom.SelectionMode;
  setMode: (value: custom.SelectionMode) => void;

  cachedPoints: custom.CachedPointStorage;
  setCachedPoints: (value: custom.CachedPointStorage) => void;

  cachedLines: custom.CachedLine[];
  setCachedLines: (value: custom.CachedLine[]) => void;

  cachedText: custom.Text;
  setCachedText: (value: custom.Text) => void;

  savedPoints: custom.SavedPoint[];
  setSavedPoints: (value: custom.SavedPoint[]) => void;

  savedLines: custom.SavedLine[];
  setSavedLines: (value: custom.SavedLine[]) => void;

  savedAreas: custom.Area[];
  setSavedAreas: (value: custom.Area[]) => void;

  savedTexts: custom.Text[];
  setSavedTexts: (value: custom.Text[]) => void;

  fClearCache: () => void;

  refExportCanvas: React.MutableRefObject<HTMLCanvasElement>;
};

export default function Canvas({
  params,
  unitLengthToPixels,
  pixelLengthToUnits,
  screenToWorld,
  worldToScreen,
  mode,
  setMode,
  cachedPoints,
  setCachedPoints,
  cachedLines,
  setCachedLines,
  cachedText,
  setCachedText,
  savedPoints,
  setSavedPoints,
  savedLines,
  setSavedLines,
  savedAreas,
  setSavedAreas,
  savedTexts,
  setSavedTexts,
  fClearCache,
  refExportCanvas
}: Props) {
  const [sMouseX, setMouseX] = useState<number>(null);
  const [sMouseY, setMouseY] = useState<number>(null);

  const [prevMouse, setPrevMouse] = useState<custom.PixelSpacePoint>(null);

  const [sSnappedPoint, setSnappedPoint] = useState<custom.SavedPoint>(null); // snapping always goes to a saved point

  const rMainCanvasDiv = useRef<HTMLDivElement>(null);

  function isMouseButtonDown(evt, targetButton: custom.MouseButtonBits) {
    return (evt.buttons & targetButton) !== 0;
  }

  // setting the canvas dimensions in the page
  useEffect(() => {
    if (!rMainCanvasDiv?.current) {
      console.log(
        '[Canvas - Error] : Cannot set client dimensions - Found null Ref'
      );

      return;
    }

    const boundingRect = rMainCanvasDiv.current.getBoundingClientRect();

    params.setScreenTopLeftX(Math.round(boundingRect.left));
    params.setScreenTopLeftY(Math.round(boundingRect.top));

    params.setWidth(Math.round(boundingRect.width));
    params.setHeight(Math.round(boundingRect.height));
  }, [params]);

  function snapToPoint(
    x: number,
    y: number,
    targets: custom.SavedPoint[],
    maxDelta = 10
  ) {
    if (!targets) {
      return;
    }

    const closestPoint =
      targets
        .map((point) => {
          const { x: pointScreenX, y: pointScreenY } = worldToScreen({
            x: point.x,
            y: point.y
          });

          const xDelta = Math.abs(pointScreenX - x);
          const yDelta = Math.abs(pointScreenY - y);

          const deltaSquared = xDelta * xDelta + yDelta * yDelta;

          return { point, deltaSquared };
        })
        .filter(({ deltaSquared }) => deltaSquared < maxDelta * maxDelta)
        .sort(
          ({ deltaSquared: deltaSquaredA }, { deltaSquared: deltaSquaredB }) =>
            deltaSquaredA - deltaSquaredB
        )
        .map(({ point }) => point)?.[0] ?? null;

    setSnappedPoint(closestPoint);

    return closestPoint;
  }

  function handleMouseMove(evt) {
    // handle null dimensions
    if (!params.screenTopLeftX || !params.screenTopLeftY) {
      console.log(
        '[Canvas - Error] : MouseMove event failed - Client dimensions are null'
      );

      return;
    }

    const instantScreenX = evt.clientX - params.screenTopLeftX;
    const instantScreenY = evt.clientY - params.screenTopLeftY;

    const closestPoint = snapToPoint(
      instantScreenX,
      instantScreenY,
      savedPoints,
      20
    );

    const xScreenWithSnap = closestPoint ? closestPoint.x : instantScreenX;
    const yScreenWithSnap = closestPoint ? closestPoint.y : instantScreenY;

    const { x: worldX, y: worldY } = screenToWorld({
      x: xScreenWithSnap,
      y: yScreenWithSnap
    });

    setPrevMouse({
      x: sMouseX,
      y: sMouseY
    });

    setMouseX(xScreenWithSnap);
    setMouseY(yScreenWithSnap);

    // save cached line if we're selecting the second point
    if (mode === 'line-second-point') {
      const newCachedLines = [
        {
          first: cachedPoints.tools.line[0],
          second: closestPoint
            ? {
                x: closestPoint.x,
                y: closestPoint.y,
                name: closestPoint.name,
                snappedPoint: closestPoint
              }
            : {
                x: worldX,
                y: worldY,
                name: 'unnamed',
                snappedPoint: null
              }
        }
      ];

      setCachedLines(newCachedLines);
    }

    if (
      mode === 'pan' &&
      isMouseButtonDown(evt, custom.MouseButtonBits.LEFT_CLICK)
    ) {
      console.log(
        `[Pan] LMB DOWN - moving from scr(${prevMouse.x}, ${
          prevMouse.y
        }) to wrld(${sMouseX}, ${sMouseY}) for a total delta of (${
          sMouseX - prevMouse.x
        }, ${sMouseY - prevMouse.y})`
      );

      const screenDeltaX = sMouseX - prevMouse.x;
      const screenDeltaY = sMouseY - prevMouse.y;

      const worldDeltaX = pixelLengthToUnits(screenDeltaX * -1); // negative this to give a realistic effect
      const worldDeltaY = pixelLengthToUnits(screenDeltaY);

      params.setWorldCenterX(params.worldCenterX + worldDeltaX);
      params.setWorldCenterY(params.worldCenterY + worldDeltaY);
    }
  }

  function handleMouseClick(evt) {
    if (mode === null) {
      return;
    }

    const instantScreenX = evt.clientX - params.screenTopLeftX;
    const instantScreenY = evt.clientY - params.screenTopLeftY;

    const closestPoint = snapToPoint(
      instantScreenX,
      instantScreenY,
      savedPoints,
      20
    );

    const { x: instantWorldX, y: instantWorldY } = screenToWorld({
      x: instantScreenX,
      y: instantScreenY
    });

    const worldX = closestPoint ? closestPoint.x : instantWorldX;
    const worldY = closestPoint ? closestPoint.y : instantWorldY;

    const { x: xScreenWithSnap, y: yScreenWithSnap } = worldToScreen({
      x: worldX,
      y: worldY
    });

    setPrevMouse({
      x: sMouseX,
      y: sMouseY
    });

    setMouseX(xScreenWithSnap);
    setMouseY(yScreenWithSnap);

    //* line tool
    // cache the first point
    if (mode === 'line-first-point') {
      const newCachedPoints = {
        ...cachedPoints,
        tools: {
          ...cachedPoints.tools,
          line: [
            {
              x: worldX,
              y: worldY,
              name: 'unnamed',
              snappedPoint: closestPoint
            }
          ]
        }
      };

      console.log(newCachedPoints);

      setCachedPoints(newCachedPoints);
      setMode('line-second-point');
    }
    // save both of the points
    else if (mode === 'line-second-point') {
      // console.log('QWE', cachedPoints);
      const cachedFirstPoint = cachedPoints.tools.line[0];

      // todo convert these to world coordinates
      const isFirstPointSnapped =
        cachedFirstPoint?.snappedPoint !== null &&
        typeof cachedFirstPoint?.snappedPoint !== 'undefined';

      const isSecondPointSnapped =
        closestPoint !== null && typeof closestPoint !== 'undefined';

      let firstPoint: custom.SavedPoint = isFirstPointSnapped
        ? cachedFirstPoint.snappedPoint
        : {
            x: cachedFirstPoint.x,
            y: cachedFirstPoint.y,
            name: `point-${Date.now()}1`
          };

      let secondPoint: custom.SavedPoint = isSecondPointSnapped
        ? closestPoint
        : {
            x: worldX,
            y: worldY,
            name: `point-${Date.now()}2`
          };

      const newSavedPoints = [...savedPoints];

      if (!isFirstPointSnapped) {
        newSavedPoints.push(firstPoint);
      }

      if (!isSecondPointSnapped) {
        newSavedPoints.push(secondPoint);
      }

      const newSavedLines = [
        ...savedLines,
        {
          first: firstPoint,
          second: secondPoint
        }
      ];

      // remove select mode
      setMode(null);

      // clear cache
      fClearCache();

      // save points & line
      setSavedPoints(newSavedPoints);
      setSavedLines(newSavedLines);
    }

    //* area tool
    if (mode.startsWith('area-point-')) {
      // if it doesn't snap, area is done; save it
      if (!closestPoint) {
        //todo verify if it's valid
        const newSavedAreas = [
          ...savedAreas,
          {
            points: cachedPoints.tools.area
          }
        ];

        console.log('SAVING');

        setSavedAreas(newSavedAreas);

        setMode(null);

        fClearCache();

        return;
      }

      const newCachedPoints = {
        ...cachedPoints,
        tools: {
          ...cachedPoints.tools,
          area: [
            ...cachedPoints.tools.area,
            {
              x: closestPoint.x,
              y: closestPoint.y,
              name: closestPoint.name,
              snappedPoint: closestPoint
            }
          ]
        }
      };

      setCachedPoints(newCachedPoints);
      setMode('area-point-' + (cachedPoints.tools.area.length + 1));
    }

    //* text tool
    if (mode === 'text') {
      // save it
      const newSavedTexts = [
        ...savedTexts,
        {
          xTop: worldX,
          yTop: worldY,
          value: 'text',
          name: `text-${new Date().getTime()}`
        }
      ];

      setSavedTexts(newSavedTexts);

      setMode(null);
      fClearCache();
    }
  }

  function handleAbort(evt) {
    setMode(null);

    fClearCache();
  }

  function changeSavedPointData(name, x, y) {
    const newSavedPoints = savedPoints.map((point) => {
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

    const newSavedLines = savedLines.map((line) => {
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

    console.log('Old saved points', savedPoints);
    console.log('New saved points', newSavedPoints);

    setSavedPoints(newSavedPoints);
    setSavedLines(newSavedLines);
  }

  function changeSavedTextValue(textName, newValue) {
    console.log('Old texts', savedTexts);
    const newSavedTexts = savedTexts.map((text) => {
      if (text.name === textName) {
        return {
          ...text,
          value: newValue
        };
      }

      return text;
    });

    console.log('New texts', newSavedTexts);
    setSavedTexts(newSavedTexts);
  }

  return (
    <div
      className='relative mx-auto mt-6 bg-white border border-gray-700 aspect-video grow'
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseClick}
      onMouseLeave={handleAbort}
      ref={rMainCanvasDiv}
    >
      <div className='absolute z-50 hidden w-full h-full'>
        <canvas
          width={params.width}
          height={params.height}
          ref={refExportCanvas}
          className=''
        ></canvas>
      </div>

      <div className='absolute z-10 w-full h-full'>
        {/* grid vertical lines*/}
        <div className='absolute flex flex-row justify-between w-full h-full p-0'>
          {Array(params.gridNumCellsPerRow)
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
          {Array((params.gridNumCellsPerRow * 9) / 16)
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
          <span>{`Current Screen Pos: X = ${sMouseX}, Y = ${sMouseY}`}</span>
        </div>

        {/* debug */}
        <div className='absolute mt-12'>
          {!sMouseX || !sMouseY ? null : (
            <span>{`Current World Pos: X = ${screenToWorld({
              x: sMouseX,
              y: sMouseY
            }).x.toFixed(2)} ${params.gridUnit.name}, Y = ${screenToWorld({
              x: sMouseX,
              y: sMouseY
            }).y.toFixed(2)} ${params.gridUnit.name}`}</span>
          )}
        </div>

        {/* debug */}
        <div className='absolute mt-6'>
          <span>{`Prev Screen Pos: X = ${prevMouse?.x}, Y = ${prevMouse?.y}`}</span>
        </div>

        {/* debug 2 */}
        <div className='absolute flex justify-end w-full'>
          <span>{`Currently Placing: ${mode}`}</span>
        </div>
      </div>

      {/* render saved points */}
      <div className='absolute z-20 w-full h-full'>
        {savedPoints.map((point, index) => {
          const screenPos = worldToScreen({
            x: point.x,
            y: point.y
          });

          return (
            <div
              //  todo add name popup
              key={`saved-point-${index}`}
              className='absolute w-2 h-2 bg-red-600 rounded-full'
              style={{ top: screenPos.y - 1, left: screenPos.x - 1 }}
            />
          );
        })}

        {/* render line cached points */}
        {cachedPoints.tools.line.map((point, index) => {
          const screenPos = worldToScreen({
            x: point.x,
            y: point.y
          });

          return (
            <div
              key={`saved-point-${index}`}
              className='absolute w-1 h-1 bg-red-600 rounded-full'
              style={{ top: screenPos.y, left: screenPos.x }}
            />
          );
        })}

        {/* render cached lines */}
        {cachedLines.map((line, index) => {
          return (
            <Line
              key={`cached-line-${index}`}
              first={line.first}
              second={line.second}
              fChangeSavedPointData={changeSavedPointData}
              canvasParams={params}
              unitLengthToPixels={unitLengthToPixels}
              pixelLengthToUnits={pixelLengthToUnits}
              screenToWorld={screenToWorld}
              worldToScreen={worldToScreen}
            />
          );
        })}

        {/* render area and cached points */}
        {cachedPoints.tools.area.map((point, index) => {
          const screenPos = worldToScreen({
            x: point.x,
            y: point.y
          });

          return (
            <div
              key={`area-cached-point-${index}`}
              className='absolute w-2 h-2 bg-green-600 rounded-full'
              style={{ top: screenPos.y - 1, left: screenPos.x - 1 }}
            />
          );
        })}

        <Area
          points={cachedPoints.tools.area.map((p) => p.snappedPoint)}
          savedLines={savedLines}
          canvasParams={params}
          bgColor='red'
          textColor='#22c55e'
          worldToScreen={worldToScreen}
        />

        {/* render saved areas */}
        {savedAreas.map((area, index) => {
          return (
            <Area
              key={`saved-area-${index}`}
              points={area.points}
              savedLines={savedLines}
              canvasParams={params}
              bgColor='#4ade80'
              textColor='#22c55e'
              worldToScreen={worldToScreen}
            />
          );
        })}
      </div>

      <div className='absolute z-30 w-full h-full'>
        {/* render saved lines */}
        {savedLines.map((line, index) => {
          return (
            <Line
              key={`saved-line-${index}`}
              first={line.first}
              second={line.second}
              fChangeSavedPointData={changeSavedPointData}
              canvasParams={params}
              unitLengthToPixels={unitLengthToPixels}
              pixelLengthToUnits={pixelLengthToUnits}
              screenToWorld={screenToWorld}
              worldToScreen={worldToScreen}
            />
          );
        })}

        {/* render saved texts */}
        {savedTexts.map((text, index) => {
          return (
            <Text
              key={`saved-text-${index}`}
              x={text.xTop}
              y={text.yTop}
              value={text.value}
              saved={true}
              name={text.name}
              fChangeSavedTextValue={changeSavedTextValue}
              worldToScreen={worldToScreen}
            />
          );
        })}
      </div>

      {/* render current icon */}
      {mode === null ? null : mode === 'line-first-point' ||
        mode === 'line-second-point' ? (
        <div
          className='absolute w-1 h-1 bg-red-500 rounded-full'
          style={{
            top: sMouseY ?? 0, // todo add snap here
            left: sMouseX ?? 0
          }}
        />
      ) : mode === 'text' ? (
        <Text
          x={screenToWorld({ x: sMouseX, y: sMouseY }).x}
          y={screenToWorld({ x: sMouseX, y: sMouseY }).y}
          saved={false}
          value='text'
          worldToScreen={worldToScreen}
        />
      ) : mode === 'pan' ? (
        <div
          className='absolute'
          style={{
            top: sMouseY ?? 0, // todo add snap here
            left: sMouseX ?? 0
          }}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='#000'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 4.5v15m7.5-7.5h-15'
            />
          </svg>
        </div>
      ) : (
        <div
          className='absolute w-1 h-1 bg-green-500 rounded-full'
          style={{
            top: sMouseY ?? 0, // todo add snap here
            left: sMouseX ?? 0
          }}
        />
      )}
    </div>
  );
}
