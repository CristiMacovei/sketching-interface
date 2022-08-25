import { useState, useRef, useEffect } from 'react';

export default function Text(props) {
  const [sIsInputVisible, setIsInputVisible] = useState(false);

  const rInput = useRef(null);

  useEffect(() => {
    if (sIsInputVisible) {
      rInput.current.value = props.text;
      rInput.current.focus();
    }
  }, [sIsInputVisible, props.text]);

  return (
    <div
      className='absolute z-30'
      style={{
        top: props.y,
        left: props.x
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
            {props.text}
          </span>
        )
      ) : (
        <span> text </span>
      )}
    </div>
  );
}
