import React, { useState, useEffect, useRef } from 'react';

type Position = {
  x?: number;
  y?: number;
};

export function ccw(p1, p2) {
  return p1.x * p2.y - p1.y * p2.x;
}

export function calcArea(points, unitMultiplier) {
  var total = 0;

  const xGravityCenter =
    points.reduce((acc, point) => acc + point.x, 0) / points.length;
  const yGravityCenter =
    points.reduce((acc, point) => acc + point.y, 0) / points.length;

  const sortedPoints = points
    .map((p) => ({ x: p.x - xGravityCenter, y: p.y - yGravityCenter }))
    .sort((p1, p2) => ccw(p1, p2));

  for (var i = 0, l = sortedPoints.length; i < l; i++) {
    var addX = sortedPoints[i].x;
    var addY = sortedPoints[i == sortedPoints.length - 1 ? 0 : i + 1].y;
    var subX = sortedPoints[i == sortedPoints.length - 1 ? 0 : i + 1].x;
    var subY = sortedPoints[i].y;

    total += addX * addY * 0.5;
    total -= subX * subY * 0.5;
  }
  return Math.abs(total) * unitMultiplier * unitMultiplier;
}

export function validate(points, lines) {
  if (!points || points.length <= 2) {
    return false;
  }

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i].snappedPoint;
    const p2 = points[i + 1].snappedPoint;

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

export default function Area(props) {
  const [sIsValid, setIsValid] = useState(false);

  const rAreaCanvas = useRef<HTMLCanvasElement>(null);

  const [sCG, setCG] = useState<Position>({ x: 0, y: 0 });

  // check if it's a valid polygon
  useEffect(() => {
    const validation = validate(props.points, props.savedLines);

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

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, props.sCanvasWidth, props.sCanvasHeight);

    ctx.beginPath();
    ctx.moveTo(props.points[0].snappedPoint.x, props.points[0].snappedPoint.y);

    for (let i = 1; i < props.points.length; i++) {
      ctx.lineTo(
        props.points[i].snappedPoint.x,
        props.points[i].snappedPoint.y
      );
    }
    ctx.fillStyle = props.bg;
    ctx.fill();

    const xGravityCenter =
      props.points.reduce((acc, point) => acc + point.snappedPoint.x, 0) /
      props.points.length;
    const yGravityCenter =
      props.points.reduce((acc, point) => acc + point.snappedPoint.y, 0) /
      props.points.length;

    setCG({ x: xGravityCenter, y: yGravityCenter });

    setIsValid(true);
  }, [
    props.points,
    props.savedLines,
    props.sCanvasWidth,
    props.sCanvasHeight,
    props.bg
  ]);

  return (
    <div className='absolute z-10 w-full h-full'>
      <canvas
        ref={rAreaCanvas}
        width={props.sCanvasWidth}
        height={props.sCanvasHeight}
        className={`opacity-20 ${sIsValid ? '' : 'hidden'}`}
      ></canvas>

      <div
        className={`absolute opacity-50 ${sIsValid ? '' : 'hidden'}`}
        style={{
          top: sCG.y,
          left: sCG.x
        }}
      >
        {calcArea(
          props.points.map((p) => p.snappedPoint),
          (props.sGridDimension * props.sGridSize) / props.sCanvasWidth
        ).toFixed(2)}
        &nbsp;
        {props.sGridUnit}&nbsp;²
      </div>
    </div>
  );
}
