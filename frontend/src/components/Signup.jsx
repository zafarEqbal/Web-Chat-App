

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function Signup() {
  const [user, setUser] = useState({
    fullname: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
    email: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    const { fullname, username, password, confirmPassword, gender, email } = user;

    if (!fullname || !username || !password || !confirmPassword || !gender || !email) {
      toast.error("⚠️ Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("❌ Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        'https://web-chat-app-kaag.onrender.com/api/v1/user/send-otp',
        { Email: email },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      toast.success("📨 OTP sent to your email");

      navigate('/verify-otp', {
        state: {
          email,
          userData: {
            FullName: fullname,
            UserName: username,
            Password: password,
            ConfirmPassword: confirmPassword,
            Gender: gender,
            Email: email
          }
        }
      });

    } catch (error) {
      const msg = error.response?.data?.msg || "Something went wrong";
      toast.error(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-w-100 max-w-auto'>
      <div className='h-full w-full p-6 shadow-md rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-200'>
        <h1 className='text-3xl font-bold text-center'>Signup</h1>
        <form onSubmit={onSubmitHandler}>
          {/* Full Name */}
          <div>
            <label className='label p-2'><span className='text-base label-text'>Full Name</span></label>
            <input
              value={user.fullname}
              onChange={(e) => setUser({ ...user, fullname: e.target.value })}
              className="w-full input rounded-2xl h-10"
              type="text"
              placeholder='Enter Your Good Name'
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const form = e.target.form;
                  const index = [...form].indexOf(e.target);
                  form.elements[index + 1]?.focus();
                }
              }}
            />
          </div>

          {/* Username */}
          <div>
            <label className='label p-2'><span className='text-base label-text'>User Name</span></label>
            <input
              value={user.username}
              onChange={(e) => {
                const val = e.target.value.replace(/\s/g, '');
                setUser({ ...user, username: val });
              }}
              className="w-full input rounded-2xl h-10"
              type="text"
              placeholder='No spaces allowed'
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const form = e.target.form;
                  const index = [...form].indexOf(e.target);
                  form.elements[index + 1]?.focus();
                }
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label className='label p-2'><span className='text-base label-text'>Email</span></label>
            <input
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full input rounded-2xl h-10"
              type="email"
              placeholder='email@example.com'
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const form = e.target.form;
                  const index = [...form].indexOf(e.target);
                  form.elements[index + 1]?.focus();
                }
              }}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className='label p-2'><span className='text-base label-text'>Password</span></label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full input rounded-2xl h-10 pr-10"
              type={showPassword ? "text" : "password"}
              placeholder='Password'
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const form = e.target.form;
                  const index = [...form].indexOf(e.target);
                  form.elements[index + 1]?.focus();
                }
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 bottom-3 text-gray-600"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className='label p-2'><span className='text-base label-text'>Re-Enter Password</span></label>
            <input
              value={user.confirmPassword}
              onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
              className="w-full input rounded-2xl h-10 pr-10"
              type={showConfirmPassword ? "text" : "password"}
              placeholder='Confirm Password'
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const form = e.target.form;
                  const index = [...form].indexOf(e.target);
                  form.elements[index + 1]?.focus();
                }
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 bottom-3 text-gray-600"
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Gender Selection with ⬅️ ➡️ support */}
          <div className="form-control p-4 text-center flex justify-center gap-6">
            <label className="label cursor-pointer">
              <span className="label-text">Male</span>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={user.gender === "Male"}
                onChange={(e) => setUser({ ...user, gender: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    setUser((prev) => ({
                      ...prev,
                      gender: prev.gender === "Male" ? "Female" : "Male"
                    }));
                  }
                }}
                className="radio"
              />
            </label>
            <label className="label cursor-pointer">
              <span className="label-text">Female</span>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={user.gender === "Female"}
                onChange={(e) => setUser({ ...user, gender: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    setUser((prev) => ({
                      ...prev,
                      gender: prev.gender === "Female" ? "Male" : "Female"
                    }));
                  }
                }}
                className="radio"
              />
            </label>
          </div>

          {/* Redirect to Login */}
          <p className='text-center'>
            Already Have an Account? <Link to="/Login" className='btn btn-ghost'>Login</Link>
          </p>

          {/* Submit Button */}
          <div>
            <button
              type='submit'
              disabled={loading}
              className={`btn btn-block rounded-2xl btn-sm mt-2 border border-green-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "Sending OTP..." : "Signup"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
