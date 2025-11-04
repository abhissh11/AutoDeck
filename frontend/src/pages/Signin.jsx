import React, { useState } from 'react';
import { useAuth } from '../context/ConsumerContext';
import { Link, useNavigate } from 'react-router-dom';
import { signinUser } from '../api/auth';
import { toast } from 'react-toastify';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await signinUser({ email, password });
      login(data.user, data.token);
      toast.success('Signin successful!');
      navigate('/chat');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Signin failed');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-2xl font-bold">Signin to Autodeck</h1>
      <p className='text-base text-neutral-300 font-normal pt-2'>Start generating PPTs and fasten up your work and growth😇</p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-neutral-800 p-4 rounded-xl my-8 w-80"
      >
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-neutral-600 outline-0 px-4 py-2 rounded-lg"
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-neutral-600 outline-0 px-4 py-2 rounded-lg"
        />
        <button
          type="submit"
          className="bg-violet-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-violet-600"
        >
          Signin
        </button>
        <p className="text-sm flex items-center gap-2 font-normal">
          Haven't registered?
          <Link to="/signup">
            <span className="text-violet-500 cursor-pointer hover:underline">
              Signup
            </span>
          </Link>
        </p>
      </form>
    </div>
  );
}
