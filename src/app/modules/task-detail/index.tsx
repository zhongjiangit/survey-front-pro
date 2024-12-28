'use client';

import Api from '@/api';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { DetailShowType, DetailShowTypeEnum } from '@/types/CommonType';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Empty, message, Modal, Tabs } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
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
}

const TaskDetail = ({
  task = { taskId: 0, templateId: 0, taskName: '', maxFillCount: 0 },
  showType = DetailShowTypeEnum.Check,
  staffId,
  customTitle,
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
              />
            ),
            key: `newTab${index}`,
          });
        });
        setItems(newPanes);
        setActiveKey(newPanes[0].key);
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
          console.log('params', params);

          const newActiveKey = `newTab${newTabIndex.current++}`;
          const newPanes = [...items];
          newPanes.push({
            label: `NO ${newTabIndex.current}`,
            singleFillId: data.data.singleFillId,
            children: (
              <FillCollect singleFillId={data.data.singleFillId} task={task} />
            ),
            key: newActiveKey,
          });
          setItems(newPanes);
          setActiveKey(newActiveKey);
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
      onSuccess: (data, params) => {
        if (data.result === 0) {
          let newActiveKey = activeKey;
          let lastIndex = -1;
          items.forEach((item: any, i: number) => {
            if (item.key === params[1]) {
              lastIndex = i - 1;
            }
          });
          const newPanes = items.filter((item: any) => item.key !== params[1]);
          if (newPanes.length && newActiveKey === params[1]) {
            if (lastIndex >= 0) {
              newActiveKey = newPanes[lastIndex].key;
            } else {
              newActiveKey = newPanes[0].key;
            }
          }
          setItems(newPanes);
          setActiveKey(newActiveKey);
        }
      },
    }
  );

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = () => {
    if (showType === DetailShowTypeEnum.Fill && items.length > maxFillCount) {
      return;
    }
    createSingleFill();
  };

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
        className=" text-blue-500"
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
        <div className="py-10 min-h-96 h-[80vh] shadow-lg">
          {items.length !== 0 ? (
            <Tabs
              rootClassName="fill-detail-tabs"
              tabPosition={'left'}
              type="editable-card"
              onChange={onChange}
              activeKey={activeKey}
              onEdit={onEdit}
              addIcon={
                createSingleFillLoading ? <LoadingOutlined /> : <PlusOutlined />
              }
              hideAdd={
                items.length >= maxFillCount ||
                showType === DetailShowTypeEnum.Check
              }
              items={items}
            />
          ) : (
            <div className="flex justify-center items-center h-[40vh]">
              <Empty />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default TaskDetail;
