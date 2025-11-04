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
      <h1 className="text-2xl font-bold mb-2">Signup</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-gray-100 p-6 rounded-xl shadow-md w-80"
      >
        <input
          type="text"
          value={name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          required
          className="border px-3 py-2 rounded-lg"
        />
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border px-3 py-2 rounded-lg"
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border px-3 py-2 rounded-lg"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Signup
        </button>
        <p className="text-sm flex items-center gap-2 font-normal">
          Already registered?
          <Link to="/signin">
            <span className="text-blue-500 cursor-pointer hover:underline">
              Signin
            </span>
          </Link>
        </p>
      </form>
    </div>
  );
}
