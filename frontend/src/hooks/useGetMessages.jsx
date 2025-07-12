import React, { useEffect } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '../Redux/messageSlice';
import { setSelectedUser } from '../Redux/userSlice';

export default function useGetMessages() {
    const { selectedUser } = useSelector(store => store.user);
    const dispatch = useDispatch();
    useEffect(() => {
        const savedSelectedUser = localStorage.getItem("selectedUser");
        if (savedSelectedUser) {
            dispatch(setSelectedUser(JSON.parse(savedSelectedUser)));
        }
    }, []);
    useEffect(() => {
        if (selectedUser) {
            localStorage.setItem("selectedUser", JSON.stringify(selectedUser));
        }
    }, [selectedUser]);
    // useEffect(() => {
    //     const fetchmessages = async () => {
    //         try {
    //             if (!selectedUser?._id) return;
    //             axios.defaults.withCredentials = true;
    //             const res = await axios.get(`https://web-chat-app-u7yl.onrender.com/api/v1/message/${selectedUser?._id}`);
    //             // const res = await axios.get(`http://192.168.1.9:3000/api/v1/message/${selectedUser?._id}`);

    //             //console.log("messages",res.data);
    //             dispatch(setMessages(res.data.data));
    //         } catch (error) {
    //             console.log(error);

    //             toast.error("failed to load messages");
    //         }
    //     }
    //     // console.log("🟨 selectedUser:", selectedUser);
    //     //console.log("🟩 selectedUser._id:", selectedUser?._id);

    //     fetchmessages();
    // }, [selectedUser])

useEffect(() => {
  const fetchmessages = async () => {
    try {
      if (!selectedUser?._id) return;

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `https://web-chat-app-u7yl.onrender.com/api/v1/message/${selectedUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      dispatch(setMessages(res.data.data)); // ✅ This now includes updated status: "read"
    } catch (error) {
      console.log(error);
      toast.error("Failed to load messages");
    }
  };

  fetchmessages();
}, [selectedUser]);


    
    return (
        <></>
    )
}
