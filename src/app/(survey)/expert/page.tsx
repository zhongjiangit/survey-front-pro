'use client';

import Api from '@/api';
import { StaffListResponse } from '@/api/staff/get-staff-list';
import ExpertManage from '@/app/modules/expert-manage';
import { CustomTreeDataNode } from '@/components/common/custom-tree';
import { lusitana } from '@/components/display/fonts';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { TagTypeEnum } from '@/types/CommonType';
import { useRequest } from 'ahooks';
import { useCallback, useEffect, useState } from 'react';
import OrgTree from './modules/org-tree';

function Page() {
  const [org, setOrg] = useState<React.Key>();
  const [canEdit, setCanEdit] = useState<boolean>(true);
  const [expertTags, setExpertTags] = useState<any>([]);
  const [staffOrg, setStaffOrg] = useState<any>();
  const [orgList, setOrgList] = useState<CustomTreeDataNode[]>([]);
  const [adminStaff, setAdminStaff] = useState<StaffListResponse>();
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);

  // 获取当前管理员单位及以下的所有单位
  const {} = useRequest(
    () => {
      return Api.getOrgList({
        currentSystemId: currentSystem?.systemId,
        currentOrgId: currentOrg?.orgId,
      });
    },
    {
      refreshDeps: [currentSystem?.systemId, currentOrg?.orgId],
      onSuccess(response) {
        const treeData = response?.data?.orgs;
        if (treeData && currentOrg?.orgId) {
          setOrgList([treeData]);
          const orgNode = findOrg([treeData], currentOrg.orgId);
          orgNode && setStaffOrg(orgNode);
        }
      },
    }
  );

  useEffect(() => {
    if (org && currentOrg?.orgId) {
      setCanEdit(Number(org) == currentOrg?.orgId);
    }
  }, [setCanEdit, org, currentOrg?.orgId]);

  useEffect(() => {
    if (currentOrg?.orgId) {
      setOrg(currentOrg.orgId);
    }
  }, [currentOrg?.orgId]);

  // 获取专家标签
  const {} = useRequest(
    () => {
      return Api.getTagList({
        // TODO
        // currentSystemId: 5,
        currentSystemId: currentSystem?.systemId,
        tagType: TagTypeEnum.Expert,
      });
    },
    {
      onSuccess(response) {
        // 递归将response.data.tags中的key改为value
        const tags = response?.data?.tags;
        if (tags) {
          const addValue = (node: CustomTreeDataNode) => {
            if (node.children) {
              node.children.forEach(addValue);
            }
            // @ts-ignore
            node.value = node.key;
          };
          addValue(tags);
          setExpertTags([tags]);
        }
      },
    }
  );

  // 获取当前单位的所有成员
  const {} = useRequest(
    () => {
      return Api.getStaffList({
        currentSystemId: currentSystem?.systemId,
        currentOrgId: Number(org),
      });
    },
    {
      refreshDeps: [org, currentSystem?.systemId],
      onSuccess(response) {
        const list = response?.data;
        if (list) {
          const adminStaff = list.filter(
            staff => staff.id === currentOrg?.staffId
          );
          if (!!adminStaff[0]) {
            setAdminStaff(adminStaff[0]);
          }
        }
      },
    }
  );

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

  return (
    <main className="flex flex-col gap-5">
      <div className="flex w-full items-center justify-start gap-2">
        <h1 className={`${lusitana.className} text-2xl`}>单位成员管理</h1>
      </div>
      <h2 className="flex items-center">
        <span className="text-red-600">*</span>&nbsp;你是
        <span className="font-bold">{staffOrg?.title}</span>
        的管理员，你可以维护该单位专家信息。其他单位的成员只可查看。
      </h2>
      <div className="flex gap-3">
        <div className="w-60 rounded-lg border py-3">
          <OrgTree dataSource={orgList} setOrg={setOrg} selectedOrg={org} />
        </div>
        <div className="flex-1">
          <ExpertManage expertTags={expertTags} orgId={org} canEdit={canEdit} />
        </div>
      </div>
    </main>
  );
}

export default Page;
