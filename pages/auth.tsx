import React, { useState } from 'react';
import axios from 'axios';
import { setCookie } from 'cookies-next';

import { custom } from '../types/t';
import VFContainer from '../components/VFContainer';

export default function AuthPage() {
  const [sLoginType, setLoginType] = useState<custom.LoginType>('login');

  async function handleFormSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    const fData = new FormData(evt.currentTarget);

    const userData = {
      username: fData.get('username'),
      password: fData.get('password')
    };

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/${sLoginType}`,
      userData
    );

    console.log(res);

    if (res.data.status === 'success') {
      setCookie('token', res.data.token);

      window.location.href = '/';
    }
  }

  function swtichLoginType() {
    if (sLoginType === 'login') {
      setLoginType('signup');
    } else {
      setLoginType('login');
    }
  }

  return (
    <VFContainer>
      <div className='flex flex-col items-center justify-center w-1/2 mx-auto mt-40'>
        <form
          className='flex flex-col items-center justify-center w-full'
          onSubmit={handleFormSubmit}
        >
          <input
            className='w-1/3 px-2 py-4 mt-4 text-center bg-gray-400 rounded-md outline-none bg-opacity-40 focus:outline-none'
            autoComplete='off'
            type='text'
            placeholder='Username'
            name='username'
          />

          <input
            className='w-1/3 px-2 py-4 mt-4 text-lg text-center bg-gray-400 rounded-md outline-none bg-opacity-40 focus:outline-none'
            autoComplete='off'
            type='password'
            placeholder='Password'
            name='password'
          />

          <input
            type='submit'
            className='w-1/3 px-2 py-4 mt-4 text-lg font-semibold text-center text-white bg-blue-500 rounded-md outline-none cursor-pointer bg-opacity-80 focus:outline-none hover:bg-blue-400'
            value={`${sLoginType === 'login' ? 'Login' : 'Signup'}`}
          />

          <span
            className='mt-2 text-black underline cursor-pointer hover:text-gray-600'
            onClick={(evt) => swtichLoginType()}
          >
            {sLoginType === 'login'
              ? 'Need an account?'
              : 'Already have an account?'}
          </span>
        </form>
      </div>
    </VFContainer>
  );
}
