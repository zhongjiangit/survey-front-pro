'use client';

import CustomTree from '@/components/common/custom-tree';
import { Button, Modal } from 'antd';
import { Divide } from 'lucide-react';
import { useEffect, useState } from 'react';

interface OrgTreeProps {
  setOrg: (org: React.Key) => void;
}

function OrgTree({ setOrg }: OrgTreeProps) {
  const [open, setOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<React.Key[]>([]);
  useEffect(() => {
    if (selectedOrg.length > 0) {
      setOrg(selectedOrg[0]);
    }
  }, [selectedOrg, setOrg]);

  return (
    <>
      <Button size="small" type="primary" onClick={() => setOpen(true)}>
        选择单位
      </Button>
      {/* 创建一个modal弹窗，外部Button控制显隐 */}
      <Modal
        title="选择单位"
        open={open}
        onOk={() => {
          setOpen(false);
        }}
        onCancel={() => {
          setOpen(false);
        }}
        width={600}
        destroyOnClose
        footer={
          <div>
            <Button type="primary" onClick={() => setOpen(false)}>
              确定
            </Button>
          </div>
        }
      >
        {/* 自定义树形组件 */}
        <CustomTree dataSource={[]} setDataSelected={setSelectedOrg} />
      </Modal>
    </>
  );
}

export default OrgTree;
