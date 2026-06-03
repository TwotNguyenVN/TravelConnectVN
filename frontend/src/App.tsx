import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { SocketProvider } from './contexts/SocketContext';
import { MiniChatProvider } from './contexts/MiniChatContext';
import { MiniChatContainer } from './components/chat/MiniChatContainer';
import { MaintenanceWrapper } from './routes/MaintenanceWrapper';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <SocketProvider>
          <MiniChatProvider>
            <MaintenanceWrapper>
              <RouterProvider router={router} />
              <MiniChatContainer />
            </MaintenanceWrapper>
          </MiniChatProvider>
        </SocketProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
