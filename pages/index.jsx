import { useEffect, useState } from 'react';

import HeaderToolbar from '../components/HeaderToolbar';

import Canvas from '../components/Canvas';

import FooterToolbar from '../components/FooterToolbar';

export default function Home() {
  const [sGridSize, setGridSize] = useState(64);

  const [sSelecting, setSelecting] = useState(null);

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

  const [sGridDimension, setGridDimension] = useState(1);
  const [sGridUnit, setGridUnit] = useState('m');

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
      }
    });
  }, []);

  return (
    <div className='flex flex-col w-screen h-screen pt-4'>
      <HeaderToolbar fSetCanvasSelecting={setSelecting} />

      <Canvas
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
        // grid dimensions & setters
        sGridDimension={sGridDimension}
        setGridDimension={setGridDimension}
        sGridUnit={sGridUnit}
        setGridUnit={setGridUnit}
        // clear cache
        fClearCache={clearCache}
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
