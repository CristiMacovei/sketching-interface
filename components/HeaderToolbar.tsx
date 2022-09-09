import React from 'react';

import Dropdown from './Dropdown';
import Button from './Button';

import { ccw, calcArea } from './Area';

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

  function handlePanToolClick() {
    console.log('Pan tool clicked');

    props.fSetCanvasSelecting('pan');
  }

  function handleTextToolClick() {
    console.log('Text tool clicked');

    if (typeof props.fSetCanvasSelecting === 'function') {
      props.fSetCanvasSelecting('text');
    }
  }

  function exportToPNG() {
    console.log(
      props.sSavedPoints,
      props.sSavedLines,
      props.sSavedAreas,
      props.sSavedTexts
    );

    console.log('Points', props.sSavedPoints);
    console.log('Lines', props.sSavedLines);
    console.log('Areas', props.sSavedAreas);
    console.log('Texts', props.sSavedTexts);

    console.log('Dimensions', props.sCanvasWidth, props.sCanvasHeight);

    const tmpCanvas = props.rExportCanvas.current;
    console.log(tmpCanvas);

    const ctx = tmpCanvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);

    ctx.fillStyle = 'red';
    props.sSavedPoints.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    });

    ctx.strokeStyle = 'red';
    props.sSavedLines.forEach((l) => {
      ctx.beginPath();
      ctx.moveTo(l.first.x, l.first.y);
      ctx.lineTo(l.second.x, l.second.y);
      ctx.closePath();
      ctx.stroke();

      // draw the text
      const xDelta = l.second.x - l.first.x;
      const yDelta = l.second.y - l.first.y;
      const atan = Math.atan2(yDelta, xDelta);
      const lengthInPixels = Math.sqrt(xDelta * xDelta + yDelta * yDelta);
      const lengthInUnits =
        props.sGridUnit === 'px'
          ? lengthInPixels
          : (lengthInPixels / (props.sCanvasWidth / props.sGridSize)) *
            props.sGridDimension;

      ctx.save();
      ctx.translate((l.first.x + l.second.x) / 2, (l.first.y + l.second.y) / 2);
      ctx.rotate(Math.abs(atan) > Math.PI / 2 ? atan + Math.PI : atan);
      ctx.textAlign = 'center';
      ctx.fillText(`${lengthInUnits.toFixed(2)} ${props.sGridUnit}`, 0, -10);
      ctx.restore();
    });

    ctx.save();
    ctx.globalAlpha = 0.2;
    props.sSavedAreas.forEach((a) => {
      ctx.fillStyle = '#00ff00';
      ctx.beginPath();
      ctx.moveTo(a.points[0].x, a.points[0].y);
      for (let i = 1; i < a.points.length; ++i) {
        ctx.lineTo(a.points[i].x, a.points[i].y);
      }
      ctx.closePath();
      ctx.fill();

      const xGravityCenter =
        a.points.reduce((acc, point) => acc + point.x, 0) / a.points.length;
      const yGravityCenter =
        a.points.reduce((acc, point) => acc + point.y, 0) / a.points.length;

      ctx.globalAlpha = 0.666;
      ctx.fillStyle = '#224422';
      ctx.fillText(
        `${calcArea(
          a.points,
          (props.sGridDimension * props.sGridSize) / props.sCanvasWidth
        ).toFixed(2)} ${props.sGridUnit}²`,
        xGravityCenter,
        yGravityCenter
      );
    });
    ctx.restore();

    ctx.fillStyle = '#000'; // black
    props.sSavedTexts.forEach((t) => {
      ctx.fillText(t.text, t.x, t.y);
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
