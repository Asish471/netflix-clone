import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import { PASSWORD_RESET } from '../graphql';

function ResetPassword() {
  const { token } = useParams();
  const [formData, setFormData] = useState({
    newPassword1: '',
    newPassword2: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetPassword, { loading }] = useMutation(PASSWORD_RESET);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (formData.newPassword1 !== formData.newPassword2) {
      setError('New passwords do not match');
      return;
    }

    try {
      const { data } = await resetPassword({ 
        variables: { 
          token,
          newPassword1: formData.newPassword1, 
          newPassword2: formData.newPassword2 
        } 
      });
      
      if (data.passwordReset.success) {
        setMessage('Password reset successfully!');
        setResetSuccess(true);
      } else {
        setError(data.passwordReset.errors?.newPassword2?.[0]?.message || 'Failed to reset password');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (resetSuccess) {
    return (
      <div className='login'>
        <div className='holder'>
          <h1 className='text-white mb-4'>Password Reset Successful</h1>
          <div className="alert alert-success">
            Your password has been updated successfully. You can now sign in with your new password.
          </div>
          <Link to="/login" className="btn btn-danger btn-block d-flex justify-content-center">
            Sign In
          </Link>
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

  return (
    <div className='login'>
      <div className='holder'>
        <h1 className='text-white'>Reset Password</h1>
        {message && <div className="alert alert-success mt-3">{message}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className='form-control'
              type='password'
              name='newPassword1'
              placeholder='New Password'
              value={formData.newPassword1}
              onChange={handleChange}
              required
              minLength="8"
            />
          </div>
          <div className="form-group">
            <input
              className='form-control'
              type='password'
              name='newPassword2'
              placeholder='Confirm New Password'
              value={formData.newPassword2}
              onChange={handleChange}
              required
              minLength="8"
            />
          </div>
          
          <button
            className='btn btn-danger btn-block'
            type="submit"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="login-form-other mt-4">
          <div className="login-signup-now">
            Remember your password? &nbsp;
            <Link to="/login" className="text-white">Sign In</Link>
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

export default ResetPassword;