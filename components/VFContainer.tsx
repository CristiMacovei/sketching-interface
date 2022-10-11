import React, { PropsWithChildren } from 'react';

type ComponentProps = {
  customStyle?: React.CSSProperties;
};
export default function VFContainer(props: PropsWithChildren<ComponentProps>) {
  return (
    <div
      className='flex flex-col w-screen h-screen pt-4 bg-gray-50'
      style={{ ...props.customStyle }}
    >
      {props.children}
    </div>
  );
}
