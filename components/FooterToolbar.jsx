import React from 'react';

import GridSizeInput from './GridSizeInput';

export default function FooterToolbar(props) {
  return (
    <div className='flex items-center justify-end w-4/5 mx-auto mt-10'>
      {/* right */}
      <GridSizeInput
        sGridDimension={props.sGridDimension}
        setGridDimension={props.setGridDimension}
        sGridUnit={props.sGridUnit}
        setGridUnit={props.setGridUnit}
      />
    </div>
  );
}
