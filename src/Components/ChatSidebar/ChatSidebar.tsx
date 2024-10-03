import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ChatItem from './ChatItem';
import axiosClient from '../../api/axiosClient';
import CreateChat from './CreateChat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faAdd } from '@fortawesome/free-solid-svg-icons';
import echo from '../../Listener/echo';
import { Message, User } from '../../types/types';

interface ChatData {
  chat_id: number;
  messages: Message[];
  receiver: User;
}

const ChatSidebar: React.FC = () => {
  const { id } = useParams();

  const[user, setUser] = useState<User>();
  const [chatsData, setChatsData] = useState<ChatData[]>([]);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUser()
    fetchChats();
  }, [id]);

  useEffect(() => {
    if (!id) return; 

    const channel = echo.private(`message.${id}`);
    channel.listen('GotMessage', async () => {
      await fetchChats();
    });

    return () => {
      echo.leave(`message.${id}`);
    };
  }, [id]); 

  const fetchUser = async() => {
    try {
      const res = await axiosClient.get('user');
      setUser(res.data)
    } catch (error) {
      
    }
  }

  const fetchChats = async () => {
    try {
      const response = await axiosClient.get('chats/fetch');
      setChatsData(response.data);
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleNewChat = () => {
    setIsCreatingChat(!isCreatingChat);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredChats = chatsData.filter(data =>
    data.receiver.name.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="chat-sidebar">
      <div className="top-section">
        {user?.profile_picture ?(
          <Link to={"/profile"}>
            <img src={user?.profile_picture ? `${user.profile_picture}` : ''} alt="Profile" className="profile-pic" />
          </Link>

        ):(
          <div></div>
        )}
        <button className="new-chat-button" onClick={handleNewChat}>
          {isCreatingChat ? (<FontAwesomeIcon icon={faArrowLeft}/>) : (<FontAwesomeIcon icon={faAdd}/>) }
        </button>
      </div>
      {isCreatingChat ? (
        <CreateChat fetchChats={fetchChats} setIsCreatingChat={setIsCreatingChat} chatsData={chatsData} />
      ) : (
        <div className="recent-chats">
          <div className="search-section">
            <input 
              type="text" 
              placeholder="&#x1F50D; Search chats" 
              className="chat-search" 
              onChange={handleSearch}
              value={searchTerm}/>
          </div>
          {filteredChats.length > 0 ? (
            filteredChats.map((chat)=>(
              <ChatItem 
                key={chat.chat_id} 
                chat={chat} 
                isActive={!!id && parseInt(id) === chat.chat_id}
              />
            ))
          ):(
            <p className='no-chats-found'>No chats found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
