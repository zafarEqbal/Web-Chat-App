import React, { useEffect } from 'react'
import SendInput from './SendInput'
import MessagePage from './MessagePage'
import { useSelector,useDispatch} from 'react-redux'
import { setSelectedUser } from '../Redux/userSlice'
export default function MessageContainer(user) {    
  const {selectedUser,authUser,onlineUsers} = useSelector(store=>store.user);
  const isOnline = selectedUser &&  onlineUsers.includes(selectedUser._id);
      if (!selectedUser) {
    return (
      <div className="text-center mt-4 md:min-w-[550px] flex flex-col justify-center">
          <h1 className='text-gray-400 text-4xl font-semibold'>Hi {authUser?.fullName || "Loading User" } </h1>
        <h1 className='text-white text-2xl'>Select a user to start messaging</h1>
      
      </div>
    );
  }
  return (
    <div className='md:min-w-[550px] flex flex-col'>
      <div className='flex gap-4 items-center bg-[#1D232A] px-4 py-2 mb-2'>
        <div className={`avatar ${isOnline ? 'avatar-online' :' '}`}>
          <div className='w-12 h-12 rounded-full overflow-hidden'>
            <img src={selectedUser?.ProfilePhoto}alt="user avatar" />
          </div>
        </div>

        <div className=' '>
          <div className='justify-items-center'>
            <p>{selectedUser?.FullName}</p>
          </div>
        </div>

      </div>
      
      {/* <MessagePage/>
      <SendInput/> */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 overflow-auto">
          <MessagePage />
        </div>
        <div className="">
          <SendInput />
        </div>
      </div>
    </div>
    //</div>
  )
}
