import React, { useState, useRef } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { Send, Image as ImageIcon, Mic } from 'lucide-react';
import { api } from '../../lib/api';

interface ChatInputProps {
  conversationId: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ conversationId }) => {
  const [text, setText] = useState('');
  const { sendMessage, sendTyping } = useChatStore();
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendText = () => {
    if (!text.trim()) return;
    sendMessage(conversationId, text.trim(), 'text');
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    } else {
      sendTyping(conversationId);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      // We will implement this backend endpoint soon
      const response = await api.post('/chat/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      sendMessage(conversationId, file.name, 'image', response.data.url);
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload image');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('file', audioBlob, 'voice.webm');
        try {
          const response = await api.post('/chat/media', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          sendMessage(conversationId, 'Voice message', 'audio', response.data.url);
        } catch (err) {
          console.error('Audio upload failed', err);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied', err);
      alert('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="bg-white p-3 border-t flex items-center gap-2">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
      
      <button 
        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
        onClick={() => fileInputRef.current?.click()}
        title="Send Image"
      >
        <ImageIcon size={20} />
      </button>

      <input 
        type="text" 
        className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-none"
        placeholder={isRecording ? "Recording audio..." : "Type a message..."}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isRecording}
      />

      {text.trim() ? (
        <button 
          className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
          onClick={handleSendText}
        >
          <Send size={20} />
        </button>
      ) : (
        <button 
          className={`p-2 rounded-full transition-colors ${isRecording ? 'text-white bg-red-500 animate-pulse' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'}`}
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onMouseLeave={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          title="Hold to record audio"
        >
          <Mic size={20} />
        </button>
      )}
    </div>
  );
};

export default ChatInput;
