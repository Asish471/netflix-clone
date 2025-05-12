import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { REGISTER_MUTATION } from '../graphql';





function Register() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password1: '',
    password2: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [registraionSuccess,setRegistraionSuccess]=useState(false);
  const navigate = useNavigate();
  const [register, { loading }] = useMutation(REGISTER_MUTATION);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/ 
;
    
    // if (!formData.email.includes('@')) {
    //   newErrors.email = 'Please enter a valid email address';
    // }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    console.log("newerror email",newErrors.email);
    
    
    
    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (formData.password1.length < 8) {
      newErrors.password1 = 'Password must be at least 8 characters';
    }
    
    if (formData.password1 !== formData.password2) {
      newErrors.password2 = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');
    

    if (!validateForm()) return;

    try {
      const { data } = await register({
        variables: {
          
          email: formData.email,
          username: formData.username,
          password1: formData.password1,
          password2: formData.password2
          
        }
      });

      if (data.register.success) {
        setMessage('Registration successful! You can now login.');
        setRegistraionSuccess(true);
        // setTimeout(() => navigate('/login'), 3000);
      } else {
        setErrors(flattenErrors(data.register.errors || {}));
        setTimeout(()=>setErrors(''),3000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setErrors({ nonFieldErrors: 'Registration failed. Please try again.' });
      setTimeout(()=>setErrors(''),3000);
    }
  };

  function flattenErrors(errors) {
    const flattened = {};
    
    if (typeof errors === 'string') {
      flattened.nonFieldErrors = errors;

    } else {
      Object.keys(errors).forEach(key => {
        if (Array.isArray(errors[key])) {
          flattened[key] = errors[key][0].message; // Assuming the errors are an array of objects with 'message' property
        } else {
          flattened[key] = errors[key];
        }
      });
    }
    
    return flattened;
  }
  
if(registraionSuccess){
  return (
    <div className='login'>
      <div className='holder'>
        {/* <h1 className='text-white mb-4'>Registration Successful!</h1> */}
        <div className="alert alert-success text-center">
          Your account has been created successfully. You can now sign in.
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
        <h1 className='text-white mb-4'>Sign Up</h1>
        
        {message && <div className="alert alert-success">{message}</div>}
        {errors.nonFieldErrors && <div className="alert alert-danger">{errors.nonFieldErrors}</div>}

        <form onSubmit={handleSubmit}>
          <input
            className='form-control'
            type='email'
            name='email'
            placeholder='Email'
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="new-email"
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}

          <input
            className='form-control'
            type='text'
            name='username'
            placeholder='Username'
            value={formData.username}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          {errors.username && <div className="text-danger">{errors.username}</div>}

          <input
            className='form-control'
            type='password'
            name='password1'
            placeholder='Password'
            value={formData.password1}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          {errors.password1 && <div className="text-danger">{errors.password1}</div>}

          <input
            className='form-control'
            type='password'
            name='password2'
            placeholder='Confirm Password'
            value={formData.password2}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          {errors.password2 && <div className="text-danger">{errors.password2}</div>}

          <button
            className='btn btn-danger btn-block'
            type="submit"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        <div className="login-form-other mt-4">
          <div className="login-signup-now">
            Already have an account? <Link to="/login" className="text-white">Sign In</Link>
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

export default Register;