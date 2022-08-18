import React from 'react';

import Button from './Button';

export default function FooterToolbar() {
  return (
    <div className='flex items-center justify-end w-4/5 mx-auto mt-10'>
      {/* right */}
      <div>
        <Button text='Grid' />
      </div>
    </div>
  );
}
