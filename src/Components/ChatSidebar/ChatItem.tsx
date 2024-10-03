import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { Message, User } from "../../types/types";

interface ChatItemProps {
  chat: {
    chat_id: number,
    messages: Message[],
    receiver: User,
  },
  isActive: boolean;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, isActive }) => {
  const navigate = useNavigate();
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [user, setUser] = useState<User>()
  const popupMenuRef = useRef<HTMLDivElement>(null);


  useEffect(()=>{
    fetchUser();
  },[])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeChatId && popupMenuRef.current && !popupMenuRef.current.contains(event.target as Node)) {
        setActiveChatId(null);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeChatId]);  

  const togglePopup = (chatId: number) => {
    setActiveChatId(activeChatId === chatId ? null : chatId);
  };

  const fetchUser = async() => {
    try {
      const res = await axiosClient.get('user');
      setUser(res.data)
    } catch (error) {
      
    }
  }

  // const handleEdit = (chatId: number) => {
  //   console.log(`Edit chat ${chatId}`);
  // };

  const handleDelete = async (chat_id: number) => {
    try {
      await axiosClient.post(`chats/${chat_id}`, {
        'chat_id': chat_id
      });
    } catch (error) {
      console.log('Error deleting chat:', error);
    }
  };

  const notOpened = (messages: Message[]) => {  
    const lastMsg = messages[messages.length - 1];

    if(lastMsg?.users[0].pivot.read_at===null && lastMsg?.users[0].id === user?.id)
      return false;
  
    return true; 
  };

  const lastMessage = (messages: Message[]) => {
    const lastMsg = messages[messages.length - 1];
    return lastMsg ? (lastMsg.content.length > 20 ? lastMsg.content.slice(0, 20) + ' ...' : lastMsg.content) : '';
  };
 
  return (
    <div className={`chat-item ${isActive ? 'active' : ''}`} onClick={() => navigate(`/chat/${chat.chat_id}`)}>
      <img 
        src={chat.receiver?.profile_picture ? `${chat.receiver.profile_picture}` : ''} 
        alt="Profile" 
        className="chat-profile-pic" 
      />
      <div className="chat-details">
        <p className="chat-name">{chat.receiver.name || 'Unknown'}</p>
        <p className="last-message">{lastMessage(chat.messages)}</p>
      </div>
      <div className="more-options">
        {!notOpened(chat.messages) ? (
          <div className="notification"></div>
        ):(
          <button className="dots-button" onClick={(e) => { 
            e.stopPropagation(); 
            togglePopup(chat.chat_id);
          }}>...</button>
        )}
        {activeChatId === chat.chat_id && (
          <div className="popup-menu"  ref={popupMenuRef}>
            {/* <button onClick={() => handleEdit(chat.chat_id)} className="popup-option">Edit</button> */}
            <button onClick={() => handleDelete(chat.chat_id)} className="popup-option">Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatItem;
