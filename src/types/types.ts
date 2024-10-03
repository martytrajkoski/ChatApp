export interface Pivot {
    read_at: string | null;
    user_id: number;
  }
  
  export interface User {
    id: number;
    name: string;
    email: string;
    profile_picture: string;
    pivot: Pivot;
    created_at: string;
  }
  
  export interface Message {
    id: number;
    content: string;
    read_at: string | null;
    created_at: string;
    updated_at: string;
    user_id: number;
    sender_id: number;
    chat_id: number;
    users: User[];
  }
  
  export interface Receiver {
    id: number;
    name: string;
    profile_picture?: string;
  }
  
  export interface ChatData {
    chat_id: number;
    messages: Message[];
    receiver: User;
  }
  