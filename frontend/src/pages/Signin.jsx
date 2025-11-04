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
      <h1 className="text-xl font-bold">Signin</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-gray-200 p-4 rounded-xl my-8 w-80"
      >
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border px-4 py-2 rounded-lg"
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border px-4 py-2 rounded-lg"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600"
        >
          Signin
        </button>
        <p className="text-sm flex items-center gap-2 font-normal">
          Haven't registered?
          <Link to="/signup">
            <span className="text-blue-500 cursor-pointer hover:underline">
              Signup
            </span>
          </Link>
        </p>
      </form>
    </div>
  );
}
