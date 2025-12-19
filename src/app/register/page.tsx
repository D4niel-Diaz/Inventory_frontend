'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Register() {
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  
  const password = watch('password', '');

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await registerUser(data.name, data.email, data.password, data.password_confirmation);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-[#0a2540] bg-opacity-90 backdrop-blur-sm rounded-2xl border-2 border-cyan-400 shadow-2xl p-8">
          <div className="mb-8">
            <h2 className="text-4xl font-serif text-center text-cyan-300">
              Sign Up
            </h2>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                {...register('name', { required: 'Username is required' })}
                id="name"
                type="text"
                autoComplete="name"
                className="block w-full px-4 py-3 bg-transparent border border-cyan-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                placeholder="Create a username"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name.message as string}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
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
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                id="password"
                type="password"
                autoComplete="new-password"
                className="block w-full px-4 py-3 bg-transparent border border-cyan-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message as string}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <input
                {...register('password_confirmation', { 
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                id="password_confirmation"
                type="password"
                autoComplete="new-password"
                className="block w-full px-4 py-3 bg-transparent border border-cyan-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                placeholder="Re-enter your password"
              />
              {errors.password_confirmation && (
                <p className="mt-1 text-sm text-red-400">{errors.password_confirmation.message as string}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-white font-medium bg-cyan-400 hover:bg-cyan-500 focus:outline-none disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </button>
            </div>

            <div className="text-center text-sm">
              <span className="text-gray-300">Already have an account? </span>
              <Link href="/login" className="font-medium text-cyan-400 hover:text-cyan-300">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}