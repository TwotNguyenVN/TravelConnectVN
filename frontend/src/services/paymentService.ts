import api from './api';

export const paymentService = {
  createVnpayUrl: async (tourRequestId: string, paymentType: 'full' | 'deposit' = 'full') => {
    return api.post('/payments/create-vnpay-url', { tourRequestId, paymentType });
  },

  getMyTransactions: async () => {
    return api.get('/payments/my-transactions');
  },
  
  cancelTransaction: async (id: string) => {
    return api.post(`/payments/${id}/cancel`);
  }
};
