import React, { useState } from 'react'
import { IoMdSend } from "react-icons/io";
import axios from 'axios';
import { setMessages } from '../Redux/messageSlice';
import { useDispatch, useSelector } from 'react-redux';


export default function SendInput() {
  const [message, setMessage] = useState(" ");
  const dispatch = useDispatch();
  const { selectedUser } = useSelector(store => store.user);
  const { messages } = useSelector(store => store.message);
   const onsubmitHandler = async (e) => {
    e.preventDefault();
    const trimmedMsg = message.trim();
    if (!trimmedMsg) return;
    try {
      const res = await axios.post(`https://web-chat-app-u7yl.onrender.com/api/v1/message/send/${selectedUser?._id}`, {messages:trimmedMsg}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
      })
      console.log(res);
      dispatch(setMessages([...messages,res?.data?.newMessage]))
      setMessage("");
    } catch (error) {
      console.log(error)
    }
    
    //alert(message);
  }
  return (

    <form onSubmit={onsubmitHandler} className='px-4 my-3 '>
      <div className='w-full relative'>
        <input type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='send a message....'
          className='input border text-sm rounded-lg w-full block  p-6 '
        />
        <button type='submit' className='absolute  flex inset-y-1 end-0 pr-3  items-center'>
          <IoMdSend />
        </button>
      </div>
    </form>
  )
}
