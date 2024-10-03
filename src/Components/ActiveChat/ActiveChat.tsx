import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import echo from '../../Listener/echo';
import { Message, User } from '../../types/types';

const emojiList = ['😊', '😂', '❤️', '👍', '🙌', '🎉', '😎'];

const ActiveChat: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesSectionRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [receiver, setReceiver] = useState<User | null>(null);
  const [sender, setSender] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  // const [showOptions, setShowOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  // const toggleOptions = () => setShowOptions(!showOptions);
  const toggleEmojiPicker = () => setShowEmojiPicker(!showEmojiPicker);

  useEffect(() => {
    fetchUser();
    fetchMessages(page);
  }, [id]);
  
  useEffect(() => {   
    broadcast();
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      handleReadAt(messages[messages.length - 1].id);
    }
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);
  

  const broadcast = () => {
    const channel = echo.private(`message.${id}`);    
    channel.listen('GotMessage', async () => { await fetchMessages(page); });

    return () => {
      echo.leave(`message.${id}`);
    };
  };

  const fetchUser = async () => {
    try {
      const response = await axiosClient.get('/user');
      setSender(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchMessages = async (page: number, prepend: boolean = false) => {
    try {
      const response = await axiosClient.get(`messages/chats/${id}/messages`, {
        params: { page }
      });
      const sortedMessages = response.data.messages.sort(
        (a: Message, b: Message) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      if (prepend) {
        setMessages((prevMessages) => [...sortedMessages, ...prevMessages]); 
      } else {
        setMessages(sortedMessages);
      }

      setReceiver(response.data.receiver);
      setHasMoreMessages(response.data.messages.length >= 30);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleReadAt = async (lastMessageId: number) => {
    try {
      await axiosClient.patch(`messages/${lastMessageId}/read`);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const formatSeenDate = (readAt :string) => {
    const readDate = new Date(readAt);
    const now = new Date();
    const timeDifference = now.getTime() - readDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    const isToday = readDate.toDateString() === now.toDateString();

    if (isToday) {
        return `${readDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (daysDifference === 1) {
        return '1 day ago';
    } else if (daysDifference > 1) {
        return `${readDate.toLocaleDateString('en-GB')}`; 
    } else {
        return `${readDate.toLocaleDateString('en-GB')}`;
    }
};


  const sendMessage = async () => {
    if (newMessage.trim() !== '') {
      try {
        await axiosClient.post(`messages/chats/${id}/messages`, {
          chat_id: id,
          receiver_id: receiver?.id,
          content: newMessage,
        });
        setNewMessage('');
        fetchMessages(page);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage((prevMessage) => prevMessage + emoji);
  };

  const uploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      console.log('Photo selected:', file.name);
      // Implement logic to handle and send the selected image file
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (messagesSectionRef.current) {
      const { scrollTop } = messagesSectionRef.current;

      if (scrollTop === 0 && hasMoreMessages) {
        const previousScrollHeight = messagesSectionRef.current.scrollHeight;

        fetchMessages(page + 1, true);
        setPage((prevPage) => prevPage + 1);

        setTimeout(() => {
          if (messagesSectionRef.current) {
            messagesSectionRef.current.scrollTop = messagesSectionRef.current.scrollHeight - previousScrollHeight;
          }
        }, 100);
      }
    }
  };
 
  return (
    <div className="active-chat">
      <div className="chat-header">
        <div className="chat-info">
          <img
            src={receiver?.profile_picture}
            alt={receiver?.name || 'Profile'}
            className="profile-pic"
          />
          <p className="username">{receiver?.name || 'Loading...'}</p>
        </div>
        {/* <div className="chat-options">
          <button className="dots-button" onClick={toggleOptions}>
            ...
          </button>
          {showOptions && (
            <div className="popup-menu">
              <button className="popup-option">Edit</button>
              <button className="popup-option">Delete</button>
            </div>
          )}
        </div> */}
      </div>

      <div
        className="messages-section"
        ref={messagesSectionRef}
        onScroll={handleScroll}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              sender && message.user_id === sender.id ? 'outgoing' : 'incoming'
            }`}
          >
            <p className="message-content">{message.content}</p>
            {message.users[0]?.pivot?.read_at && sender && message.user_id === sender.id ?(
              <small>Seen {formatSeenDate(message.users[0].pivot.read_at)}</small>
            ) : (
              <div></div>
            )}
            <div ref={messagesEndRef} />
          </div>
        ))}
      </div>

      <div className="message-input-section">
  {/* <label htmlFor="photo-upload">
    <button className="camera-button">📷</button>
  </label> */}
  <button className="emoji-button" onClick={toggleEmojiPicker}>
    😊
  </button>
  {showEmojiPicker && (
    <div className="emoji-picker" ref={emojiPickerRef}>
      {emojiList.map((emoji, index) => (
        <button
          key={index}
          className="emoji"
          onClick={() => addEmoji(emoji)}
        >
          {emoji}
        </button>
      ))}
    </div>
  )}


  <input
    type="file"
    id="photo-upload"
    style={{ display: 'none' }}
    accept="image/*"
    onChange={uploadPhoto}
  />

  <input
    type="text"
    value={newMessage}
    onChange={(e) => setNewMessage(e.target.value)}
    placeholder="Type a message..."
    className="message-input"
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); 
        sendMessage();
      }
    }}
  />
  <button className="send-button" onClick={sendMessage}>
    Send
  </button>
</div>

    </div>
  );
};

export default ActiveChat;
