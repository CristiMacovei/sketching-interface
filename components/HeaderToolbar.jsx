import React from 'react';

import Button from './Button';

export default function HeaderToolbar(props) {
  function handleLineToolClick() {
    console.log('Line tool clicked');

    if (typeof props.fSetCanvasSelecting === 'function') {
      props.fSetCanvasSelecting('line-first-point');
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
        <div className='flex flex-row items-center justify-center'>
          <Button text='/' fClick={handleLineToolClick} />
        </div>
      </div>

      {/* right */}
      <div>
        <Button text='Text' />
      </div>
    </div>
  );
}
