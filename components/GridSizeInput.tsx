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
    if (
      unitSelect &&
      (props.sGridUnit === 'px' ||
        props.sGridUnit === 'm' ||
        props.sGridUnit === 'm')
    ) {
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
      props.setGridUnit(unitSelect.value);
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
        <option value='px'>Pixels</option>
      </select>

      <input
        type='number'
        className={`w-2/5 p-2 mr-2 bg-white border border-gray-400 rounded-lg outline-none`}
        ref={rDimensionInput}
        onChange={handleDimensionInputChange}
        disabled={props.sGridUnit === 'px'}
      />
      <span className='w-1/5'>
        {props.sGridUnit === 'px' ? '' : `${props.sGridUnit} / cell`}
      </span>
    </div>
  );
}
