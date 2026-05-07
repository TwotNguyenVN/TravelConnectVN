import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { SocketProvider } from './contexts/SocketContext';
import { MiniChatProvider } from './contexts/MiniChatContext';
import { MiniChatContainer } from './components/chat/MiniChatContainer';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <SocketProvider>
          <MiniChatProvider>
            <RouterProvider router={router} />
            <MiniChatContainer />
          </MiniChatProvider>
        </SocketProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
