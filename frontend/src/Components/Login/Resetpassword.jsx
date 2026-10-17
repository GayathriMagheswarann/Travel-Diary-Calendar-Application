import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../../firebase';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPassword = () => {
  const query = useQuery();
  const oobCode = query.get('oobCode');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!oobCode) {
      return setError('Invalid or expired reset link');
    }
    if (password !== confirm) {
      return setError('Passwords do not match');
    }
    if (password.length < 6) {
      return setError('Password should be at least 6 characters');
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
    } catch (err) {
      console.error('Password reset error:', err);
      
      let errorMessage = 'Password reset failed. Please try again.';
      switch (err.code) {
        case 'auth/expired-action-code':
          errorMessage = 'The reset link has expired. Please request a new one.';
          break;
        case 'auth/invalid-action-code':
          errorMessage = 'Invalid reset link. Please request a new one.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No user found with this email.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Choose a stronger password.';
          break;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!oobCode) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <div className='bg-white p-8 rounded shadow-md w-full max-w-md text-center'>
          <h2 className='text-2xl font-bold mb-4'>Invalid Reset Link</h2>
          <p className='mb-4'>The password reset link is invalid or has expired.</p>
          <Link 
            to="/forgot-password" 
            className='text-blue-600 hover:underline'
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <div className='bg-white p-8 rounded shadow-md w-full max-w-md text-center'>
          <h2 className='text-2xl font-bold mb-4 text-green-600'>Password Reset Successful!</h2>
          <p>Your password has been updated successfully.</p>
          <p>Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-4'>Reset Your Password 🔒</h2>
        {error && (
          <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block mb-2'>New Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full border p-2 rounded'
              required
              minLength={6}
              placeholder='At least 6 characters'
            />
          </div>
          <div className='mb-6'>
            <label className='block mb-2'>Confirm Password</label>
            <input
              type='password'
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className='w-full border p-2 rounded'
              required
              minLength={6}
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className={`w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <p className='text-sm text-center mt-4'>
          <Link to="/login" className='text-blue-500 hover:underline'>Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;