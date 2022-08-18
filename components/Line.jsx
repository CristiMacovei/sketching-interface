import { useEffect, useState, useRef } from 'react';

export default function Line(props) {
  const [sLength, setLength] = useState(0);
  const [sAngle, setAngle] = useState(0);

  const [sIsLengthInputVisible, setIsLengthInputVisible] = useState(false);
  const [sIsAngleInputVisible, setIsAngleInputVisible] = useState(false);

  const refLengthInput = useRef(null);
  const refAngleInput = useRef(null);

  useEffect(() => {
    const xDelta = props.second.x - props.first.x;
    const yDelta = props.second.y - props.first.y;

    const lengthInPixels = Math.round(
      Math.sqrt(xDelta * xDelta + yDelta * yDelta)
    );

    const angleDeg = (Math.atan2(yDelta, xDelta) * 180) / Math.PI;

    setLength(lengthInPixels);
    setAngle(angleDeg);

    refLengthInput.current.value = lengthInPixels;
    refAngleInput.current.value = Math.round(angleDeg * 100) / 100;
  }, [props.first, props.second]);

  function handleLengthChange(evt) {
    const newLength = evt.target.value;

    const newSecondX =
      props.first.x + Math.cos((sAngle * Math.PI) / 180) * newLength;
    const newSecondY =
      props.first.y + Math.sin((sAngle * Math.PI) / 180) * newLength;

    props.fChangeSavedPointData(props.second.name, newSecondX, newSecondY);
  }

  function handleAngleChange(evt) {
    const newAngle = evt.target.value;

    const newSecondX =
      props.first.x + Math.cos((newAngle * Math.PI) / 180) * sLength;
    const newSecondY =
      props.first.y + Math.sin((newAngle * Math.PI) / 180) * sLength;

    props.fChangeSavedPointData(props.second.name, newSecondX, newSecondY);
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
          {sLength} px
          <input
            onBlur={() => setIsLengthInputVisible(false)}
            type='number'
            step={1}
            className='absolute bottom-0 left-0 w-20 bg-gray-100 outline-none caret-black'
            ref={refLengthInput}
            onChange={handleLengthChange}
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
            onBlur={() => setIsAngleInputVisible(false)}
            type='number'
            step={1}
            className='absolute bottom-0 left-0 w-20 bg-gray-100 outline-none caret-black'
            ref={refAngleInput}
            onChange={handleAngleChange}
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
