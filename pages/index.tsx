import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { getCookie, setCookie } from 'cookies-next';

import HeaderToolbar from '../components/HeaderToolbar';

import Canvas from '../components/Canvas';

import FooterToolbar from '../components/FooterToolbar';

import { custom } from '../types/t';
import VFContainer from '../components/VFContainer';

export default function Home() {
  const [sUser, setUser] = useState(null);
  const [sToken, setToken] = useState(null);
  const [sSkecthId, setSketchId] = useState(null);

  const [sSketchName, setSketchName] = useState('Unnamed');

  const [sGridSize, setGridSize] = useState(64);
  const [sCanvasWidth, setCanvasWidth] = useState(0);
  const [sCanvasHeight, setCanvasHeight] = useState(0);

  const [sSelectionMode, setSelectionMode] =
    useState<custom.SelectionMode>(null);

  const [sSelectedPoints, setSelectedPoints] = useState<custom.SavedPoint[]>(
    []
  ); //todo make it able to move more than points

  const [sCachedPoints, setCachedPoints] = useState<custom.CachedPointStorage>({
    tools: {
      line: [],
      area: []
    }
  });
  const [sCachedLines, setCachedLines] = useState<custom.CachedLine[]>([]);

  const [sSavedPoints, setSavedPoints] = useState<custom.SavedPoint[]>([]);
  const [sSavedLines, setSavedLines] = useState([]);
  const [sSavedAreas, setSavedAreas] = useState<custom.Area[]>([]);

  const [sCachedText, setCachedText] = useState<custom.Text>(null);
  const [sSavedTexts, setSavedTexts] = useState<custom.Text[]>([]);

  const [sGridDimension, setGridDimension] = useState(1);
  const [sGridUnit, setGridUnit] = useState<custom.Unit>({
    name: 'm',
    longName: 'Meters'
  });

  const [sCanvasTopLeftScreenX, setCanvasTopLeftScreenX] = useState(0);
  const [sCanvasTopLeftScreenY, setCanvasTopLeftScreenY] = useState(0);

  const [sCanvasCenterWorldX, setCanvasCenterWorldX] = useState(0);
  const [sCanvasCenterWorldY, setCanvasCenterWorldY] = useState(0);

  const rExportCanvas = useRef<HTMLCanvasElement>(null);

  const refNameInput = useRef<HTMLInputElement>(null);

  function handleNameChange(evt: React.ChangeEvent<HTMLInputElement>) {
    setSketchName(evt.target.value);
  }

  function clearCache() {
    setCachedPoints({
      tools: {
        line: [],
        area: []
      }
    });
    setCachedLines([]);
    setCachedText(null);
    setSelectedPoints([]);
  }

  function unitLengthToPixels(unitLength: number): number {
    const numPixelsPerCell = sCanvasWidth / sGridSize;

    const numUnitsPerPixel = sGridDimension / numPixelsPerCell;

    return unitLength / numUnitsPerPixel;
  }

  function pixelLengthToUnits(pixelLength: number): number {
    const numPixelsPerCell = sCanvasWidth / sGridSize;

    const numUnitsPerPixel = sGridDimension / numPixelsPerCell;

    return pixelLength * numUnitsPerPixel;
  }

  // converts canvas coordinates to world coordinates
  function screenToWorld(
    screen: custom.PixelSpacePoint
  ): custom.WorldSpacePoint {
    // canvas centre is { worldCenterX, worldCenterY } in world coordinates

    const xTemp = screen.x + (sCanvasCenterWorldX - sCanvasWidth / 2);

    const yTemp = -screen.y + (sCanvasCenterWorldY + sCanvasHeight / 2);
    // related to modified canvas axes system, but still in pixel value

    const xWorld = pixelLengthToUnits(xTemp);
    const yWorld = pixelLengthToUnits(yTemp);

    return {
      x: sCanvasCenterWorldX + xWorld,
      y: sCanvasCenterWorldY + yWorld
    };
  }

  function worldToScreen(
    world: custom.WorldSpacePoint
  ): custom.PixelSpacePoint {
    const xTempWorld = world.x - sCanvasCenterWorldX;
    const yTempWorld = world.y - sCanvasCenterWorldY;

    const xTemp = unitLengthToPixels(xTempWorld);
    const yTemp = unitLengthToPixels(yTempWorld);

    return {
      x: xTemp - (sCanvasCenterWorldX - sCanvasWidth / 2),
      y: sCanvasCenterWorldY + sCanvasHeight / 2 - yTemp
    };
  }

  // redirect to auth if there's no token
  useEffect(() => {
    (async () => {
      const tokenCookie = getCookie('token');

      if (tokenCookie === null || typeof tokenCookie === 'undefined') {
        window.location.href = '/auth';
      }

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
        token: tokenCookie
      });

      if (res.data.status === 'success') {
        setUser(res.data.user);
        setToken(tokenCookie);
      } else {
        window.location.href = '/auth';
      }
    })();
  }, []);

  // keyboard shortcuts
  useEffect(() => {
    window.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        clearCache();

        setSelectionMode(null);
      } else if (evt.key === 'l') {
        clearCache();

        setSelectionMode('line-first-point');
      } else if (evt.key === 'a') {
        clearCache();

        setSelectionMode('area-point-1');
      } else if (evt.key === 't') {
        clearCache();

        setSelectionMode('text');
      } else if (evt.key === 'p') {
        clearCache();

        setSelectionMode('pan');
      } else if (evt.key === 's') {
        clearCache();

        setSelectionMode('select');
      }
    });
  }, []);

  return sUser ? (
    <VFContainer>
      <HeaderToolbar
        // user data
        user={sUser}
        token={sToken}
        // selection mode
        setSelectionMode={setSelectionMode}
        // canvas params
        canvasParams={{
          width: sCanvasWidth,
          height: sCanvasHeight,
          setWidth: setCanvasWidth,
          setHeight: setCanvasHeight,

          screenTopLeftX: sCanvasTopLeftScreenX,
          screenTopLeftY: sCanvasTopLeftScreenY,
          setScreenTopLeftX: setCanvasTopLeftScreenX,
          setScreenTopLeftY: setCanvasTopLeftScreenY,

          worldCenterX: sCanvasCenterWorldX,
          worldCenterY: sCanvasCenterWorldY,
          setWorldCenterX: setCanvasCenterWorldX,
          setWorldCenterY: setCanvasCenterWorldY,

          gridUnit: sGridUnit,
          gridNumCellsPerRow: sGridSize,
          worldUnitsPerCell: sGridDimension,
          setGridUnit: setGridUnit,
          setGridNumCellsPerRow: setGridSize,
          setWorldUnitsPerCell: setGridDimension
        }}
        // unit functions
        unitLengthToPixels={unitLengthToPixels}
        pixelLengthToUnits={pixelLengthToUnits}
        worldToScreen={worldToScreen}
        screenToWorld={screenToWorld}
        // saved stuff for export
        savedPoints={sSavedPoints}
        setSavedPoints={setSavedPoints}
        savedLines={sSavedLines}
        setSavedLines={setSavedLines}
        savedAreas={sSavedAreas}
        setSavedAreas={setSavedAreas}
        savedTexts={sSavedTexts}
        setSavedTexts={setSavedTexts}
        // export canvas
        refExportCanvas={rExportCanvas}
        // name input
        setSketchName={setSketchName}
        sketchName={sSketchName}
        refNameInput={refNameInput}
        fHandleNameChange={handleNameChange}
        // sketch id
        sketchId={sSkecthId}
        setSketchId={setSketchId}
      />

      <Canvas
        // canvas params
        params={{
          width: sCanvasWidth,
          height: sCanvasHeight,
          setWidth: setCanvasWidth,
          setHeight: setCanvasHeight,

          screenTopLeftX: sCanvasTopLeftScreenX,
          screenTopLeftY: sCanvasTopLeftScreenY,
          setScreenTopLeftX: setCanvasTopLeftScreenX,
          setScreenTopLeftY: setCanvasTopLeftScreenY,

          worldCenterX: sCanvasCenterWorldX,
          worldCenterY: sCanvasCenterWorldY,
          setWorldCenterX: setCanvasCenterWorldX,
          setWorldCenterY: setCanvasCenterWorldY,

          gridUnit: sGridUnit,
          gridNumCellsPerRow: sGridSize,
          worldUnitsPerCell: sGridDimension,
          setGridUnit: setGridUnit,
          setGridNumCellsPerRow: setGridSize,
          setWorldUnitsPerCell: setGridDimension
        }}
        // unit functions
        unitLengthToPixels={unitLengthToPixels}
        pixelLengthToUnits={pixelLengthToUnits}
        worldToScreen={worldToScreen}
        screenToWorld={screenToWorld}
        // selecting state & setter
        mode={sSelectionMode}
        setMode={setSelectionMode}
        // saved points & setter
        savedPoints={sSavedPoints}
        setSavedPoints={setSavedPoints}
        // cached points & setter
        cachedPoints={sCachedPoints}
        setCachedPoints={setCachedPoints}
        // saved lines & setter
        savedLines={sSavedLines}
        setSavedLines={setSavedLines}
        // cached lines & setter
        cachedLines={sCachedLines}
        setCachedLines={setCachedLines}
        // saved areas & setter
        savedAreas={sSavedAreas}
        setSavedAreas={setSavedAreas}
        // cached text & setter
        cachedText={sCachedText}
        setCachedText={setCachedText}
        // saved texts & setter
        savedTexts={sSavedTexts}
        setSavedTexts={setSavedTexts}
        // selected points & setter
        selectedPoints={sSelectedPoints}
        setSelectedPoints={setSelectedPoints}
        // clear cache
        fClearCache={clearCache}
        // export canvas
        refExportCanvas={rExportCanvas}
      />

      <FooterToolbar
        // selection mode
        setSelectionMode={setSelectionMode}
        // canvas params
        canvasParams={{
          width: sCanvasWidth,
          height: sCanvasHeight,
          setWidth: setCanvasWidth,
          setHeight: setCanvasHeight,

          screenTopLeftX: sCanvasTopLeftScreenX,
          screenTopLeftY: sCanvasTopLeftScreenY,
          setScreenTopLeftX: setCanvasTopLeftScreenX,
          setScreenTopLeftY: setCanvasTopLeftScreenY,

          worldCenterX: sCanvasCenterWorldX,
          worldCenterY: sCanvasCenterWorldY,
          setWorldCenterX: setCanvasCenterWorldX,
          setWorldCenterY: setCanvasCenterWorldY,

          gridUnit: sGridUnit,
          gridNumCellsPerRow: sGridSize,
          worldUnitsPerCell: sGridDimension,
          setGridUnit: setGridUnit,
          setGridNumCellsPerRow: setGridSize,
          setWorldUnitsPerCell: setGridDimension
        }}
        // unit functions
        unitLengthToPixels={unitLengthToPixels}
        pixelLengthToUnits={pixelLengthToUnits}
        worldToScreen={worldToScreen}
        screenToWorld={screenToWorld}
        // saved stuff for export
        savedPoints={sSavedPoints}
        setSavedPoints={setSavedPoints}
        savedLines={sSavedLines}
        setSavedLines={setSavedLines}
        savedAreas={sSavedAreas}
        setSavedAreas={setSavedAreas}
        savedTexts={sSavedTexts}
        setSavedTexts={setSavedTexts}
      />
    </VFContainer>
  ) : null;
}
