import { useEffect, useState, useRef, useCallback } from 'react';
import { custom } from '../types/t';

type ComponentProps = {
  first: custom.CachedPoint | custom.SavedPoint;
  second: custom.CachedPoint | custom.SavedPoint;
  fChangeSavedPointData: any; //todo figure this one out
  canvasParams: custom.CanvasParams;

  pixelLengthToUnits: (pixelLength: number) => number;
  unitLengthToPixels: (unitLength: number) => number;
  screenToWorld: (value: custom.PixelSpacePoint) => custom.WorldSpacePoint;
  worldToScreen: (value: custom.WorldSpacePoint) => custom.PixelSpacePoint;
};

export default function Line({
  first,
  second,
  fChangeSavedPointData,
  canvasParams,
  pixelLengthToUnits,
  unitLengthToPixels,
  worldToScreen
}: ComponentProps) {
  const [sLength, setLength] = useState(0);
  const [sWorldLength, setWorldLength] = useState(0);
  const [sAngle, setAngle] = useState(0);
  const [sWorldAngle, setWorldAngle] = useState(0);

  const [sFirstPointPos, setFirstPointPos] =
    useState<custom.PixelSpacePoint>(null);
  const [sSecondPointPos, setSecondPointPos] =
    useState<custom.PixelSpacePoint>(null);

  const [sIsLengthInputVisible, setIsLengthInputVisible] = useState(false);
  const [sIsAngleInputVisible, setIsAngleInputVisible] = useState(false);

  const refLengthInput = useRef(null);
  const refAngleInput = useRef(null);

  useEffect(() => {
    // console.log(`Changed first: (x: ${first.x}, y: ${first.y})`);
    // console.log(`Changed second: (x: ${second.x}, y: ${second.y})`);
    //todo trigger this at the right time

    const xWorldDelta = second.x - first.x;
    const yWorldDelta = second.y - first.y;

    const firstPointPos = worldToScreen({
      x: first.x,
      y: first.y
    });
    setFirstPointPos(firstPointPos);

    const secondPointPos = worldToScreen({
      x: second.x,
      y: second.y
    });
    setSecondPointPos(secondPointPos);

    const xScreenDelta = secondPointPos.x - firstPointPos.x;
    const yScreenDelta = secondPointPos.y - firstPointPos.y;

    const worldLength = Math.sqrt(
      xWorldDelta * xWorldDelta + yWorldDelta * yWorldDelta
    );

    const worldAngle = (Math.atan2(yWorldDelta, xWorldDelta) * 180) / Math.PI;
    const screenAngle =
      (Math.atan2(yScreenDelta, xScreenDelta) * 180) / Math.PI;

    const pixelLength = unitLengthToPixels(worldLength);

    setLength(pixelLength);
    setWorldLength(worldLength);
    setAngle(screenAngle);
    setWorldAngle(worldAngle);
  }, [first, second, pixelLengthToUnits, unitLengthToPixels, worldToScreen]);

  useEffect(() => {
    refLengthInput.current.value = sWorldLength.toFixed(2);
    refAngleInput.current.value = sWorldAngle.toFixed(2);
  }, [sWorldLength, sWorldAngle]);

  function handleLengthBlur(evt) {
    const newWorldLength = parseFloat(evt.target.value);
    if (isNaN(newWorldLength)) {
      return;
    }

    console.log(
      `[Line - Info] Changing World Length: ${newWorldLength}${canvasParams.gridUnit.name} @ ${canvasParams.worldUnitsPerCell} / cell`
    );

    const newSecondX =
      first.x + Math.cos((sWorldAngle * Math.PI) / 180) * newWorldLength;

    const newSecondY =
      first.y + Math.sin((sWorldAngle * Math.PI) / 180) * newWorldLength;

    fChangeSavedPointData(second.name, newSecondX, newSecondY);

    setIsLengthInputVisible(false);

    console.log(`Old first: (x: ${first.x}, y: ${first.y})`);
    console.log(`New second: (x: ${newSecondX}, y: ${newSecondY})`);
  }

  function handleAngleBlur(evt) {
    const newWorldAngle = parseFloat(evt.target.value);
    if (isNaN(newWorldAngle)) {
      return;
    }

    const newSecondX =
      first.x + Math.cos((newWorldAngle * Math.PI) / 180) * sWorldLength;
    const newSecondY =
      first.y + Math.sin((newWorldAngle * Math.PI) / 180) * sWorldLength;

    fChangeSavedPointData(second.name, newSecondX, newSecondY);

    setIsAngleInputVisible(false);

    console.log(`Old first: (x: ${first.x}, y: ${first.y})`);
    console.log(`New second: (x: ${newSecondX}, y: ${newSecondY})`);
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
      className={`absolute text-center origin-bottom-left ${
        sWorldAngle % 90 === 0 ? 'bg-green-600' : 'bg-red-600'
      }`}
      style={{
        top: sFirstPointPos?.y ?? 0 + 2,
        left: sFirstPointPos?.x ?? 0 + 2,
        width: sLength,
        height: sAngle % 90 === 0 ? 2 : 1,
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
          {sWorldLength.toFixed(2)} {canvasParams.gridUnit.name}
          <input
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
          {sWorldAngle.toFixed(2)} deg
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
