import React, { useState } from 'react';

type ComponentProps = {
  refInput: React.MutableRefObject<HTMLInputElement>;

  fChange: React.ChangeEventHandler<HTMLInputElement>;
};

export default function TextInput({ refInput, fChange }: ComponentProps) {
  const [sIsActive, setIsActive] = useState(false);

  function show(evt: React.MouseEvent<HTMLInputElement>) {
    setIsActive(true);
  }

  function hide(evt: React.FocusEvent<HTMLInputElement>) {
    setIsActive(false);
  }

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    fChange(evt);
  }

  function stopKeypressPropagation(evt: React.KeyboardEvent<HTMLInputElement>) {
    evt.stopPropagation();
  }

  return (
    <div>
      <input
        className={`px-4 py-2 bg-white border ${
          sIsActive ? 'border-gray-500' : 'border-transparent'
        } rounded-md outline-none focus:outline-none`}
        type='text'
        onClick={show}
        onBlur={hide}
        onChange={handleChange}
        onKeyDown={stopKeypressPropagation}
        ref={refInput}
      />
    </div>
  );
}
