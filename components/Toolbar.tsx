import React from 'react';

import Dropdown from './Dropdown';
import Button from './Button';
import FileInput from './FileInput';

import { calcArea } from './Area';

import { custom } from '../types/t';

type ComponentProps = {
  setSelectionMode: (value: custom.SelectionMode) => void;

  // canvas params
  canvasParams: custom.CanvasParams;

  // unit functions
  unitLengthToPixels: (unitLength: number) => number;
  pixelLengthToUnits: (pixelLength: number) => number;
  screenToWorld: (screen: custom.PixelSpacePoint) => custom.WorldSpacePoint;
  worldToScreen: (world: custom.WorldSpacePoint) => custom.PixelSpacePoint;

  savedPoints: custom.SavedPoint[];
  setSavedPoints: (value: custom.SavedPoint[]) => void;

  savedLines: custom.SavedLine[];
  setSavedLines: (value: custom.SavedLine[]) => void;

  savedAreas: custom.Area[];
  setSavedAreas: (value: custom.Area[]) => void;

  savedTexts: custom.Text[];
  setSavedTexts: (value: custom.Text[]) => void;
};

export default function Toolbar(props: ComponentProps) {
  function handleLineToolClick() {
    console.log('Line tool clicked');

    props.setSelectionMode('line-first-point');
  }

  function handleAreaToolClick() {
    console.log('Area tool clicked');

    props.setSelectionMode('area-point-1');
  }

  function handlePanToolClick() {
    console.log('Pan tool clicked');

    props.setSelectionMode('pan');
  }

  function handleTextToolClick() {
    console.log('Text tool clicked');

    props.setSelectionMode('text');
  }

  return (
    <div className='flex flex-row items-center justify-center gap-2'>
      <Button text='/' fClick={handleLineToolClick} />
      <Button text='A' fClick={handleAreaToolClick} />
      <Button text='P' fClick={handlePanToolClick} />
      <Button text='T' fClick={handleTextToolClick} />
    </div>
  );
}
