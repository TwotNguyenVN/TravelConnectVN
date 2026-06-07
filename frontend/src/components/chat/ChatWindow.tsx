import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../../store/useChatStore';
import ChatInput from './ChatInput';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';

interface ChatWindowProps {
  conversationId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId }) => {
  const { user } = useAuth();
  const { messages, activeConversationId, setActiveConversation, typingUsers } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId && conversationId !== activeConversationId) {
      setActiveConversation(conversationId);
    }
  }, [conversationId, activeConversationId, setActiveConversation]);

  useEffect(() => {
    // Auto scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const typingInRoom = typingUsers[conversationId] || [];
  const otherTyping = typingInRoom.filter(id => id !== user?.id);

  return (
    <div className="flex flex-col h-full bg-gray-50 border rounded-lg overflow-hidden shadow-sm">
      <div className="bg-white border-b px-4 py-3 flex justify-between items-center shadow-sm">
        <h3 className="font-semibold text-gray-800">Chat</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const isMine = msg.sender_user_id === user?.id;
          return (
            <div key={msg.id || index} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-lg px-4 py-2 ${isMine ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border text-gray-800 rounded-bl-none shadow-sm'}`}>
                {msg.message_type === 'text' && <p>{msg.content}</p>}
                {msg.message_type === 'image' && msg.attachment_url && (
                  <img src={msg.attachment_url} alt="Attachment" className="max-w-full rounded-md mt-1 mb-1 max-h-48 object-cover" />
                )}
                {msg.message_type === 'audio' && msg.attachment_url && (
                  <audio controls className="max-w-full mt-1">
                    <source src={msg.attachment_url} />
                  </audio>
                )}
                <div className={`text-[10px] mt-1 text-right ${isMine ? 'text-blue-200' : 'text-gray-400'}`}>
                  {format(new Date(msg.sent_at), 'HH:mm')}
                </div>
              </div>
            </div>
          );
        })}
        {otherTyping.length > 0 && (
          <div className="text-xs text-gray-500 italic ml-2">Someone is typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput conversationId={conversationId} />
    </div>
  );
};

export default ChatWindow;
