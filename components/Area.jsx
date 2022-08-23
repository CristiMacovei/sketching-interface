import { useState, useEffect } from 'react';

export default function Area(props) {
  const [sIsValid, setIsValid] = useState(false);

  const [sBoundaries, setBoundaries] = useState({
    xMin: null,
    xMax: null,
    yMin: null,
    yMax: null
  });

  // check if it's a valid polygon
  useEffect(() => {
    if (!props.points || props.points.length <= 2) {
      setIsValid(false);

      return;
    }

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
        setIsValid(false);
        return;
      }
    }

    setIsValid(true);
  }, [props.points, props.savedLines]);

  // calculate boundaries
  useEffect(() => {
    if (!props.points || props.points.length <= 2) {
      setBoundaries({
        xMin: null,
        xMax: null,
        yMin: null,
        yMax: null
      });
    }

    const newBoundaries = { xMin: null, xMax: null, yMin: null, yMax: null };

    for (let { snappedPoint } of props.points) {
      if (snappedPoint.x < newBoundaries.xMin || newBoundaries.xMin === null) {
        newBoundaries.xMin = snappedPoint.x;
      }
      if (snappedPoint.x > newBoundaries.xMax || newBoundaries.xMax === null) {
        newBoundaries.xMax = snappedPoint.x;
      }
      if (snappedPoint.y < newBoundaries.yMin || newBoundaries.yMin === null) {
        newBoundaries.yMin = snappedPoint.y;
      }
      if (snappedPoint.y > newBoundaries.yMax || newBoundaries.yMax === null) {
        newBoundaries.yMax = snappedPoint.y;
      }
    }

    setBoundaries(newBoundaries);
  }, [props.points, sBoundaries]);

  return sIsValid ? (
    <div
      className='absolute bg-green-600 bg-opacity-25'
      style={{
        top: sBoundaries.yMin,
        left: sBoundaries.xMin,
        width: sBoundaries.xMax - sBoundaries.xMin,
        height: sBoundaries.yMax - sBoundaries.yMin
      }}
    ></div>
  ) : null;
}
