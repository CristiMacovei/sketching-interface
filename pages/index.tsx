import React, { useEffect, useState, useRef } from 'react';

import HeaderToolbar from '../components/HeaderToolbar';

import Canvas from '../components/Canvas';

import FooterToolbar from '../components/FooterToolbar';

type SelectedState = null | 'line-first-point' | 'line-second-point' | string;

export default function Home() {
  const [sGridSize, setGridSize] = useState(64);
  const [sCanvasWidth, setCanvasWidth] = useState(0);
  const [sCanvasHeight, setCanvasHeight] = useState(0);

  const [sSelecting, setSelecting] = useState<SelectedState>(null);

  const [sCachedPoints, setCachedPoints] = useState({
    tools: {
      line: [],
      area: []
    }
  });
  const [sCachedLines, setCachedLines] = useState([]);

  const [sSavedPoints, setSavedPoints] = useState([]);
  const [sSavedLines, setSavedLines] = useState([]);
  const [sSavedAreas, setSavedAreas] = useState([]);

  const [sCachedText, setCachedText] = useState(null);
  const [sSavedTexts, setSavedTexts] = useState([]);

  const [sGridDimension, setGridDimension] = useState(1);
  const [sGridUnit, setGridUnit] = useState('m');

  const [sCanvasCenterWorldX, setCanvasCenterWorldX] = useState(0);
  const [sCanvasCenterWorldY, setCanvasCenterWorldY] = useState(0);

  const rExportCanvas = useRef(null);

  function clearCache() {
    setCachedPoints({
      tools: {
        line: [],
        area: []
      }
    });
    setCachedLines([]);
  }

  useEffect(() => {
    window.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        clearCache();

        setSelecting(null);
      } else if (evt.key === 'l') {
        clearCache();

        setSelecting('line-first-point');
      } else if (evt.key === 'a') {
        clearCache();

        setSelecting('area-point-1');
      } else if (evt.key === 't') {
        clearCache();

        setSelecting('text');
      }
    });
  }, []);

  return (
    <div className='flex flex-col w-screen h-screen pt-4'>
      <HeaderToolbar
        fSetCanvasSelecting={setSelecting}
        // canvas dimensions for export
        sCanvasWidth={sCanvasWidth}
        sCanvasHeight={sCanvasHeight}
        // dimensions
        sGridDimension={sGridDimension}
        sGridUnit={sGridUnit}
        sGridSize={sGridSize}
        // saved stuff for export
        sSavedPoints={sSavedPoints}
        sSavedLines={sSavedLines}
        sSavedAreas={sSavedAreas}
        sSavedTexts={sSavedTexts}
        // export canvas
        rExportCanvas={rExportCanvas}
      />

      <Canvas
        // canvas center world pos
        sCanvasCenterWorldX={sCanvasCenterWorldX}
        fSetCanvasCenterWorldX={setCanvasCenterWorldX}
        sCanvasCenterWorldY={sCanvasCenterWorldY}
        fSetCanvasCenterWorldY={setCanvasCenterWorldY}
        // grid size
        sGridSize={sGridSize}
        // selecting state & setter
        sSelecting={sSelecting}
        fSetSelecting={setSelecting}
        // saved points & setter
        sSavedPoints={sSavedPoints}
        fSetSavedPoints={setSavedPoints}
        // cached points & setter
        sCachedPoints={sCachedPoints}
        fSetCachedPoints={setCachedPoints}
        // saved lines & setter
        sSavedLines={sSavedLines}
        fSetSavedLines={setSavedLines}
        // cached lines & setter
        sCachedLines={sCachedLines}
        fSetCachedLines={setCachedLines}
        // saved areas & setter
        sSavedAreas={sSavedAreas}
        fSetSavedAreas={setSavedAreas}
        // cached text & setter
        sCachedText={sCachedText}
        fSetCachedText={setCachedText}
        // saved texts & setter
        sSavedTexts={sSavedTexts}
        fSetSavedTexts={setSavedTexts}
        // grid dimensions & setters
        sGridDimension={sGridDimension}
        setGridDimension={setGridDimension}
        sGridUnit={sGridUnit}
        setGridUnit={setGridUnit}
        sCanvasWidth={sCanvasWidth}
        fSetCanvasWidth={setCanvasWidth}
        sCanvasHeight={sCanvasHeight}
        fSetCanvasHeight={setCanvasHeight}
        // clear cache
        fClearCache={clearCache}
        // export canvas
        rExportCanvas={rExportCanvas}
      />

      <FooterToolbar
        // grid dimensions
        sGridDimension={sGridDimension}
        setGridDimension={setGridDimension}
        sGridUnit={sGridUnit}
        setGridUnit={setGridUnit}
      />
    </div>
  );
}
