import { PropsWithChildren } from 'react';

type ComponentProps = {
  fClick: (evt: any) => void;
  text?: string;
  textAlign?: string;
  className?: string;
};

export default function Button(props: PropsWithChildren<ComponentProps>) {
  function handleClick(evt) {
    evt.preventDefault();

    console.log('Button clicked');

    if (typeof props.fClick === 'function') {
      props.fClick(evt);
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`text-sm px-4 py-2 rounded-md ${
        props.textAlign ? `text-${props.textAlign}` : 'text-center'
      } cursor-pointer bg-gray-400 hover:bg-gray-500 hover:bg-opacity-50 bg-opacity-50 text-gray-800 ${
        props.className
      }`}
    >
      {props.children ?? <span>{props.text ?? 'Default Button Text'}</span>}
    </div>
  );
}
