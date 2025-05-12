

// import React from 'react'
// import { useNavigate } from 'react-router-dom'

// function Login() {
//     const navigate=useNavigate();

//     const onSigninClickhandler=(e)=>{
//         e.preventDefault();
//             navigate('/dashboard')
//     }




//   return (
//    <div className='login'>
//         <div className='holder'>
//             <h1 className='text-white'>Sign In</h1>
//             <br/>
//             <form>
//                 <input className='form-control' type='email' placeholder='Email'/>
//                 <input className='form-control' type='password' placeholder='password'/>
//                 <button className='btn btn-danger btn-block' onClick={onSigninClickhandler}>Sign In</button>
//                 <br/>
//                 <div className='form-check'>
//                     <input className='form-check-input' type='checkbox' value="" id="flexCheckDefault"/>
//                     <label className='form-check-label text-white' htmlFor='flexCheckDefault'>Remember Me</label>

//                 </div>
//             </form>
//             <br/>
//             <br/>
//             <div className='login-form-other'>
//                 <div className='login-signup-now'>New to Netflix? &nbsp;
//                     <a className='' target='_self' href='/'>Sign Up now</a>

//                 </div>

//             </div>

//         </div>
//         <div className="shadow"></div>
//       <img className="concord-img vlv-creative" src="https://assets.nflxext.com/ffe/siteui/vlv3/6e32b96a-d4be-4e44-a19b-1bd2d2279b51/ee068656-14b9-4821-89b4-53b4937d9f1c/IN-en-20220516-popsignuptwoweeks-perspective_alpha_website_small.jpg" alt="" />
//    </div>
//   )
// }

// export default Login


import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { useAuth } from '../contexts/authContext';
import { LOGOUT_MUTATION } from '../graphql';

const LOGIN_MUTATION = gql`
  mutation LogIn($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      success
      errors
      refreshToken
      hasActiveSubscription
      user {
        id
        email
      }
    }
  }
`;

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login,logout } = useAuth();
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  

  const  handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const { data } = await loginMutation({
        variables: {
          email: formData.email,
          password: formData.password,
        },
      });
      localStorage.setItem("currentUser",JSON.stringify(data.login.user))
      localStorage.setItem("userId", data.login.user.id);
      
      
      const loginResponse = data?.login;
      console.log("loginresponse",loginResponse);
      
      if (loginResponse?.success) {
         const res= await login(loginResponse?.token);
          localStorage.setItem("token",loginResponse.token)
          localStorage.setItem("refreshToken",loginResponse.refreshToken)
          
          if(loginResponse.hasActiveSubscription){
            navigate('/dashboard', { replace: true });
          }else{
            navigate('/plans',{replace:true})
          }
      }else {
        const errors = loginResponse?.errors;
        if (errors) {
          // Flatten and join all error messages
          const allErrors = Object.values(errors)
            .flat()
            ;
          setError(allErrors);
          setTimeout(()=>setError(''),3000);
        } else {
          setError('Login failed. Please try again.');
          setTimeout(()=>setError(''),3000);
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.networkError) {
        setError('Network error. Please check your connection.');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
        setTimeout(()=>setError(''),3000);
      }
    }
  };
  

  

  return (
    <div className='login'>
      <div className='holder'>
        <h1 className='text-white'>Sign In</h1>
        {error && (
            <div className="alert alert-danger mt-3">
              {error}
            </div>
          )}
        <br />
        <form onSubmit={handleSubmit}>
          <input 
            className='form-control' 
            type='email' 
            name='email'
            placeholder='email' 
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          <input 
            className='form-control' 
            type='password' 
            name='password'
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="off"
          />
<div className="row login-form-other d-flex">
  <div className="login-signup-now d-flex justify-content-end">
    <Link to="/forgot-password">Forgot Password?</Link>
    </div>
    <br />
</div>
          <button 
            className='btn btn-danger btn-block' 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
       
          <br />
          {/* <div className='form-check mt-3'>
            <input className='form-check-input' type='checkbox' id="flexCheckDefault"/>
            <label className='form-check-label text-white' htmlFor='flexCheckDefault'>
              Remember Me
            </label>
          </div> */}
        </form>
        <br />
        <br />
        <div className='login-form-other'>
          <div className='login-signup-now'>
            New to Netflix? &nbsp;
            <a href='/register' className='text-white'>
              Sign Up now
            </a>
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

export default Login;
