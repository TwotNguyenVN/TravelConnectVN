import axiosClient from './axiosClient';

export const financeApi = {
  reconcileTransactions: (data: any[]) => axiosClient.post('/finance/reconcile', { statementRows: data }),
  generateInvoice: (id: string) => axiosClient.post(`/finance/invoices/generate/${id}`),
  getForecasting: (days: number) => axiosClient.get('/finance/forecasting', { params: { days } }),
};
