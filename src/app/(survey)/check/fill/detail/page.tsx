'use client';

import Api from '@/api';
import Breadcrumbs from '@/components/common/breadcrumbs';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useLocalStorageState, useRequest } from 'ahooks';
import { Tabs } from 'antd';
import React, { useRef, useState } from 'react';
import { useSurveyCurrentRoleStore } from '../../../../../contexts/useSurveyRoleStore';
import FillCollect from '../modules/fill-collect';
import RejectTimeline from '../modules/reject-timeline';
import './style.css';
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;
const Page = () => {
  const [activeKey, setActiveKey] = useState('0');
  const [items, setItems] = useState<any>([]);
  const [rejectData, setRejectData] = useState<any>([]);
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const currentRole = useSurveyCurrentRoleStore(state => state.currentRole);
  const newTabIndex = useRef(0);
  const [currentFillTask] = useLocalStorageState<any>('current-fill-task', {
    defaultValue: {},
  });

  /**
   * 获取填表列表
   */
  const { run: getListSingleFill } = useRequest(
    () => {
      if (
        !currentSystem?.systemId ||
        !currentOrg?.orgId ||
        !currentFillTask?.taskId
      ) {
        return Promise.reject(
          'currentSystem or currentOrg or currentFillTask is not exist'
        );
      }
      return Api.listSingleFill({
        currentSystemId: currentSystem.systemId,
        currentOrgId: currentOrg!.orgId!,
        taskId: currentFillTask?.taskId,
      });
    },
    {
      manual: true,
      onSuccess: data => {
        const newPanes = [...items];
        data.data.forEach((item: any) => {
          const index = newTabIndex.current++;
          newPanes.push({
            label: `NO ${item.fillIndex}`,
            children: <FillCollect singleFillId={item.singleFillId} />,
            key: `newTab${index}`,
          });
        });
        setItems(newPanes);
        setActiveKey(newPanes[0].key);
      },
    }
  );

  /**
   * 获取驳回列表
   */
  useRequest(
    () => {
      if (
        !currentSystem?.systemId ||
        !currentOrg?.orgId ||
        !currentFillTask?.taskId ||
        !currentRole?.id
      ) {
        return Promise.reject(
          'currentSystem or currentOrg or currentFillTask is not exist'
        );
      }
      return Api.listRejectFill({
        currentSystemId: currentSystem.systemId,
        currentOrgId: currentOrg!.orgId!,
        taskId: currentFillTask?.taskId,
        staffId: currentRole.id as number,
      });
    },
    {
      refreshDeps: [
        currentSystem?.systemId,
        currentOrg?.orgId,
        currentFillTask?.taskId,
        currentRole?.id,
      ],
      onSuccess: data => {
        console.log('data', data.data);
        if (data?.data?.length !== 0) {
          const newPanes = [
            {
              label: '驳回履历',
              children: <RejectTimeline items={data.data} />,
              key: '0',
              closable: false,
            },
          ];
          setItems(newPanes);
          setRejectData(data.data);
        }
        getListSingleFill();
      },
    }
  );

  /**
   * 创建填报文件
   */
  const { run: createSingleFill, loading: createSingleFillLoading } =
    useRequest(
      () => {
        if (
          !currentSystem?.systemId ||
          !currentOrg?.orgId ||
          !currentFillTask?.taskId
        ) {
          return Promise.reject(
            'currentSystem or currentOrg or currentFillTask is not exist'
          );
        }
        return Api.createSingleFill({
          currentSystemId: currentSystem.systemId,
          currentOrgId: currentOrg!.orgId!,
          taskId: currentFillTask?.taskId,
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
            children: <FillCollect singleFillId={data.data.singleFillId} />,
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
    (singleFillId: number) => {
      if (
        !currentSystem?.systemId ||
        !currentOrg?.orgId ||
        !currentFillTask?.taskId
      ) {
        return Promise.reject(
          'currentSystem or currentOrg or currentFillTask is not exist'
        );
      }
      return Api.deleteSingleFill({
        currentSystemId: currentSystem.systemId,
        currentOrgId: currentOrg!.orgId!,
        taskId: currentFillTask?.taskId,
        singleFillId: singleFillId,
      });
    },
    {
      manual: true,
      onSuccess: (data, params) => {
        if (data.result !== 0) {
          let newActiveKey = activeKey;
          let lastIndex = -1;
          items.forEach((item: any, i: number) => {
            if (item.key === params[0]) {
              lastIndex = i - 1;
            }
          });
          const newPanes = items.filter((item: any) => item.key !== params[0]);
          if (newPanes.length && Number(newActiveKey) === params[0]) {
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
    if (items.length > currentFillTask?.maxFillCount) {
      console.log('超过最大填报数');
      return;
    }
    createSingleFill();
  };

  // const remove = (targetKey: TargetKey) => {
  //   let newActiveKey = activeKey;
  //   let lastIndex = -1;
  //   items.forEach((item: any, i: number) => {
  //     if (item.key === targetKey) {
  //       lastIndex = i - 1;
  //     }
  //   });
  //   const newPanes = items.filter((item: any) => item.key !== targetKey);
  //   if (newPanes.length && newActiveKey === targetKey) {
  //     if (lastIndex >= 0) {
  //       newActiveKey = newPanes[lastIndex].key;
  //     } else {
  //       newActiveKey = newPanes[0].key;
  //     }
  //   }
  //   setItems(newPanes);
  //   setActiveKey(newActiveKey);
  // };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove'
  ) => {
    if (action === 'add') {
      add();
    } else {
      // remove(targetKey);
      deleteSingleFill(Number(targetKey));
    }
  };

  return (
    <>
      <Breadcrumbs
        className="mb-2"
        breadcrumbs={[
          { label: '资料收集', href: '/check/fill' },
          {
            label: '资料填报',
            href: `/check/fill/detail?taskId=${currentFillTask?.taskId}`,
            active: true,
          },
        ]}
      />
      <div className="py-10 min-h-96 h-[80vh] shadow-lg">
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
            items.length >=
            currentFillTask?.maxFillCount + (rejectData.length > 0 ? 1 : 0)
          }
          items={items}
        />
      </div>
    </>
  );
};

export default Page;
