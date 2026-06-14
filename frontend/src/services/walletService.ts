import api from './api';

export interface Wallet {
  id: string;
  balance: number;
  total_spent: number;
  created_at: string;
}

export interface WalletTransaction {
  id: string;
  transaction_type: 'deposit' | 'withdraw' | 'payment' | 'refund';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  created_at: string;
}

const walletService = {
  getMyWallet: async () => {
    const response = await api.get('/wallet/my-wallet');
    return response.data;
  },

  getTransactions: async () => {
    const response = await api.get('/wallet/transactions');
    return response.data;
  },

  deposit: async (amount: number, description?: string) => {
    const response = await api.post('/wallet/deposit', { amount, description });
    return response.data;
  },

  withdraw: async (amount: number, description?: string) => {
    const res = await api.post('/wallet/withdraw', { amount, description });
    return res.data;
  },

  async payForBooking(tourRequestId: string, paymentType: string) {
    const res = await api.post('/wallet/pay-booking', { tourRequestId, paymentType });
    return res.data;
  }
};

export default walletService;
