
import { setSocket } from '../Redux/socketSlice';
import React, { useEffect, useState } from 'react'
import { BiSearchAlt2 } from "react-icons/bi";
import OtherUsers from './OtherUsers';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { resetUserState, setAuthUser,clearUnreadMessage } from '../Redux/userSlice';
import { useSelector, useDispatch } from 'react-redux';

export default function Sidebear() {
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [filterUser, setFilterUser] = useState([]);
    const navigate = useNavigate();
    const { otherUsers } = useSelector(store => store.user);
    useEffect(() => {
        const trimmed = search.trim().toLowerCase();

        const timeout = setTimeout(() => {
            if (trimmed === "") {
                setFilterUser(otherUsers); // Show all users
            } else {
                const results = otherUsers?.filter((user) =>
                    user?.FullName?.toLowerCase().includes(trimmed)
                );
                setFilterUser(results || []);
            }
        }, 300); // 300ms debounce delay

        return () => clearTimeout(timeout); // Clear on re-type
    }, [search, otherUsers]);
    // useEffect(() => {
    //     setFilterUser(otherUsers || []);
    // }, [otherUsers]);

    const logoutHandler = async () => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.get('https://web-chat-app-u7yl.onrender.com/api/v1/user/logout');
            localStorage.removeItem("authUser");
            localStorage.removeItem("selectedUser");
            dispatch(resetUserState());
            dispatch(setAuthUser(null));
            dispatch(setSocket(null));
            navigate("/login");
            toast.success(res.data.message);
        } catch (error) {
            console.log(error);
        }
    };

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        const trimmed = search.trim();
        if (trimmed.length === 0) {
            toast.error("Please enter a search query");
            setFilterUser(otherUsers);
            return;
        }

        const results = otherUsers?.filter((user) =>
            user?.FullName?.toLowerCase().includes(trimmed.toLowerCase())
        );

        if (results.length > 0) {
            setFilterUser(results);
        } else {
            toast.error("User not found");
            setFilterUser([]);
        }

        //setSearch("");
    };

    return (
        <div className='border-r border-slate-300 p-4 flex flex-col'>
            <form onSubmit={searchSubmitHandler} className='flex items-center gap-2'>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='input input-bordered rounded-md focus:outline-none focus:ring-0'
                    type="text"
                    placeholder='Search...'
                />
                <button type='submit' className='btn rounded-lg hover:bg-zinc-400 btext-white'>
                    <BiSearchAlt2 className='w-6 h-6 outline-none' />
                </button>
            </form>

            <div className='divider px-3'></div>

            <OtherUsers users={filterUser} />

            <div className='mt-2'>
                <button onClick={logoutHandler} className='btn btn-sm'>Logout</button>
            </div>
        </div>
    );
}
