import { useState, useEffect, useRef } from 'react';

export default function Area(props) {
  const [sIsValid, setIsValid] = useState(false);

  const rAreaCanvas = useRef(null);

  const [sCG, setCG] = useState({ x: null, y: null });

  function ccw(p1, p2) {
    return p1.x * p2.y - p1.y * p2.x;
  }

  function calcArea(points) {
    var total = 0;

    const xGravityCenter =
      props.points.reduce((acc, point) => acc + point.x, 0) /
      props.points.length;
    const yGravityCenter =
      props.points.reduce((acc, point) => acc + point.y, 0) /
      props.points.length;

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

    // sCamvasWidth ... props.sGridDimension * props.sGridSize
    // px           ... x
    // x =
    return (
      Math.abs(total) *
      ((props.sGridDimension * props.sGridSize) / props.sCanvasWidth) *
      ((props.sGridDimension * props.sGridSize) / props.sCanvasWidth)
    );
  }

  // check if it's a valid polygon
  useEffect(() => {
    if (!props.points || props.points.length <= 2) {
      setIsValid(false);

      return;
    }

    let isValid = true;
    for (let i = 0; i < props.points.length - 1; i++) {
      const p1 = props.points[i].snappedPoint;
      const p2 = props.points[i + 1].snappedPoint;

      if (
        !props.savedLines.find(
          (l) =>
            (l.first.name === p1.name && l.second.name === p2.name) ||
            (l.first.name === p2.name && l.second.name === p1.name)
        )
      ) {
        console.log(
          `No line between ${p1.name} (${i}) and ${p2.name} (${i + 1})`
        );
        isValid = false;
        break;
      }
    }

    if (!isValid) {
      setIsValid(false);
      return;
    }

    const ctx = rAreaCanvas.current.getContext('2d');
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
    <div className='absolute w-full h-full'>
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
        {calcArea(props.points.map((p) => p.snappedPoint)).toFixed(2)}&nbsp;
        {props.sGridUnit}&nbsp;²
      </div>
    </div>
  );
}
