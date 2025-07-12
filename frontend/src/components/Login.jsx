


import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../Redux/userSlice';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
  const [user, setuser] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const onsubmithandler = async (e) => {
    e.preventDefault();
    const { username, password } = user;

    if (!username || !password) {
      toast.error("⚠️ Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        'https://web-chat-app-kaag.onrender.com/api/v1/user/login',
        {
          UserName: username,
          Password: password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      navigate('/');
      dispatch(setAuthUser(res.data));
      localStorage.setItem('authUser', JSON.stringify(res.data));
      toast.success(`✅ ${res.data.message || 'Login successful'}`);
      setuser({ username: '', password: '' });
    } catch (error) {
      const msg = error.response?.data?.message || 'Something went wrong';
      toast.error(`❌ ${msg}`);
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (field === 'username') {
        passwordRef.current?.focus();
      } else if (field === 'password') {
        onsubmithandler(e);
      }
    }
  };

  return (
    <div className='min-w-100 max-w-auto'>
      <div className='h-full w-full p-6 shadow-md rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-200'>
        <h1 className='text-3xl font-bold text-center'>Login</h1>
        <form onSubmit={onsubmithandler}>

          {/* Username */}
          <div>
            <label className='label p-2'>
              <span className='text-base label-text text-center'>User Name</span>
            </label>
            <input
              ref={usernameRef}
              value={user.username}
              onChange={(e) =>
                setuser({ ...user, username: e.target.value.replace(/\s/g, '') }) // no space
              }
              onKeyDown={(e) => handleKeyDown(e, 'username')}
              className='w-full input rounded-2xl h-10'
              type='text'
              placeholder='Enter Your User Name'
            />
          </div>

          {/* Password */}
          <div className='relative'>
            <label className='label p-2'>
              <span className='text-base label-text text-center'>Password</span>
            </label>
            <input
              ref={passwordRef}
              value={user.password}
              onChange={(e) => setuser({ ...user, password: e.target.value })}
              onKeyDown={(e) => handleKeyDown(e, 'password')}
              className='w-full input rounded-2xl h-10 pr-10'
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter Your Password'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute bottom-3 right-4 text-gray-500'
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Signup Link */}
          <p className='text-center my-1'>
            Don't Have an Account?
            <Link to='/register' className='btn btn-ghost ml-1'>Signup</Link>
          </p>

          {/* Submit */}
          <div>
            <button
              type='submit'
              className='btn btn-block rounded-2xl btn-sm mt-2 border border-green-200'
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
