// import React from 'react'
// import OtherUser from './OtherUser';
// import { setOtherUser } from '../Redux/userSlice';
// import useGetOtherUsers from '../hooks/useGetOtherUsers';
// import { useSelector } from 'react-redux';
// export default function OtherUsers({ users }) {
//     // My custom hooks    
//     useGetOtherUsers();
//     const { otherUsers } = useSelector(store => store.user);
//     const userList = users || otherUsers

//     if (!userList || userList.length === 0) {
//         return <p className="text-center text-gray-400 mt-4">No users found.</p>;
//     }
    
//     return (
//         <div className='overflow-auto flex-1'>
//             {
//                 otherUsers.map((user) => {
//                     return (
//                         <OtherUser key={user._id} user={user} />
//                     )

//                 })
//             }



//         </div>

//     )

// }




import React, { useEffect } from 'react';
import OtherUser from './OtherUser';
import useGetOtherUsers from '../hooks/useGetOtherUsers';
import { useSelector, useDispatch } from 'react-redux';
import { setOtherUser } from '../Redux/userSlice';

export default function OtherUsers({ users }) {
    const dispatch = useDispatch();

    // Custom hook to populate Redux with all users
    useGetOtherUsers();

    // Fallback: if `users` prop not passed, use global state
    const globalUsers = useSelector((store) => store.user.otherUsers);
    const userList = users || globalUsers;

    useEffect(() => {
        return () => {
            dispatch(setOtherUser(null)); // cleanup on unmount
        };
    }, [dispatch]);

    if (!userList || userList.length === 0) {
        return <p className='text-center text-gray-400 mt-4'>No users found.</p>;
    }

    return (
        <div className='overflow-auto flex-1'>
            {userList.map((user) => (
                <OtherUser key={user._id} user={user} />
            ))}
        </div>
    );
}
