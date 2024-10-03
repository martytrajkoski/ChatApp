import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { User, Message } from "../../types/types";

interface ChatData {
chat_id: number;
messages: Message[];
receiver: User;
}  

interface CreateChatProps {
    fetchChats: () => void;
    setIsCreatingChat: (isCreating: boolean) => void;
    chatsData: ChatData[];
}

const CreateChat: React.FC<CreateChatProps> = ({ fetchChats, setIsCreatingChat, chatsData }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axiosClient.get('fetchUsers');
            setUsers(res.data.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleCreateChat = async (userId: string) => {
        try {
            if (userId.trim()) {
                await axiosClient.post('chats/create', { 'user_id': userId });
                await fetchChats(); 

                const newChat = chatsData.find(chat => chat.receiver.id === parseInt(userId));

                if (newChat) {
                    navigate(`/chat/${newChat.chat_id}`); 
                }

                setIsCreatingChat(false);
            }
        } catch (error) {
            console.error('Error creating chat:', error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );

    return (
        <div className="recent-chats">
            <h4>New Chat</h4>
            <div className="search-section">
                <input
                    type="text"
                    placeholder="&#x1F50D; Search chats"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="chat-search"
                />
            </div>
            {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                    <div key={user.id} onClick={() => handleCreateChat(user.id.toString())} className="chat-item">
                        <img 
                            src={user.profile_picture} 
                            alt="Profile" 
                            className="chat-profile-pic" 
                        />
                        <div className="chat-details">
                            <p className="chat-name">{user.name}</p>
                            <small className="last-message">{user.email}</small>
                        </div>
                    </div>
                ))
            ) : (
                <p className="no-chats-found">No users found.</p>
            )}
        </div>
    );
};

export default CreateChat;
