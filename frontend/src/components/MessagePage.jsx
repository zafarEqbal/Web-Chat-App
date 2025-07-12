// import React from 'react'
// import Message from './Message'
// import useGetMessages from '../hooks/useGetMessages';
// import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';
// import { useSelector } from 'react-redux';
// export default function MessagePage() {
//   useGetMessages();
//   useGetRealTimeMessage();

//   const {messages} = useSelector(store=>store.message);
//   if(!messages) return;
//   return (
//     <div className='px-4 flex-1 overflow-auto'>
//       {
//         messages.map((msg, index) => (
//         <Message key={msg._id || index} message={msg} />
//       ))
//       }
     
      
      
//     </div>
//   )
// }
// import React, { useEffect, useRef } from 'react';
// import Message from './Message';
// import useGetMessages from '../hooks/useGetMessages';
// import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';
// import { useSelector } from 'react-redux';

// export default function MessagePage() {
//   useGetMessages();
//   useGetRealTimeMessage();

//   const { messages } = useSelector(store => store.message);
//   const { selectedUser } = useSelector(store => store.user);
//   const { socket } = useSelector(store => store.socket);

//   const bottomRef = useRef(null); // 👈 Anchor for scrolling

//   // 🔵 Emit 'messageRead' for unread messages from the selected user
//   useEffect(() => {
//     if (!socket || !selectedUser || !messages?.length) return;

//     const unreadMsgs = messages.filter(
//       (msg) =>
//         msg.SenderId === selectedUser._id &&
//         msg.status !== "read"
//     );

//     unreadMsgs.forEach((msg) => {
//       socket.emit("messageRead", msg._id);
//     });
//   }, [selectedUser, messages, socket]);

//   // ✅ Scroll to bottom whenever messages change
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   if (!messages || messages.length === 0) return null;

//   return (
//     <div className='px-4 flex-1 overflow-auto'>
//       {messages.map((msg, index) => (
//         <Message key={msg._id || index} message={msg} />
//       ))}
//       {/* ✅ Scroll anchor */}
//       <div ref={bottomRef} />
//     </div>
//   );
// }
import React, { useEffect, useRef, useState } from 'react';
import Message from './Message';
import useGetMessages from '../hooks/useGetMessages';
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';
import { useSelector } from 'react-redux';
import { isSameDay, isSameHour, format } from 'date-fns';

export default function MessagePage() {
  useGetMessages();
  useGetRealTimeMessage();

  const { messages } = useSelector((store) => store.message);
  const { selectedUser } = useSelector((store) => store.user);
  const { socket } = useSelector((store) => store.socket);

  const bottomRef = useRef(null);
  const [unreadAnchorId, setUnreadAnchorId] = useState(null);

  // Mark messages as read
  useEffect(() => {
    if (!socket || !selectedUser || !messages?.length) return;

    const unreadMsgs = messages.filter(
      (msg) => msg.SenderId === selectedUser._id && msg.status !== 'read'
    );

    unreadMsgs.forEach((msg) => {
      socket.emit('messageRead', msg._id);
    });
  }, [selectedUser, messages, socket]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Detect first unread message for indicator
  useEffect(() => {
    const unread = messages.find(
      (msg) => msg.SenderId === selectedUser?._id && msg.status !== 'read'
    );
    if (unread) {
      setUnreadAnchorId(unread._id);
    }
  }, [messages]);

  if (!messages || messages.length === 0) return null;

  let groupedMessages = [];
  let lastDate = null;
  let lastHour = null;

  messages.forEach((msg) => {
    const msgTime = new Date(msg.createdAt);

    if (!lastDate || !isSameDay(msgTime, lastDate)) {
      const today = new Date();
      let label = format(msgTime, 'dd MMM yyyy');
      if (isSameDay(msgTime, today)) label = 'Today';
      else if (isSameDay(msgTime, new Date(today.setDate(today.getDate() - 1)))) label = 'Yesterday';
      groupedMessages.push({ type: 'date', label });
    }

    if (!lastHour || !isSameHour(msgTime, lastHour)) {
      groupedMessages.push({ type: 'hour', label: format(msgTime, 'hh:mm a') });
    }

    groupedMessages.push({ type: 'message', data: msg });
    lastDate = msgTime;
    lastHour = msgTime;
  });

  return (
    <div className='px-4 flex-1 overflow-auto'>
      {groupedMessages.map((item, index) => {
        if (item.type === 'date') {
          return (
            <div key={`date-${index}`} className='text-center my-2 text-sm text-gray-400'>
              {item.label}
            </div>
          );
        }
        if (item.type === 'hour') {
          return (
            <div key={`hour-${index}`} className='text-center my-1 text-xs text-gray-500'>
              {item.label}
            </div>
          );
        }
        if (item.type === 'message') {
          return (
            <div key={item.data._id}>
              {item.data._id === unreadAnchorId && (
                <div className='text-center my-2 text-sm font-semibold text-yellow-400'>
                  Unread Messages
                </div>
              )}
              <Message message={item.data} />
            </div>
          );
        }
        return null;
      })}
      <div ref={bottomRef} />
    </div>
  );
}
