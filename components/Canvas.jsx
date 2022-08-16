import { useEffect, useState, useRef } from 'react';

export default function Canvas() {
  const [sGridSize, setGridSize] = useState(64);

  const [sSelecting, setSelecting] = useState(null);

  const [sCanvasLeft, setCanvasLeft] = useState(null);
  const [sCanvasTop, setCanvasTop] = useState(null);

  const [sMouseX, setMouseX] = useState(null);
  const [sMouseY, setMouseY] = useState(null);

  const rMainCanvasDiv = useRef(null);

  useEffect(() => {
    const boundingRect = rMainCanvasDiv.current.getBoundingClientRect();

    setCanvasLeft(Math.round(boundingRect.left));
    setCanvasTop(Math.round(boundingRect.top));
  }, []);

  function handleMouseMove(evt) {
    console.log('MUIE');

    setMouseX(evt.clientX - sCanvasLeft);
    setMouseY(evt.clientY - sCanvasTop);
  }

  return (
    <div
      className='mt-6 relative bg-white border border-gray-700 aspect-video grow mx-auto'
      onMouseMove={handleMouseMove}
      ref={rMainCanvasDiv}
    >
      {/* grid vertical lines*/}
      <div className='absolute w-full h-full flex flex-row justify-between p-0'>
        {Array(sGridSize)
          .fill(0)
          .map((_, index) => {
            return (
              <div
                key={`grid-line-v-${index}`}
                className='bg-gray-400 bg-opacity-60 w-px h-full'
              ></div>
            );
          })}
      </div>

      {/* grid horizontal lines*/}
      <div className='absolute w-full h-full flex flex-col justify-between p-0'>
        {Array((sGridSize * 9) / 16)
          .fill(0)
          .map((_, index) => {
            return (
              <div
                key={`grid-line-v-${index}`}
                className='bg-gray-400 bg-opacity-60 h-px w-full'
              ></div>
            );
          })}
      </div>

      {/* test */}
      <div className='absolute w-full h-full flex flex-col justify-between p-0'>
        <span>{`Client: X = ${sMouseX}, Y = ${sMouseY}`}</span>
      </div>

      {/* second test */}
      <div
        className='absolute w-1 h-1 rounded-full bg-red-500'
        style={{
          top: sMouseY,
          left: sMouseX
        }}
      />
    </div>
  );
}
