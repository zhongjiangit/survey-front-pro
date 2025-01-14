'use client';

import { DetailShowType, DetailShowTypeEnum } from '@/types/CommonType';

import { Modal } from 'antd';
import React, { useState } from 'react';
import FillCollect from './detail';
import './style.css';

export type taskType = {
  taskId: number;
  templateId: number;
  taskName: string;
  maxFillCount: number;
  description?: string;
};

interface PageProps {
  action?: React.ReactNode;
  customTitle?: React.ReactNode;
  task: taskType | undefined;
  singleFillId?: number;
  showType?: DetailShowType;
}

const FillDetail = ({
  task = { taskId: 0, templateId: 0, taskName: '', maxFillCount: 0 },
  showType = DetailShowTypeEnum.Check,
  singleFillId,
  customTitle,
  action,
}: PageProps) => {
  const [isFillDetailOpen, setIsFillDetailOpen] = useState(false);

  return (
    <>
      <span
        onClick={() => {
          setIsFillDetailOpen(true);
        }}
      >
        {action || '填报详情'}
      </span>
      {isFillDetailOpen && (
        <Modal
          title={customTitle || '填报详情'}
          open={isFillDetailOpen}
          onCancel={() => {
            setIsFillDetailOpen(false);
          }}
          style={{ top: 20 }}
          width={1400}
          footer={null}
          destroyOnClose
          maskClosable={false}
        >
          <div className="py-10 min-h-96 h-[80vh] shadow-lg">
            {isFillDetailOpen && (
              <FillCollect
                task={task}
                singleFillId={singleFillId}
                showType={showType}
              />
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default FillDetail;
