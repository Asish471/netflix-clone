import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';

const SEND_PASSWORD_RESET_EMAIL = gql`
  mutation SendPasswordResetEmail($email: String!) {
    sendPasswordResetEmail(email: $email) {
      success
      errors
    }
  }
`;

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sendResetEmail, { loading }] = useMutation(SEND_PASSWORD_RESET_EMAIL);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const { data } = await sendResetEmail({ variables: { email } });
      
      if (data.sendPasswordResetEmail.success) {
        setMessage('Password reset email sent. Please check your inbox.');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.sendPasswordResetEmail.errors?.email?.[0]?.message || 'Failed to send reset email');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='login'>
      <div className='holder'>
        <h1 className='text-white'>Forgot Password</h1>
        {message && <div className="alert alert-success mt-3">{message}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className='form-control'
              type='email'
              placeholder='Email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <button
            className='btn btn-danger btn-block'
            type="submit"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="login-form-other mt-4">
          <div className="login-signup-now">
            Remember your password? &nbsp;
            <Link to="/login" className="text-white">Sign In</Link>
          </div>
          <div className=" mt-3">
          <Link to="/login" className='text-white'>Back to Login</Link>
        </div>
        </div>
      </div>
      
      <div className="shadow"></div>
      <img 
        className="concord-img vlv-creative" 
        src="https://assets.nflxext.com/ffe/siteui/vlv3/6e32b96a-d4be-4e44-a19b-1bd2d2279b51/ee068656-14b9-4821-89b4-53b4937d9f1c/IN-en-20220516-popsignuptwoweeks-perspective_alpha_website_small.jpg" 
        alt="Netflix background" 
      />
    </div>
  );
}

export default ForgotPassword;