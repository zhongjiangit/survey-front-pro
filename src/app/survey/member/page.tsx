'use client';
import { CustomTreeDataNode } from '@/components/common/custom-tree';
import MemberManage from '@/components/common/member-manage';
import { lusitana } from '@/components/display/fonts';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import useOrgListSWR from '@/data/org/useOrgListSWR';
import useStaffListSWR, {
  StaffListResponse,
} from '@/data/staff/useStaffListSWR';
import { StaffTypeEnum } from '@/interfaces/CommonType';
import { Divider, TreeSelect } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import OrgTree from './modules/org-tree';

function Page() {
  const [org, setOrg] = useState<React.Key>();
  const [staffOrg, setStaffOrg] = useState<any>();
  const [orgList, setOrgList] = useState<CustomTreeDataNode[]>([]);
  const [adminStaff, setAdminStaff] = useState<StaffListResponse>();
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const { data: orgsData, mutate: muteOrgs } = useOrgListSWR({
    currentSystemId: currentSystem?.systemId,
  });

  const {
    data: staffList,
    isLoading,
    mutate: listMutate,
  } = useStaffListSWR({
    currentSystemId: currentSystem?.systemId,
    currentOrgId: currentOrg?.orgId,
  });

  console.log('orgsData', orgsData);
  // 递归遍历treeData,找到其中key与currentOrg中的orgId相同的对象
  const findOrg = useCallback(
    (
      treeData: CustomTreeDataNode[],
      orgId: number
    ): CustomTreeDataNode | null => {
      for (let i = 0; i < treeData.length; i++) {
        const node = treeData[i];
        if (node.key === orgId) {
          return node;
        }
        if (node.children) {
          const result = findOrg(node.children, orgId);
          if (result) {
            return result;
          }
        }
      }
      return null;
    },
    []
  );
  useEffect(() => {
    const treeData = orgsData?.data?.data?.orgs;
    if (treeData && currentOrg?.orgId) {
      setOrgList([treeData]);
      const orgNode = findOrg([treeData], currentOrg.orgId);
      orgNode && setStaffOrg(orgNode);
    }
  }, [currentOrg?.orgId, findOrg, orgsData?.data?.data?.orgs]);

  useEffect(() => {
    const list = staffList?.data?.data;
    if (list) {
      const adminStaff = list.filter(
        staff => staff.staffType === StaffTypeEnum.UnitAdmin
      );
      setAdminStaff(adminStaff[0]);
    }
  }, [staffList]);

  return (
    <main className="flex flex-col gap-5">
      <div className="flex w-full items-center justify-start gap-2">
        <h1 className={`${lusitana.className} text-2xl`}>单位成员管理</h1>
      </div>
      <h2 className="flex items-center">
        <span className="text-red-600">*</span>&nbsp;你是
        <span className="font-bold">{staffOrg?.title}</span>
        的单位管理员，你可以维护该单位人员。其他单位的人员只可查看
      </h2>
      <div className="flex gap-3">
        <div className="w-60 rounded-lg border">
          <OrgTree dataSource={orgList} setOrg={setOrg} />
        </div>
        <div className="flex-1">
          <div className="flex gap-6 items-center">
            <div> 单位管理员：{adminStaff?.staffName}</div>
            <div> 电话：{adminStaff?.cellphone}</div>
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
