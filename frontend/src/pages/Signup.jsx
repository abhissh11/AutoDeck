import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/ConsumerContext';
import { signupUser } from '../api/auth';
import { toast } from 'react-toastify';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await signupUser({ name, email, password });
      login(data.user, data.token);
      toast.success('Signup successful!');
      navigate('/chat');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Signup failed');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-2xl font-bold">Signup to AutoDeck</h1>
      <p className='text-base text-neutral-300 font-normal py-2 mb-2'>Start generating PPTs and fasten up your work and growth😇</p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-neutral-800 p-6 rounded-xl shadow-md w-80"
      >
        <input
          type="text"
          value={name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          required
          className="border border-neutral-600 outline-0 px-3 py-2 rounded-lg"
        />
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-neutral-600 outline-0 px-3 py-2 rounded-lg"
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-neutral-600 outline-0 px-3 py-2 rounded-lg"
        />
        <button
          type="submit"
          className="bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 cursor-pointer"
        >
          Signup
        </button>
        <p className="text-sm flex items-center gap-2 font-normal">
          Already registered?
          <Link to="/signin">
            <span className="text-violet-500 cursor-pointer hover:underline">
              Signin
            </span>
          </Link>
        </p>
      </form>
    </div>
  );
}
