import React from 'react';

import Dropdown from './Dropdown';
import Button from './Button';

import { calcArea } from './Area';

import { custom } from '../types/t';

type ComponentProps = {
  setSelectionMode: (value: custom.SelectionMode) => void;
  canvasParams: custom.CanvasParams;

  // unit functions
  unitLengthToPixels: (unitLength: number) => number;
  pixelLengthToUnits: (pixelLength: number) => number;
  screenToWorld: (screen: custom.PixelSpacePoint) => custom.WorldSpacePoint;
  worldToScreen: (world: custom.WorldSpacePoint) => custom.PixelSpacePoint;

  savedPoints: custom.SavedPoint[];
  savedLines: custom.SavedLine[];
  savedAreas: custom.Area[];
  savedTexts: custom.Text[];
  refExportCanvas: React.MutableRefObject<HTMLCanvasElement>;
};

export default function HeaderToolbar(props: ComponentProps) {
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

  function exportToPNG() {
    console.log(
      props.savedPoints,
      props.savedLines,
      props.savedAreas,
      props.savedTexts
    );

    console.log('Points', props.savedPoints);
    console.log('Lines', props.savedLines);
    console.log('Areas', props.savedAreas);
    console.log('Texts', props.savedTexts);

    console.log(
      'Dimensions',
      props.canvasParams.width,
      props.canvasParams.height
    );

    const tmpCanvas = props.refExportCanvas.current;
    console.log(tmpCanvas);

    const ctx = tmpCanvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);

    ctx.fillStyle = 'red';
    props.savedPoints.forEach((p) => {
      const screenPos = props.worldToScreen({
        x: p.x,
        y: p.y
      });

      ctx.beginPath();
      ctx.arc(screenPos.x, screenPos.y, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    });

    ctx.strokeStyle = 'red';
    props.savedLines.forEach((l) => {
      const firstScreenPos = props.worldToScreen({
        x: l.first.x,
        y: l.first.y
      });

      const secondScreenPos = props.worldToScreen({
        x: l.second.x,
        y: l.second.y
      });

      ctx.beginPath();
      ctx.moveTo(firstScreenPos.x, firstScreenPos.y);
      ctx.lineTo(secondScreenPos.x, secondScreenPos.y);
      ctx.closePath();
      ctx.stroke();

      // draw the text
      const xDelta = l.second.x - l.first.x;
      const yDelta = l.second.y - l.first.y;
      const length = Math.sqrt(xDelta * xDelta + yDelta * yDelta);

      const xScreenDelta = secondScreenPos.x - firstScreenPos.x;
      const yScreenDelta = secondScreenPos.y - firstScreenPos.y;
      const atan = Math.atan2(yScreenDelta, xScreenDelta);

      ctx.save();
      ctx.translate(
        (firstScreenPos.x + secondScreenPos.x) / 2,
        (firstScreenPos.y + secondScreenPos.y) / 2
      );
      ctx.rotate(Math.abs(atan) > Math.PI / 2 ? atan + Math.PI : atan);
      ctx.textAlign = 'center';
      ctx.fillText(
        `${length.toFixed(2)} ${props.canvasParams.gridUnit.name}`,
        0,
        -10
      );
      ctx.restore();
    });

    ctx.save();
    ctx.globalAlpha = 0.2;
    props.savedAreas.forEach((a) => {
      const pointPositions = a.points.map(({ x, y }) =>
        props.worldToScreen({ x, y })
      );

      ctx.fillStyle = '#00ff00';
      ctx.beginPath();
      ctx.moveTo(pointPositions[0].x, pointPositions[0].y);
      for (let i = 1; i < pointPositions.length; ++i) {
        ctx.lineTo(pointPositions[i].x, pointPositions[i].y);
      }
      ctx.closePath();
      ctx.fill();

      const xGravityCenter =
        a.points.reduce((acc, point) => acc + point.x, 0) / a.points.length;
      const yGravityCenter =
        a.points.reduce((acc, point) => acc + point.y, 0) / a.points.length;

      const { x: xScreenGravityCenter, y: yScreenGravityCenter } =
        props.worldToScreen({
          x: xGravityCenter,
          y: yGravityCenter
        });

      ctx.globalAlpha = 0.666;
      ctx.fillStyle = '#224422';
      ctx.fillText(
        `${calcArea(a.points).toFixed(2)} ${props.canvasParams.gridUnit.name}²`,
        xScreenGravityCenter,
        yScreenGravityCenter
      );
    });
    ctx.restore();

    ctx.fillStyle = '#000'; // black
    props.savedTexts.forEach((t) => {
      const screenPos = props.worldToScreen({
        x: t.xTop,
        y: t.yTop
      });

      ctx.fillText(t.value, screenPos.x, screenPos.y);
    });

    const dataURL = tmpCanvas.toDataURL();

    const tmpLink = document.createElement('a');
    tmpLink.href = dataURL;
    tmpLink.download = 'sketch.png';

    tmpLink.click();
  }

  return (
    <div className='relative flex items-center justify-between w-4/5 mx-auto'>
      {/* left  */}
      <div>
        <Dropdown text='Export Sketch'>
          <Button
            text='Export to PNG'
            className='w-full text-left bg-transparent'
            textAlign='left'
            fClick={exportToPNG}
          />
        </Dropdown>
      </div>

      {/* middle buttons */}
      <div>
        <div className='flex flex-row items-center justify-center gap-2'>
          <Button text='/' fClick={handleLineToolClick} />
          <Button text='A' fClick={handleAreaToolClick} />
          <Button text='P' fClick={handlePanToolClick} />
        </div>
      </div>

      {/* right */}
      <div>
        <Button text='Text' fClick={handleTextToolClick} />
      </div>
    </div>
  );
}
