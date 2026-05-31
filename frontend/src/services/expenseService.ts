import api from './api';

export interface ExpenseSplit {
  expense_id: string;
  user_id: string;
  amount: number;
  status: 'pending' | 'settled';
  settled_at?: string;
  user?: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
}

export interface TripExpense {
  id: string;
  post_id: string;
  title: string;
  amount: number;
  currency_code: string;
  paid_by_user_id: string;
  created_by_user_id: string;
  expense_date: string;
  created_at: string;
  updated_at: string;
  payer: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  splits: ExpenseSplit[];
}

export interface MemberBalance {
  userId: string;
  fullName: string;
  avatarUrl: string;
  paid: number;
  share: number;
  netBalance: number;
}

export interface SuggestedSettlement {
  debtorId: string;
  debtorName: string;
  creditorId: string;
  creditorName: string;
  creditorBankId?: string;
  creditorAccountNo?: string;
  creditorAccountName?: string;
  amount: number;
}

export interface ExpenseSummary {
  totalAmount: number;
  memberBalances: MemberBalance[];
  suggestedSettlements: SuggestedSettlement[];
}

export interface ExpensesResponse {
  expenses: TripExpense[];
  members: {
    id: string;
    fullName: string;
    avatarUrl: string;
    bankId?: string;
    accountNo?: string;
    accountName?: string;
  }[];
  summary: ExpenseSummary;
}

export const expenseService = {
  getExpenses: async (postId: string) => {
    const res = await api.get(`/companion-posts/${postId}/expenses`);
    return res;
  },

  createExpense: async (postId: string, data: {
    title: string;
    amount: number;
    paidByUserId: string;
    expenseDate: string;
    splits: { userId: string; amount: number }[];
  }) => {
    const res = await api.post(`/companion-posts/${postId}/expenses`, data);
    return res;
  },

  deleteExpense: async (postId: string, expenseId: string) => {
    const res = await api.delete(`/companion-posts/${postId}/expenses/${expenseId}`);
    return res;
  },

  settleDebt: async (postId: string, data: { debtorId: string; creditorId: string }) => {
    const res = await api.post(`/companion-posts/${postId}/expenses/settle`, data);
    return res;
  },

  updateMyBank: async (postId: string, data: { bankId: string; accountNo: string; accountName: string }) => {
    const res = await api.put(`/companion-posts/${postId}/expenses/bank`, data);
    return res;
  },
};
export default expenseService;
