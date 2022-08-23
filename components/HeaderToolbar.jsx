import React from 'react';

import Button from './Button';

export default function HeaderToolbar(props) {
  function handleLineToolClick() {
    console.log('Line tool clicked');

    if (typeof props.fSetCanvasSelecting === 'function') {
      props.fSetCanvasSelecting('line-first-point');
    }
  }

  function handleAreaToolClick() {
    console.log('Area tool clicked');

    if (typeof props.fSetCanvasSelecting === 'function') {
      props.fSetCanvasSelecting('area-point-1');
    }
  }

  return (
    <div className='flex items-center justify-between w-4/5 mx-auto'>
      {/* left  */}
      <div>
        <Button text='Export Sketch' />
      </div>

      {/* middle buttons */}
      <div>
        <div className='flex flex-row items-center justify-center gap-2'>
          <Button text='/' fClick={handleLineToolClick} />
          <Button text='A' fClick={handleAreaToolClick} />
        </div>
      </div>

      {/* right */}
      <div>
        <Button text='Text' />
      </div>
    </div>
  );
}
