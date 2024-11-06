'use client';

import Breadcrumbs from '@/components/common/breadcrumbs';
import { Tabs } from 'antd';
import React, { useRef, useState } from 'react';
import FillCollect from '../modules/fill-collect';
import RejectTimeline from '../modules/reject-timeline';
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const initialItems = [
  {
    label: '驳回履历',
    children: <RejectTimeline />,
    key: '0',
    closable: false,
  },
  { label: 'NO 1', children: <FillCollect />, key: '1', closable: false },
  { label: 'NO 2', children: <FillCollect />, key: '2' },
  {
    label: 'NO 3',
    children: <FillCollect />,
    key: '3',
  },
];

const Page = () => {
  const [activeKey, setActiveKey] = useState(initialItems[0].key);
  const [items, setItems] = useState(initialItems);
  const newTabIndex = useRef(3);

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    const newPanes = [...items];
    newPanes.push({
      label: `NO ${newTabIndex.current}`,
      children: <FillCollect />,
      key: newActiveKey,
    });
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter(item => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove'
  ) => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <>
      <Breadcrumbs
        className="mb-2"
        breadcrumbs={[
          { label: '资料收集', href: '/collect/fill' },
          {
            label: '资料填报',
            href: '/collect/fill/detail',
            active: true,
          },
        ]}
      />
      <div className="py-10 min-h-96 h-[80vh] shadow-lg">
        <Tabs
          tabPosition={'left'}
          type="editable-card"
          onChange={onChange}
          activeKey={activeKey}
          onEdit={onEdit}
          items={items}
        />
      </div>
    </>
  );
};

export default Page;
