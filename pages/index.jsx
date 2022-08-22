import { useState } from 'react';

import HeaderToolbar from '../components/HeaderToolbar';

import Canvas from '../components/Canvas';

import FooterToolbar from '../components/FooterToolbar';

export default function Home() {
  const [sGridSize, setGridSize] = useState(64);

  const [sSelecting, setSelecting] = useState(null);

  const [sCachedPoints, setCachedPoints] = useState({
    tools: {
      line: []
    }
  });
  const [sCachedLines, setCachedLines] = useState([]);

  const [sSavedPoints, setSavedPoints] = useState([]);
  const [sSavedLines, setSavedLines] = useState([]);

  const [sGridDimension, setGridDimension] = useState(null);
  const [sGridUnit, setGridUnit] = useState('px');

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
        // grid dimensions & setters
        sGridDimension={sGridDimension}
        setGridDimension={setGridDimension}
        sGridUnit={sGridUnit}
        setGridUnit={setGridUnit}
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
