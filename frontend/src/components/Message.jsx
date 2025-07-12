

import { useSelector } from "react-redux";

export default function Message({ message }) {
  const { authUser, selectedUser } = useSelector((store) => store.user);
  const isSender = message?.SenderId.toString() === authUser?._id;
  const isReceiver = !isSender;

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderStatus = () => {
    if (!isSender) return null;
    if (message.status === "sent") return "✓";
    if (message.status === "delivered") return "✓✓";
    if (message.status === "read") return <span className="text-blue-500">✓✓</span>;
    return "";
  };

  return (
    <div>
      <div className={`chat ${isSender ? 'chat-end' : 'chat-start'}`}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              alt="User avatar"
              src={isSender ? authUser?.ProfilePhoto : selectedUser?.ProfilePhoto}
            />
          </div>
        </div>

        <div className="chat-header">
          <time className="text-xs opacity-50">{formatTime(message.createdAt)}</time>
        </div>

        <div className={`chat-bubble break-words max-w-xs sm:max-w-sm md:max-w-md ${isReceiver ? 'bg-gray-100 text-black' : ''}`}>
          {message?.messages}
          {isSender && (
            <span className="text-[10px] ml-2 flex justify-end items-center gap-1">
              {renderStatus()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
