import api from './api';

export const paymentService = {
  createVnpayUrl: async (tourRequestId: string) => {
    return api.post('/payments/create-vnpay-url', { tourRequestId });
  },

  getMyTransactions: async () => {
    return api.get('/payments/my-transactions');
  }
};
