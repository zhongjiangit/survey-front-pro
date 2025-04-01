'use client';

import Api from '@/api';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { DetailShowType, DetailShowTypeEnum } from '@/types/CommonType';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Empty, message, Modal, Tabs } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import FillCollect from './detail';
import './style.css';
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

export type taskType = {
  taskId: number;
  templateId: number;
  taskName: string;
  maxFillCount: number;
  description?: string;
};

interface PageProps {
  customTitle?: string;
  task: taskType | undefined;
  staffId?: number;
  showType?: DetailShowType;
  refresh?: () => void;
}

const TaskDetail = ({
  task = { taskId: 0, templateId: 0, taskName: '', maxFillCount: 0 },
  showType = DetailShowTypeEnum.Check,
  staffId,
  customTitle,
  refresh,
}: PageProps) => {
  const { taskId, maxFillCount = 0 } = task;
  const [activeKey, setActiveKey] = useState('0');
  const [items, setItems] = useState<any>([]);
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const newTabIndex = useRef(0);
  const [isFillDetailOpen, setIsFillDetailOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  /**
   * 获取填表列表
   */
  const { run: getListSingleFill } = useRequest(
    () => {
      if (!currentSystem?.systemId || !currentOrg?.orgId) {
        return Promise.reject('currentSystem or currentOrg is not exist');
      }
      const params: any = {
        currentSystemId: currentSystem.systemId,
        currentOrgId: currentOrg!.orgId!,
        taskId: taskId,
      };
      if (showType === DetailShowTypeEnum.Check && staffId) {
        params['staffId'] = staffId;
      }
      return Api.listSingleFill(params);
    },
    {
      manual: true,
      onSuccess: data => {
        const newPanes = [...items];
        data.data.forEach((item: any) => {
          const index = newTabIndex.current++;
          newPanes.push({
            label: `NO ${item.fillIndex}`,
            singleFillId: item.singleFillId,
            children: (
              <FillCollect
                singleFillId={item.singleFillId}
                task={task}
                showType={showType}
                refresh={refresh}
              />
            ),
            key: `newTab${item.singleFillId}`,
            closable: showType === DetailShowTypeEnum.Fill,
          });
        });
        setItems(newPanes);
        setActiveKey(newPanes[0]?.key);
        if (showType === DetailShowTypeEnum.Fill && newPanes.length === 0) {
          add();
        }
      },
    }
  );

  /**
   * 创建填报文件
   */
  const { run: createSingleFill, loading: createSingleFillLoading } =
    useRequest(
      () => {
        if (!currentSystem?.systemId || !currentOrg?.orgId) {
          return Promise.reject('currentSystem or currentOrg is not exist');
        }
        return Api.createSingleFill({
          currentSystemId: currentSystem.systemId,
          currentOrgId: currentOrg!.orgId!,
          taskId: taskId,
        });
      },
      {
        manual: true,
        onSuccess: (data, params) => {
          const newPanes = [...items];
          const newActiveKey = `newTab${data.data.singleFillId}`;
          newPanes.push({
            label: `NO ${newPanes.length + 1}`,
            singleFillId: data.data.singleFillId,
            children: (
              <FillCollect
                singleFillId={data.data.singleFillId}
                task={task}
                refresh={refresh}
              />
            ),
            key: newActiveKey,
            closable: showType === DetailShowTypeEnum.Fill,
          });
          setItems(newPanes);
          setActiveKey(newActiveKey);
          refresh?.();
        },
      }
    );

  /**
   * 删除填报文件
   */
  const { run: deleteSingleFill } = useRequest(
    (singleFillId: number, targetKey: TargetKey) => {
      if (!currentSystem?.systemId || !currentOrg?.orgId) {
        return Promise.reject('currentSystem or currentOrg is not exist');
      }
      return Api.deleteSingleFill({
        currentSystemId: currentSystem.systemId,
        currentOrgId: currentOrg!.orgId!,
        taskId: taskId,
        singleFillId: singleFillId,
      });
    },
    {
      manual: true,
      onSuccess: (data, [singleFillId, targetKey]) => {
        if (data.result === 0) {
          const idx = items.findIndex((item: any) => item.key === targetKey);
          const newItems = items
            .filter((t: any) => t.key !== targetKey)
            .map((t: any, idx: number) => ({ ...t, label: `NO ${++idx}` }));
          setItems(newItems);
          if (targetKey === activeKey) {
            setActiveKey(newItems[idx]?.key || newItems[idx - 1]?.key);
          }
          refresh?.();
        }
      },
    }
  );

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = useCallback(() => {
    if (
      showType !== DetailShowTypeEnum.Fill ||
      (maxFillCount && items.length >= maxFillCount)
    ) {
      return;
    }
    createSingleFill();
  }, [createSingleFill, items.length, maxFillCount, showType]);

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove'
  ) => {
    console.log('targetKey', targetKey);
    if (showType === DetailShowTypeEnum.Check) {
      messageApi.error('查看模式下不允许操作');
      return;
    }
    if (action === 'add') {
      add();
    } else {
      const item = items.find((item: any) => item.key === targetKey);
      if (item?.singleFillId) {
        deleteSingleFill(item.singleFillId, targetKey);
      }
    }
  };

  useEffect(() => {
    if (isFillDetailOpen) {
      getListSingleFill();
    }
  }, [getListSingleFill, isFillDetailOpen]);

  return (
    <>
      {contextHolder}
      <a
        className="text-blue-500 block max-w-8"
        onClick={() => {
          setIsFillDetailOpen(true);
        }}
      >
        {customTitle || '填报详情'}
      </a>
      <Modal
        title={customTitle || '填报详情'}
        open={isFillDetailOpen}
        onCancel={() => {
          setIsFillDetailOpen(false);
          setItems([]);
        }}
        style={{ top: 20 }}
        width={1400}
        footer={null}
        destroyOnClose
        maskClosable={false}
      >
        {showType === DetailShowTypeEnum.Check && items.length === 0 ? (
          <Empty />
        ) : (
          <div className="py-10 min-h-96 h-[80vh] shadow-lg">
            <Tabs
              rootClassName="fill-detail-tabs"
              tabPosition={'left'}
              type="editable-card"
              onChange={onChange}
              activeKey={items.length ? activeKey : 'nofill'}
              onEdit={onEdit}
              addIcon={
                createSingleFillLoading ? <LoadingOutlined /> : <PlusOutlined />
              }
              hideAdd={
                (maxFillCount && items.length >= maxFillCount) ||
                showType === DetailShowTypeEnum.Check
              }
              items={items}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default TaskDetail;
