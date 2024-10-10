'use client';
import MemberManage from '@/components/common/member-manage';
import { lusitana } from '@/components/display/fonts';
import { Divider, TreeSelect } from 'antd';
import { useState } from 'react';
import OrgTree from './modules/org-tree';

function Page() {
  const [org, setOrg] = useState<React.Key>();
  return (
    <main className="flex flex-col gap-5">
      <div className="flex w-full items-center justify-start gap-2">
        <h1 className={`${lusitana.className} text-2xl`}>单位成员管理</h1>
      </div>
      <h2 className="flex items-center">
        * 你是<span className="font-bold">成都市</span>
        的单位管理员，你可以维护该单位人员。其他单位的人员只可查看
      </h2>
      <div className="flex gap-3">
        <div className="w-60 rounded-lg border">
          <OrgTree setOrg={setOrg} />
        </div>
        <div className="flex-1">
          <div className="flex gap-6 items-center">
            <div> 单位管理员：***</div>
            <div> 电话：13981418834</div>
            <div>
              标签：
              <TreeSelect
                style={{ width: '200px' }}
                showSearch
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择标签"
                allowClear
                multiple
                treeDefaultExpandAll
                treeData={[]}
              />
            </div>
          </div>
          <Divider />
          <MemberManage />
        </div>
      </div>
    </main>
  );
}

export default Page;
