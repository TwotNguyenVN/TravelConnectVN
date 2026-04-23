import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { SocketProvider } from './contexts/SocketContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <SocketProvider>
          <RouterProvider router={router} />
        </SocketProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
