import React from 'react';

import GridSizeInput from './GridSizeInput';
import Toolbar from './Toolbar';

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

export default function FooterToolbar(props: ComponentProps) {
  return (
    <div className='relative flex items-center justify-between w-4/5 mx-auto my-5'>
      {/* left  */}
      <Toolbar {...props} />

      {/* right */}
      <GridSizeInput canvasParams={props.canvasParams} />
    </div>
  );
}
