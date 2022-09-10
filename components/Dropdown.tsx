import { useState } from 'react';

export default function Dropdown(props) {
  const [sIsExpanded, setIsExpanded] = useState(false);

  return (
    <div className='absolute top-0 z-50 flex flex-col items-center justify-center bg-gray-300 rounded-md'>
      <div
        onClick={() => {
          setIsExpanded(!sIsExpanded);
        }}
        className='flex flex-row items-center gap-4 px-4 py-2 text-sm text-center text-gray-800 rounded-md cursor-pointer hover:bg-gray-500 hover:bg-opacity-50'
      >
        <span>{props.text}</span>

        {sIsExpanded ? (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-4 h-4'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M4.5 15.75l7.5-7.5 7.5 7.5'
            />
          </svg>
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-4 h-4'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M19.5 8.25l-7.5 7.5-7.5-7.5'
            />
          </svg>
        )}
      </div>

      {sIsExpanded ? props.children : null}
    </div>
  );
}
