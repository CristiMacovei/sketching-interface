import React, { useState, useEffect, useRef } from 'react';

import { custom } from '../types/t';

type ComponentProps = {
  points: custom.SavedPoint[];
  savedLines: custom.SavedLine[];
  canvasParams: custom.CanvasParams;
  bgColor: string;
  textColor: string;
  worldToScreen: (value: custom.WorldSpacePoint) => custom.PixelSpacePoint;
};

export function ccw(p1: custom.SavedPoint, p2: custom.SavedPoint): number {
  return p1.x * p2.y - p1.y * p2.x;
}

export function calcArea(points: custom.SavedPoint[]): number {
  let total = 0;

  const xGravityCenter =
    points.reduce((acc, point) => acc + point.x, 0) / points.length;
  const yGravityCenter =
    points.reduce((acc, point) => acc + point.y, 0) / points.length;

  const sortedPoints = points
    .map((p) => ({ ...p, x: p.x - xGravityCenter, y: p.y - yGravityCenter }))
    .sort((p1, p2) => ccw(p1, p2));

  for (let i = 0, l = sortedPoints.length; i < l; i++) {
    let addX = sortedPoints[i].x;
    let addY = sortedPoints[i == sortedPoints.length - 1 ? 0 : i + 1].y;
    let subX = sortedPoints[i == sortedPoints.length - 1 ? 0 : i + 1].x;
    let subY = sortedPoints[i].y;

    total += addX * addY * 0.5;
    total -= subX * subY * 0.5;
  }

  return Math.abs(total);
}

export function validate(
  points: custom.SavedPoint[],
  lines: custom.SavedLine[]
) {
  if (!points || points.length <= 2) {
    return false;
  }

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    if (
      !lines.find(
        (l) =>
          (l.first.name === p1.name && l.second.name === p2.name) ||
          (l.first.name === p2.name && l.second.name === p1.name)
      )
    ) {
      console.log(
        `No line between ${p1.name} (${i}) and ${p2.name} (${i + 1})`
      );
      return false;
    }
  }

  return true;
}

export default function Area({
  points,
  savedLines,
  canvasParams,
  bgColor,
  textColor,
  worldToScreen
}: ComponentProps) {
  const [sIsValid, setIsValid] = useState(false);

  const rAreaCanvas = useRef<HTMLCanvasElement>(null);

  const [sCG, setCG] = useState<custom.PixelSpacePoint>({ x: 0, y: 0 });

  // check if it's a valid polygon
  useEffect(() => {
    const validation = validate(points, savedLines);

    if (!validation) {
      setIsValid(false);

      return;
    }

    if (rAreaCanvas?.current === null) {
      console.log(
        '[Area - Error]: Found null ref when trying to draw to the canvas'
      );
      return;
    }

    const ctx = rAreaCanvas.current.getContext('2d');
    if (ctx === null) {
      console.log(
        '[Area - Error]: Found null 2d Context when trying to draw to the canvas'
      );
      return;
    }

    const pointScreenPositions = points.map(({ x, y }) =>
      worldToScreen({ x, y })
    );

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasParams.width, canvasParams.height);

    ctx.beginPath();
    ctx.moveTo(pointScreenPositions[0].x, pointScreenPositions[0].y);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(pointScreenPositions[i].x, pointScreenPositions[i].y);
    }
    ctx.fillStyle = bgColor;
    ctx.fill();

    const xGravityCenter =
      pointScreenPositions.reduce((acc, point) => acc + point.x, 0) /
      pointScreenPositions.length;
    const yGravityCenter =
      pointScreenPositions.reduce((acc, point) => acc + point.y, 0) /
      pointScreenPositions.length;

    setCG({ x: xGravityCenter, y: yGravityCenter });

    setIsValid(true);
  }, [points, savedLines, canvasParams, bgColor, worldToScreen]);

  return (
    <div className='absolute z-10 w-full h-full'>
      <canvas
        ref={rAreaCanvas}
        width={canvasParams.width}
        height={canvasParams.height}
        className={`opacity-20 ${sIsValid ? '' : 'hidden'}`}
      ></canvas>

      <div
        className={`absolute opacity-50 ${sIsValid ? '' : 'hidden'}`}
        style={{
          top: sCG.y,
          left: sCG.x
        }}
      >
        {calcArea(points).toFixed(2)}
        &nbsp;
        {canvasParams.gridUnit.name}&nbsp;²
      </div>
    </div>
  );
}
