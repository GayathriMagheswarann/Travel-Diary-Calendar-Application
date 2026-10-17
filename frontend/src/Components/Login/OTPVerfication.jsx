
import React, { useState } from 'react';
import axios from 'axios';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOTPChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-email', { code: otp });
      
      if (response.data.success) {
        setSuccess(response.data.message);
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while verifying OTP.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  // Inline styles for the component
  const styles = {
    otpContainer: {
      width: '100%',
      maxWidth: '400px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
    },
    header: {
      textAlign: 'center',
      fontSize: '24px',
      marginBottom: '20px',
    },
    paragraph: {
      textAlign: 'center',
      fontSize: '16px',
      marginBottom: '20px',
    },
    inputGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '16px',
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#4CAF50',
      color: 'white',
      fontSize: '16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
    },
    error: {
      color: 'red',
      fontSize: '14px',
      marginBottom: '10px',
    },
    success: {
      color: 'green',
      fontSize: '14px',
      marginBottom: '10px',
    },
    loading: {
      color: '#ff9800',
      fontSize: '14px',
      marginBottom: '10px',
    },
  };

  return (
    <div style={styles.otpContainer}>
      <h2 style={styles.header}>Email OTP Verification</h2>
      <p style={styles.paragraph}>Enter the OTP sent to your email to verify your account.</p>

      <form onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
          <label htmlFor="otp" style={styles.label}>OTP:</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={handleOTPChange}
            placeholder="Enter the OTP"
            maxLength="6"
            required
            style={styles.input}
          />
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        {loading && <div style={styles.loading}>Verifying...</div>}

        <button type="submit" disabled={loading} style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}>
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default OTPVerification;
