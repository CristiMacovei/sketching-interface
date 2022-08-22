import { useEffect, useState, useRef, useCallback } from 'react';

export default function Line(props) {
  const [sLength, setLength] = useState(0);
  const [sUnitLength, setUnitLength] = useState(0);
  const [sAngle, setAngle] = useState(0);

  const [sIsLengthInputVisible, setIsLengthInputVisible] = useState(false);
  const [sIsAngleInputVisible, setIsAngleInputVisible] = useState(false);

  const refLengthInput = useRef(null);
  const refAngleInput = useRef(null);

  const pixelsToUnits = useCallback(
    (lengthInPixels) => {
      return props.sGridUnit === 'px'
        ? lengthInPixels
        : (lengthInPixels / (props.sCanvasWidth / props.sGridSize)) *
            props.sGridDimension;
    },
    [props.sGridUnit, props.sCanvasWidth, props.sGridSize, props.sGridDimension]
  );

  const unitsToPixels = useCallback(
    (lengthInUnits) => {
      return props.sGridUnit === 'px'
        ? lengthInUnits
        : (lengthInUnits / props.sGridDimension) *
            (props.sCanvasWidth / props.sGridSize);
    },
    [props.sGridUnit, props.sCanvasWidth, props.sGridSize, props.sGridDimension]
  );

  useEffect(() => {
    console.log(`Changed first: (x: ${props.first.x}, y: ${props.first.y})`);
    console.log(`Changed second: (x: ${props.second.x}, y: ${props.second.y})`);
    const xDelta = props.second.x - props.first.x;
    const yDelta = props.second.y - props.first.y;

    const lengthInPixels = Math.sqrt(xDelta * xDelta + yDelta * yDelta);

    const angleDeg = (Math.atan2(yDelta, xDelta) * 180) / Math.PI;

    const lengthInUnits = pixelsToUnits(lengthInPixels);

    setLength(lengthInPixels);
    setUnitLength(lengthInUnits);
    setAngle(angleDeg);
  }, [props.first, props.second, pixelsToUnits]);

  useEffect(() => {
    refLengthInput.current.value = sUnitLength.toFixed(2);
    refAngleInput.current.value = sAngle.toFixed(2);
  }, [sUnitLength, sAngle]);

  function handleLengthBlur(evt) {
    const newLength = parseFloat(evt.target.value);
    if (isNaN(newLength)) {
      return;
    }

    console.log(
      `New length: ${newLength} ${props.sGridUnit} @ ${props.sGridDimension} / cell`
    );

    const newLengthInPixels = unitsToPixels(newLength);

    console.log(`New length: ${newLengthInPixels} pixels`);

    const newSecondX =
      props.first.x + Math.cos((sAngle * Math.PI) / 180) * newLengthInPixels;
    const newSecondY =
      props.first.y + Math.sin((sAngle * Math.PI) / 180) * newLengthInPixels;

    console.log(`Old first: (x: ${props.first.x}, y: ${props.first.y})`);
    console.log(`New second: (x: ${newSecondX}, y: ${newSecondY})`);

    props.fChangeSavedPointData(props.second.name, newSecondX, newSecondY);

    setIsLengthInputVisible(false);
  }

  function handleAngleBlur(evt) {
    const newAngle = parseFloat(evt.target.value);
    if (isNaN(newAngle)) {
      return;
    }

    const newSecondX =
      props.first.x + Math.cos((newAngle * Math.PI) / 180) * sLength;
    const newSecondY =
      props.first.y + Math.sin((newAngle * Math.PI) / 180) * sLength;

    props.fChangeSavedPointData(props.second.name, newSecondX, newSecondY);

    setIsAngleInputVisible(false);
  }

  //* autofocus inputs
  useEffect(() => {
    if (sIsLengthInputVisible) {
      refLengthInput.current.focus();
    }
  }, [sIsLengthInputVisible]);

  useEffect(() => {
    if (sIsAngleInputVisible) {
      refAngleInput.current.focus();
    }
  }, [sIsAngleInputVisible]);

  return (
    <div
      className='absolute text-center origin-bottom-left bg-red-600'
      style={{
        top: props.first.y + 2,
        left: props.first.x + 2,
        width: sLength,
        height: 1,
        transform: `rotate(${sAngle}deg)`
      }}
    >
      <div
        className='absolute bottom-0.5 left-0 z-10 w-full text-base text-center text-opacity-50'
        style={{
          transform: Math.abs(sAngle) > 90 ? 'rotate(180deg)' : ''
        }}
      >
        <span
          className='relative'
          onClick={() => setIsLengthInputVisible(true)}
        >
          {sUnitLength.toFixed(2)} {props.sGridUnit}
          <input
            // onBlur={() => setIsLengthInputVisible(false)}
            type='text'
            step={1}
            className='absolute bottom-0 left-0 w-20 bg-gray-100 outline-none caret-black'
            ref={refLengthInput}
            onBlur={handleLengthBlur}
            style={{
              display: sIsLengthInputVisible ? 'block' : 'none',
              maxWidth: '200%'
            }}
          />
        </span>
      </div>

      <div
        className='absolute top-0.5 left-0 z-10 w-full text-base text-center text-opacity-50'
        style={{
          transform: Math.abs(sAngle) > 90 ? 'rotate(180deg)' : ''
        }}
      >
        <span
          className='relative'
          onClick={() => setIsAngleInputVisible(true)}
          style={{
            transform: Math.abs(sAngle) > 90 ? 'rotate(180deg)' : '',
            textAlign: Math.abs(sAngle) > 90 ? 'right' : 'left'
          }}
        >
          {sAngle.toFixed(2)} deg
          <input
            type='text'
            step={1}
            className='absolute bottom-0 left-0 w-20 bg-gray-100 outline-none caret-black'
            ref={refAngleInput}
            onBlur={handleAngleBlur}
            style={{
              display: sIsAngleInputVisible ? 'block' : 'none',
              maxWidth: '200%'
            }}
          />
        </span>
      </div>
    </div>
  );
}
