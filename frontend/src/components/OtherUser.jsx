import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser, clearUnreadMessage } from '../Redux/userSlice';

export default function OtherUser(props) {
  const user = props.user;
  if (!user) return null;

  const dispatch = useDispatch();
  const { selectedUser, onlineUsers, unreadMessages} = useSelector(store => store.user);

  const isOnline = onlineUsers.includes(user._id);
  const isSelected = selectedUser?._id === user?._id;
  const unreadCount = unreadMessages?.[user._id] || 0;

  const selectedUserHandler = (user) => {
    dispatch(setSelectedUser(user));
    dispatch(clearUnreadMessage({ fromUserId: user._id }));
    dispatch(setMessages([]));
  };

  return (
    <div>
      <div
        onClick={() => selectedUserHandler(user)}
        className={`
          flex items-center gap-4 cursor-pointer px-3 py-2 rounded-md
          ${isSelected ? 'bg-[#475569]' : 'hover:bg-[#475569]'}
          transition duration-200
        `}
      >
        <div className={`avatar ${isOnline ? 'avatar-online' : ''}`}>
          <div id='chat' className='w-12 h-12 rounded-full overflow-hidden relative'>
            <img src={user?.ProfilePhoto} alt="user avatar" />
            {unreadCount > 0 && (
              <span className="badge badge-error badge-sm absolute top-0 right-0">
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        <div>
          <p>{user?.FullName}</p>
        </div>
      </div>
      <div className='divider my-0 py-0 h-1'></div>
    </div>
  );
}
