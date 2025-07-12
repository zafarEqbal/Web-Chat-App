// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, useLocation } from 'react-router-dom';
// import toast from 'react-hot-toast';

// export default function OtpVerify() {
//   const [otp, setOtp] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();

//   const email = location.state?.email;

//   const handleVerify = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post('https://web-chat-app-u7yl.onrender.com/api/v1/user/register', {
//         ...location.state.userData, // includes FullName, UserName, Password etc.
//         otp,
//       }, {
//         headers: { 'Content-Type': 'application/json' },
//         withCredentials: true,
//       });

//       if (response.data.success) {
//         toast.success("✅ Registration complete!");
//         navigate('/login');
//       }
//     } catch (error) {
//       const msg = error.response?.data?.msg || "Something went wrong";
//       toast.error(`❌ ${msg}`);
//     }
//   };

//   return (
//     <div className='flex flex-col items-center justify-center min-h-screen'>
//       <h2 className='text-2xl font-semibold mb-4'>OTP Verification</h2>
//       <form onSubmit={handleVerify} className='w-full max-w-xs'>
//         <label className='label'>
//           <span className='label-text'>Enter OTP sent to {email}</span>
//         </label>
//         <input
//           type="text"
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//           className="input input-bordered w-full mb-4"
//           placeholder="Enter 6-digit OTP"
//         />
//         <button type="submit" className="btn btn-primary w-full">Verify</button>
//       </form>
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function OtpVerify() {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(15); // Cooldown timer (in seconds)
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const userData = location.state?.userData;

  // Start countdown for resend button
  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  // ✅ Handle OTP submission
  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp) return toast.error("❌ Please enter OTP");

    try {
      const response = await axios.post('https://web-chat-app-u7yl.onrender.com/api/v1/user/register', {
        ...userData,
        otp,
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success("✅ Registration complete!");
        navigate('/login');
      }
    } catch (error) {
      const msg = error.response?.data?.msg || "Something went wrong";
      toast.error(`❌ ${msg}`);
    }
  };

  // ✅ Handle resend OTP
  const handleResendOtp = async () => {
    if (timer > 0) return;

    try {
      await axios.post('https://web-chat-app-u7yl.onrender.com/api/v1/user/send-otp',
        { Email: email },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });

      toast.success("📨 OTP resent to your email");
      setTimer(60); // Restart cooldown
    } catch (error) {
      const msg = error.response?.data?.msg || "Failed to resend OTP";
      toast.error(`❌ ${msg}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-2xl font-semibold mb-4 text-white">OTP Verification</h2>
      <form onSubmit={handleVerify} className="w-full max-w-xs space-y-3">
        <label className="label text-gray-300">
          Enter OTP sent to <span className="font-medium text-white">{email}</span>
        </label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="input input-bordered w-full mb-2 text-black"
          placeholder="Enter 6-digit OTP"
        />
        <button type="submit" className="btn btn-primary w-full">Verify OTP</button>

        <button
          type="button"
          disabled={timer > 0}
          onClick={handleResendOtp}
          className={`btn btn-outline w-full mt-1 ${timer > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {timer > 0 ? `Resend OTP in 00:${timer < 10 ? `0${timer}` : timer}` : 'Resend OTP'}
        </button>
      </form>
    </div>
  );
}

