import React from 'react';

import Button from './Button';

export default function HeaderToolbar() {
  return (
    <div className='flex mx-auto w-4/5 items-center justify-between'>
      {/* left  */}
      <div>
        <Button text='Export Sketch' />
      </div>

      {/* middle buttons */}
      <div>
        <div className='flex flex-row items-center justify-center'>
          <Button text='/' />
        </div>
      </div>

      {/* right */}
      <div>
        <Button text='Text' />
      </div>
    </div>
  );
}
