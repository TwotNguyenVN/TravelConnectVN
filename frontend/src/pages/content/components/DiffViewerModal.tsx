import React from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import { Button } from '../../../components/common';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  oldValue: string;
  newValue: string;
  title?: string;
}

export const DiffViewerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  oldValue,
  newValue,
  title = 'So sánh thay đổi',
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          width: '80%',
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '18px' }}>{title}</h2>
          <Button variant="outline" size="small" onClick={onClose}>
            Đóng
          </Button>
        </div>
        <div
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <ReactDiffViewer
            oldValue={oldValue}
            newValue={newValue}
            splitView={true}
            hideLineNumbers={false}
          />
        </div>
      </div>
    </div>
  );
};
