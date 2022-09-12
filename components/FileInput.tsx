import React, { useRef } from 'react';

import Button from './Button';

type ComponentProps = {
  fEvent: (evt: any) => void;
};

export default function FileInput({ fEvent }: ComponentProps) {
  const refFileInput = useRef<HTMLInputElement>(null);

  function handleFileChange(evt: any) {
    fEvent(evt);
  }

  function triggerUpload() {
    refFileInput.current.click();
  }

  return (
    <>
      <Button
        fClick={triggerUpload}
        text='Load Local Sketch'
        textAlign='left'
      />

      <input
        type='file'
        onChange={handleFileChange}
        accept='application/json'
        className='hidden'
        ref={refFileInput}
      />
    </>
  );
}
