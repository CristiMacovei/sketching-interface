import {} from 'react';

import HeaderToolbar from '../components/HeaderToolbar';
import Button from '../components/Button';

import Canvas from '../components/Canvas';

import FooterToolbar from '../components/FooterToolbar';

export default function Home() {
  return (
    <div className='w-screen h-screen pt-4 flex flex-col'>
      <HeaderToolbar />

      <Canvas />

      <FooterToolbar />
    </div>
  );
}
