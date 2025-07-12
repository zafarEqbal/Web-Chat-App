import { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import Homepage from './components/Homepage';
import FrontPage from './components/FrontPage';
import Signup from './components/Signup';
import Login from './components/Login';
import OtpVerify from './components/otpVerify';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser, setOnlineUsers, setUnreadMessage } from './Redux/userSlice';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { io } from 'socket.io-client';
import { setSocket } from './Redux/socketSlice';
import { addMessage } from './Redux/messageSlice'; // Make sure this is correctly defined

function AuthRoute() {
  const { authUser } = useSelector((state) => state.user);
  return authUser ? <Homepage /> : <FrontPage />;
}

// Routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthRoute />,
  },
  {
    path: '/register',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/verify-otp',
    element: <OtpVerify />,
  }
]);

function App() {
  const { authUser } = useSelector((state) => state.user);
  const socket = useSelector((state) => state.socket.socket); // ⬅ get socket from redux
  const dispatch = useDispatch();

  // 1️⃣ Set up socket on login
  useEffect(() => {
    let newsocket;

    if (authUser) {
      newsocket = io('https://web-chat-app-u7yl.onrender.com', {
        query: {
          userId: authUser._id
        },
      });

      dispatch(setSocket(newsocket));

      newsocket.on('getOnlineUsers', (users) => {
        dispatch(setOnlineUsers(users));
      });
    }

    return () => {
      if (newsocket) {
        newsocket.disconnect();
        dispatch(setSocket(null));
      }
    };
  }, [authUser]);

  // 2️⃣ Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = async (message) => {
      const selectedUser = store.getState().user.selectedUser;

      if (!selectedUser || selectedUser._id !== message.from) {
        dispatch(setUnreadMessage({ fromUserId: message.from }));

        // 🔊 Play sound
        try {
          const audio = new Audio('/notification.wav');
          await audio.play();
        } catch (err) {
          console.warn("🔇 Autoplay blocked by browser:", err);
        }

        // 🔔 Show toast
        toast.success(`📩 New message from ${message.fromName || "someone"}`);
      }

      dispatch(addMessage(message)); // store message
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [socket]);

  // 3️⃣ Restore user on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      dispatch(setAuthUser(JSON.parse(storedUser)));
    }
  }, []);

  return (
    <div className='p-4 h-screen flex items-center justify-center'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

