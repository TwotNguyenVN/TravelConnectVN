import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { SocketProvider } from './contexts/SocketContext';
import { MiniChatProvider } from './contexts/MiniChatContext';
import { MiniChatContainer } from './components/chat/MiniChatContainer';
import { MaintenanceWrapper } from './routes/MaintenanceWrapper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <SocketProvider>
              <MiniChatProvider>
                <MaintenanceWrapper>
                  <RouterProvider router={router} />
                  <MiniChatContainer />
                  <Toaster richColors position="top-right" />
                </MaintenanceWrapper>
              </MiniChatProvider>
            </SocketProvider>
          </ToastProvider>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
