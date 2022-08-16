import React from 'react';

import Button from './Button';

export default function FooterToolbar() {
  return (
    <div className='flex mx-auto mt-10 w-4/5 items-center justify-end'>
      {/* right */}
      <div>
        <Button text='Grid' />
      </div>
    </div>
  );
}
