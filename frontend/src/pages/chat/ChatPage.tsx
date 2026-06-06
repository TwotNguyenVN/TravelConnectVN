import React, { useEffect, useState } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { useAuth } from '../../hooks/useAuth';
import ChatWindow from '../../components/chat/ChatWindow';
import { api } from '../../lib/api';

const ChatPage = () => {
  const { token, user } = useAuth();
  const { connect, disconnect, isConnected, conversations, setMessages } = useChatStore();
  const [inbox, setInbox] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      connect(token);
    }
    return () => {
      disconnect();
    };
  }, [token, connect, disconnect]);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await api.get('/chat/conversations');
        setInbox(res.data);
      } catch (err) {
        console.error('Failed to load conversations', err);
      }
    };
    fetchInbox();
  }, []);

  const handleSelectConversation = async (convId: string) => {
    setActiveId(convId);
    try {
      const res = await api.get(`/chat/conversations/${convId}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[80vh] flex border rounded-xl overflow-hidden mt-8 shadow-md">
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r flex flex-col">
        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
          <h2 className="font-bold text-lg">Inbox</h2>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} title={isConnected ? 'Connected' : 'Disconnected'} />
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {inbox.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">No conversations found.</div>
          ) : (
            inbox.map((conv) => (
              <div 
                key={conv.id} 
                className={`p-4 border-b cursor-pointer hover:bg-blue-50 transition-colors ${activeId === conv.id ? 'bg-blue-100' : ''}`}
                onClick={() => handleSelectConversation(conv.id)}
              >
                <div className="font-medium text-gray-800">
                  {conv.conversation_participants?.filter((p: any) => p.users.id !== user?.id).map((p: any) => p.users.full_name).join(', ') || 'Conversation'}
                </div>
                <div className="text-sm text-gray-500 truncate mt-1">
                  {conv.messages?.[0]?.content || 'No messages yet'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-gray-50">
        {activeId ? (
          <ChatWindow conversationId={activeId} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
