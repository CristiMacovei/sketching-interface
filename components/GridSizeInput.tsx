import { useEffect, useRef } from 'react';
import { custom } from '../types/t';

type ComponentProps = {
  canvasParams: custom.CanvasParams;
};

export default function GridSizeInput({ canvasParams }: ComponentProps) {
  const rDimensionInput = useRef(null);
  const rUnitSelect = useRef(null);

  useEffect(() => {
    const dimensionInput = rDimensionInput.current;
    if (dimensionInput && canvasParams.worldUnitsPerCell) {
      dimensionInput.value = canvasParams.worldUnitsPerCell;
    }

    const unitSelect = rUnitSelect.current;
    if (unitSelect) {
      unitSelect.value = canvasParams.gridUnit.name;
    }
  }, [canvasParams]);

  useEffect(() => {
    const dimensionInput = rDimensionInput.current;
    if (
      dimensionInput &&
      (dimensionInput.value === '' || dimensionInput.value === 0)
    ) {
      dimensionInput.value = 1;
      canvasParams.setWorldUnitsPerCell(1);
    }
  }, [canvasParams]);

  function handleDimensionInputChange(evt) {
    const dimensionInput = rDimensionInput.current;
    if (dimensionInput) {
      canvasParams.setWorldUnitsPerCell(dimensionInput.value);
    }
  }

  function handleUnitSelectChange(evt) {
    const unitSelect = rUnitSelect.current;
    if (unitSelect) {
      const longName = unitSelect.value === 'ft' ? 'Feet' : 'Meters';

      canvasParams.setGridUnit({
        name: unitSelect.value,
        longName
      });
    }

    console.log('handleUnitSelectChange', unitSelect.value);
  }

  return (
    <div className='flex items-center justify-start w-1/4'>
      <select
        className='w-2/5 p-2 mr-2 bg-white border border-gray-400 rounded-lg outline-none '
        ref={rUnitSelect}
        onChange={handleUnitSelectChange}
      >
        <option value='m'>Meters</option>
        <option value='ft'>Feet</option>
      </select>

      <input
        type='number'
        className={`w-2/5 p-2 mr-2 bg-white border border-gray-400 rounded-lg outline-none`}
        ref={rDimensionInput}
        onChange={handleDimensionInputChange}
      />
      <span className='w-1/5'>{`${canvasParams.gridUnit.name} / cell`}</span>
    </div>
  );
}
