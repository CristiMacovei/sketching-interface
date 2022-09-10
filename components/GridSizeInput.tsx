import { useEffect, useRef } from 'react';

export default function GridSizeInput(props) {
  const rDimensionInput = useRef(null);
  const rUnitSelect = useRef(null);

  useEffect(() => {
    const dimensionInput = rDimensionInput.current;
    if (dimensionInput && props.sGridDimension) {
      dimensionInput.value = props.sGridDimension;
    }

    const unitSelect = rUnitSelect.current;
    if (unitSelect && (props.sGridUnit === 'm' || props.sGridUnit === 'ft')) {
      unitSelect.value = props.sGridUnit;
    }
  }, [props.sGridDimension, props.sGridUnit]);

  useEffect(() => {
    const dimensionInput = rDimensionInput.current;
    if (
      dimensionInput &&
      props.sGridUnit !== 'px' &&
      (dimensionInput.value === '' || dimensionInput.value === 0)
    ) {
      dimensionInput.value = 1;
      props.setGridDimension(1);
    }
  });

  function handleDimensionInputChange(evt) {
    const dimensionInput = rDimensionInput.current;
    if (dimensionInput) {
      props.setGridDimension(dimensionInput.value);
    }

    console.log('handleDimensionInputChange', dimensionInput.value);
  }

  function handleUnitSelectChange(evt) {
    const unitSelect = rUnitSelect.current;
    if (unitSelect) {
      const longName = unitSelect.value === 'ft' ? 'Feet' : 'Meters';

      props.setGridUnit({
        name: unitSelect.value,
        longName
      });
    }

    console.log('handleUnitSelectChange', unitSelect.value);
  }

  return (
    <div className='flex items-center justify-start w-1/4 mb-10'>
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
      <span className='w-1/5'>{`${props.sGridUnit.name} / cell`}</span>
    </div>
  );
}
