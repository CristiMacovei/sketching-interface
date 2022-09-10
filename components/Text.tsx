import { useState, useRef, useEffect } from 'react';

import { custom } from '../types/t';

type ComponentProps = {
  x: number;
  y: number;
  value: string;
  saved: boolean;
  name?: string;
  fChangeSavedTextValue?: (textName: string, newValue: string) => void;
  worldToScreen: (world: custom.WorldSpacePoint) => custom.PixelSpacePoint;
};

export default function Text(props: ComponentProps) {
  const [sIsInputVisible, setIsInputVisible] = useState(false);

  const rInput = useRef(null);

  useEffect(() => {
    if (sIsInputVisible) {
      rInput.current.value = props.value;
      rInput.current.focus();
    }
  }, [sIsInputVisible, props.value]);

  return (
    <div
      className='absolute z-30'
      style={{
        top: props.worldToScreen({ x: props.x, y: props.y }).y,
        left: props.worldToScreen({ x: props.x, y: props.y }).x
      }}
    >
      {props.saved ? (
        sIsInputVisible ? (
          <textarea
            className={`w-64 p-2 h-20 bg-gray-100 outline-none caret-black ${
              sIsInputVisible ? '' : 'hidden'
            }`}
            ref={rInput}
            onBlur={() => {
              props.fChangeSavedTextValue(props.name, rInput.current.value);

              setIsInputVisible(false);
            }}
            onKeyDown={(evt) => {
              evt.stopPropagation();
            }}
          />
        ) : (
          <span
            onClick={() => {
              setIsInputVisible(true);
            }}
          >
            {props.value}
          </span>
        )
      ) : (
        <span> text </span>
      )}
    </div>
  );
}
