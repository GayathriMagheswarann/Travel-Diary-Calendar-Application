import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase'; 
import video from '../../assets/video2.mp4';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset link sent! Check your email.');
      setEmail('');
    } catch (err) {
      console.error('Error sending password reset email:', err);
      let errorMessage = 'Failed to send reset email. Please try again.';
      
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'No user found with this email address.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later.';
          break;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12'>
        <form onSubmit={handleReset} className='w-full max-w-md bg-white p-8 rounded-lg border shadow-sm'>
          <div className='flex justify-center mb-6'>
            <h2 className='text-xl font-medium'>Miles and Memories</h2>
          </div>

          <h2 className='text-2xl font-bold text-center mb-6'>Forgot your password?</h2>
          <p className='text-center mb-6'>Enter your email to receive a reset link</p>

          <div className='mb-4'>
            <label className='block text-sm font-semibold mb-2'>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
              placeholder='Enter your registered email'
              required
            />
          </div>

          <button 
            type='submit' 
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : 'Send Reset Link'}
          </button>

          {error && (
            <div className='mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm'>
              <p className='font-semibold'>{error}</p>
            </div>
          )}

          {message && (
            <div className='mt-4 p-3 bg-green-50 text-green-600 rounded-md text-sm'>
              <p className='font-semibold'>{message}</p>
            </div>
          )}

          <p className='mt-6 text-center text-sm text-gray-600'>
            Remember your password? <Link to="/login" className='text-blue-600 hover:font-bold hover:text-blue-800'>Login here</Link>
          </p>
        </form>
      </div>

      <div className='hidden md:block w-1/2 bg-gray-800 relative overflow-hidden'>
        <div className='h-full flex flex-col justify-center items-center'>
          <video 
            src={video} 
            autoPlay 
            loop 
            muted 
            className='h-full w-full object-cover absolute inset-0'
          />
          <div className="absolute inset-0 bg-blue-900 opacity-30"></div>
          <div className="relative z-10 text-white p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Explore the World</h2>
            <p className="text-lg">Your next adventure awaits</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;