import React, { useState, useEffect, useCallback } from 'react';
import { LoadingBlock, EmptyState } from '../../components/common';
import { Button } from '../../components/common/Button/Button';
import { useToast } from '../../contexts/ToastContext';
import userActivityLogsService from '../../services/userActivityLogsService';
import type { ActivityLog } from '../../services/userActivityLogsService';

import './ActivityLogsPage.css';

// ── Filter categories ──────────────────────────────────────────────────────
const FILTER_OPTIONS = [
  { key: 'all',              label: 'Tất cả',        icon: '📋' },
  { key: 'auth',             label: 'Tài khoản',     icon: '🔐' },
  { key: 'profile',          label: 'Hồ sơ',         icon: '👤' },
  { key: 'tour_request',     label: 'Yêu cầu tour',  icon: '🎫' },
  { key: 'companion_post',   label: 'Bài đồng hành', icon: '🤝' },
  { key: 'companion_request',label: 'Yêu cầu ĐH',   icon: '📨' },
  { key: 'favorite',         label: 'Yêu thích',     icon: '❤️' },
  { key: 'review',           label: 'Đánh giá',      icon: '⭐' },
  { key: 'report',           label: 'Báo cáo',       icon: '🚩' },
  { key: 'guide',            label: 'Xác minh HDV',  icon: '🛡️' },
];

const getActivityIcon = (type: string): string => {
  if (type.startsWith('auth'))              return '🔐';
  if (type.startsWith('profile'))          return '👤';
  if (type.startsWith('tour_request'))     return '🎫';
  if (type.startsWith('companion_post'))   return '🤝';
  if (type.startsWith('companion_request'))return '📨';
  if (type.startsWith('favorite'))         return '❤️';
  if (type.startsWith('review'))           return '⭐';
  if (type.startsWith('report'))           return '🚩';
  if (type.startsWith('guide'))            return '🛡️';
  return '📌';
};

const formatRelativeTime = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} ngày trước`;
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

// ── Component ──────────────────────────────────────────────────────────────
export const ActivityLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const { toast } = useToast();

  const fetchLogs = useCallback(async (pageNum: number, filter: string, append = false) => {
    try {
      if (!append) setLoading(true);
      const res = await userActivityLogsService.getMyLogs(pageNum, 20, filter);
      if (res.success && res.data) {
        if (append) {
          setLogs(prev => [...prev, ...res.data!.data]);
        } else {
          setLogs(res.data.data);
        }
        setHasMore(pageNum < res.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
      toast.error('Không thể tải nhật ký hoạt động');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Reset & fetch when filter changes
  useEffect(() => {
    setPage(1);
    setLogs([]);
    fetchLogs(1, activeFilter);
  }, [activeFilter, fetchLogs]);

  const handleFilterChange = (key: string) => {
    if (key === activeFilter) return;
    setActiveFilter(key);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchLogs(nextPage, activeFilter, true);
  };

  return (
    <div className="activity-logs-page">
      <div className="logs-container">
        {/* Header */}
        <div style={{ marginBottom: 'var(--tc-spacing-6)' }}>
          <h1 style={{ fontSize: 'var(--tc-font-size-xl)', marginBottom: 'var(--tc-spacing-1)' }}>
            Nhật ký hoạt động
          </h1>
          <p style={{ color: 'var(--tc-text-secondary)', margin: 0 }}>
            Xem lại lịch sử các hành động bạn đã thực hiện trên TravelConnect.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="logs-filter-tabs" style={{
          display: 'flex',
          gap: 'var(--tc-spacing-2)',
          flexWrap: 'wrap',
          marginBottom: 'var(--tc-spacing-5)',
          paddingBottom: 'var(--tc-spacing-4)',
          borderBottom: '1px solid var(--tc-border)',
        }}>
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => handleFilterChange(opt.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--tc-radius-full)',
                border: activeFilter === opt.key
                  ? '1.5px solid var(--tc-primary)'
                  : '1.5px solid var(--tc-border)',
                backgroundColor: activeFilter === opt.key
                  ? 'var(--tc-primary-light)'
                  : 'var(--tc-bg-default)',
                color: activeFilter === opt.key
                  ? 'var(--tc-primary)'
                  : 'var(--tc-text-secondary)',
                fontSize: 'var(--tc-font-size-sm)',
                fontWeight: activeFilter === opt.key ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading && page === 1 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3].map(i => <LoadingBlock key={i} height={90} />)}
          </div>
        ) : logs.length > 0 ? (
          <>
            <div className="logs-timeline">
              {logs.map((log) => (
                <div key={log.id} className="log-item">
                  <div className="log-icon-col">
                    <div className="log-icon-bubble">
                      {getActivityIcon(log.action_type)}
                    </div>
                    <div className="log-connector" />
                  </div>
                  <div className="log-content">
                    <div className="log-header">
                      <span className="log-type">
                        {log.action_type.replace(/[._]/g, ' ')}
                      </span>
                      <span className="log-time" title={new Date(log.created_at).toLocaleString('vi-VN')}>
                        {formatRelativeTime(log.created_at)}
                      </span>
                    </div>
                    <div className="log-description">
                      {(log as any).description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--tc-spacing-6)' }}>
                <Button variant="outline" onClick={loadMore} isLoading={loading}>
                  Xem thêm hoạt động
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="Chưa có hoạt động nào"
            description={
              activeFilter === 'all'
                ? 'Lịch sử hoạt động của bạn sẽ xuất hiện ở đây sau khi bạn thực hiện các tác vụ trên TravelConnect.'
                : `Bạn chưa có hoạt động nào thuộc nhóm "${FILTER_OPTIONS.find(o => o.key === activeFilter)?.label}".`
            }
            icon="📝"
          />
        )}
      </div>
    </div>
  );
};

export default ActivityLogsPage;
