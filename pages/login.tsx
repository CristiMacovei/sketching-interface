import React from 'react';
import axios from 'axios';
import { setCookie } from 'cookies-next';

export default function LoginPage() {
  async function handleFormSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    const fData = new FormData(evt.currentTarget);

    const userData = {
      username: fData.get('username'),
      password: fData.get('password')
    };

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/login`,
      userData
    );

    console.log(res);

    if (res.data.status === 'success') {
      setCookie('token', res.data.token);

      window.location.href = '/';
    }
  }

  return (
    <div className='flex flex-col w-screen h-screen pt-4'>
      <form onSubmit={handleFormSubmit}>
        <input type='text' placeholder='Username' name='username' />

        <input type='password' placeholder='Password' name='password' />

        <input type='submit' value='N-AI MAMA' />
      </form>
    </div>
  );
}
