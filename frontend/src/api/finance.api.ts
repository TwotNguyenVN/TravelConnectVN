import api from '../services/api';

export const financeApi = {
  reconcileTransactions: (data: any[]) => api.post('/finance/reconcile', { statementRows: data }),
  generateInvoice: (id: string) => api.post(`/finance/invoices/generate/${id}`),
  getForecasting: (days: number) => api.get('/finance/forecasting', { params: { days } }),
};
