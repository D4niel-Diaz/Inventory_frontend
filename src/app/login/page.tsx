'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-[#0a2540] bg-opacity-90 backdrop-blur-sm rounded-2xl border-2 border-cyan-400 shadow-2xl p-8">
          <div className="mb-8">
            <h2 className="text-4xl font-serif text-center text-cyan-300">
              Login
            </h2>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                {...register('email', { required: 'Email is required' })}
                id="email"
                type="email"
                autoComplete="email"
                className="block w-full px-4 py-3 bg-transparent border border-cyan-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message as string}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                {...register('password', { required: 'Password is required' })}
                id="password"
                type="password"
                autoComplete="current-password"
                className="block w-full px-4 py-3 bg-transparent border border-cyan-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message as string}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-white font-medium bg-cyan-400 hover:bg-cyan-500 focus:outline-none disabled:opacity-50 transition-colors"
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </div>

            <div className="text-center text-sm">
              <span className="text-gray-300">Don't have an account? </span>
              <Link href="/register" className="font-medium text-cyan-400 hover:text-cyan-300">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
