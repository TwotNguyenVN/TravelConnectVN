import React, { useState, useEffect } from 'react';
import { Card, Table, Badge } from '../../components/common';
import type { Column } from '../../components/common/Table/Table';
import { paymentService } from '../../services/paymentService';
import './TransactionHistoryPage.css';

interface Transaction {
  id: string;
  amount: number;
  payment_method: string;
  status: string;
  transaction_code: string;
  created_at: string;
  tour_requests: {
    tours: {
      title: string;
    }
  }
}

const TransactionHistoryPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await paymentService.getMyTransactions();
      if (res && res.success && res.data) {
        setTransactions(res.data);
      }
    } catch (error) {
      console.error('Lỗi lấy lịch sử giao dịch:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Thành công</Badge>;
      case 'pending':
        return <Badge variant="warning">Đang chờ</Badge>;
      case 'failed':
        return <Badge variant="danger">Thất bại</Badge>;
      default:
        return <Badge variant="secondary">{status || 'N/A'}</Badge>;
    }
  };

  const columns: Column<Transaction>[] = [
    {
      title: 'Mã giao dịch',
      key: 'transaction_code',
      render: (record) => <span className="text-mono">{record.transaction_code?.substring(0, 8) || 'N/A'}...</span>
    },
    {
      title: 'Tour',
      key: 'tour',
      render: (record) => record.tour_requests?.tours?.title || 'N/A'
    },
    {
      title: 'Số tiền',
      key: 'amount',
      render: (record) => <span className="amount">{Number(record.amount || 0).toLocaleString()}đ</span>
    },
    {
      title: 'Phương thức',
      key: 'payment_method',
      render: (record) => <span style={{ textTransform: 'uppercase' }}>{record.payment_method || 'VNPAY'}</span>
    },
    {
      title: 'Ngày giao dịch',
      key: 'created_at',
      render: (record) => record.created_at ? new Date(record.created_at).toLocaleString('vi-VN') : 'N/A'
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (record) => getStatusBadge(record.status)
    }
  ];

  return (
    <div className="transaction-history-container">
      <div className="page-header">
        <h1>Lịch sử thanh toán</h1>
        <p>Xem lại tất cả các giao dịch thanh toán tour của bạn qua VNPAY.</p>
      </div>

      <Card>
        <Table
          columns={columns}
          data={transactions}
          isLoading={loading}
          emptyText="Bạn chưa có giao dịch nào."
          rowKey={(r) => r.id || Math.random().toString()}
        />
      </Card>
    </div>
  );
};

export default TransactionHistoryPage;
