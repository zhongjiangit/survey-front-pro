'use client';
import Api from '@/api';
import { StaffListResponse } from '@/api/staff/getStaffList';
import MemberManage from '@/app/modules/member-manage';
import { CustomTreeDataNode } from '@/components/common/custom-tree';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { StaffTypeEnum, TagTypeEnum } from '@/types/CommonType';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Divider, Form, message, Tag, TreeSelect } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import OrgTree from './modules/org-tree';

function Page() {
  const [org, setOrg] = useState<React.Key>();
  const [canEdit, setCanEdit] = useState<boolean>(true);
  const [editStatus, setEditStatus] = useState(false);
  const [memberTags, setMemberTags] = useState<any>([]);
  const [staffOrg, setStaffOrg] = useState<any>();
  const [orgList, setOrgList] = useState<CustomTreeDataNode[]>([]);
  const [adminStaff, setAdminStaff] = useState<StaffListResponse>();
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useRequest(
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
          if (orgNode) {
            setStaffOrg(orgNode);
          }
        }
      },
    }
  );

  const setCurrentOrg = useCallback(
    (key: React.Key) => {
      setOrg(key);
      setEditStatus(false);
    },
    [setOrg]
  );

  useEffect(() => {
    if (org && currentOrg?.orgId) {
      setCanEdit(Number(org) == currentOrg?.orgId);
    }
  }, [setCanEdit, org, currentOrg?.orgId]);

  useEffect(() => {
    if (currentOrg?.orgId) {
      setCurrentOrg(currentOrg.orgId);
    }
  }, [currentOrg?.orgId]);

  useRequest(
    () => {
      if (!currentSystem?.systemId) {
        return Promise.reject('currentSystem is not exist');
      }
      return Api.getTagList({
        currentSystemId: currentSystem.systemId,
        tagType: TagTypeEnum.Member,
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
            // @ts-expect-error: CustomTreeDataNode does not have a 'value' property
            node.value = node.key;
          };
          addValue(tags);
          setMemberTags([tags]);
        }
      },
    }
  );

  const { run: updateStaff } = useRequest(
    params => {
      return Api.updateStaff(params);
    },
    {
      manual: true,
      onSuccess(response) {
        if (response.result === 0) {
          messageApi.open({
            type: 'success',
            content: '更新成功',
          });
          setEditStatus(false);
          refreshStaffList();
        } else {
          messageApi.open({
            type: 'error',
            content: response.message,
          });
        }
      },
    }
  );

  const onAdminUpdate = useCallback(
    (values: any) => {
      // 转成 tags = [key: number, key: number]
      const tags = values.tags?.map((tag: number) => ({ key: tag }));
      //找到当前的管理员
      const admin = adminStaff;
      const newAdmin = {
        currentSystemId: currentSystem?.systemId,
        currentOrgId: currentOrg?.orgId,
        ...admin,
        tags,
      };
      updateStaff(newAdmin);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [adminStaff]
  );

  const { refresh: refreshStaffList } = useRequest(
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
            staff => staff.staffType === StaffTypeEnum.UnitAdmin
          );
          if (adminStaff[0]) {
            setAdminStaff(adminStaff[0]);
            form.setFieldsValue({
              tags: adminStaff[0].tags?.map((tag: any) => tag.key),
            });
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
      {contextHolder}
      <div className="flex w-full items-center justify-start gap-2">
        <h1 className={`text-2xl`}>单位成员管理</h1>
      </div>
      <h2 className="flex items-center">
        <span className="text-red-600">*</span>&nbsp;你是
        <span className="font-bold">{staffOrg?.title}</span>
        的单位管理员，你可以维护该单位成员。其他单位的成员只可查看。
      </h2>
      <div className="flex gap-3">
        <div className="w-60 rounded-lg border py-3">
          <OrgTree
            dataSource={orgList}
            setOrg={setCurrentOrg}
            selectedOrg={org}
          />
        </div>
        <div className="flex-1">
          <div className="flex gap-6 items-center">
            <div> 单位管理员：{adminStaff?.staffName}</div>
            <div> 电话：{adminStaff?.cellphone}</div>
            <div className="flex gap-2 items-center">
              标签：
              {canEdit ? (
                editStatus ? (
                  <Form
                    form={form}
                    name="control-hooks"
                    className="flex items-center"
                    onFinish={onAdminUpdate}
                  >
                    <div className="flex gap-2 h-8">
                      <Form.Item name="tags">
                        <TreeSelect
                          style={{ width: '200px' }}
                          showSearch
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                          placeholder="请选择标签"
                          allowClear
                          multiple
                          treeDefaultExpandAll
                          treeData={memberTags}
                          treeCheckable={true}
                          showCheckedStrategy={'SHOW_PARENT'}
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="link"
                          htmlType="submit"
                          icon={<SaveOutlined className="cursor-pointer" />}
                        ></Button>
                      </Form.Item>
                    </div>
                  </Form>
                ) : (
                  <div className="flex justify-start items-center gap-3">
                    <div className="flex justify-start items-center gap-1">
                      {adminStaff?.tags?.map((item: any) => {
                        return (
                          <Tag key={item.key} color="success">
                            {item.title}
                          </Tag>
                        );
                      })}
                    </div>
                    <EditOutlined
                      onClick={() => {
                        setEditStatus(true);
                      }}
                    />
                  </div>
                )
              ) : (
                <div className="flex justify-start items-center gap-1">
                  {adminStaff?.tags?.map((item: any) => {
                    return (
                      <Tag key={item.key} color="success">
                        {item.title}
                      </Tag>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <Divider />
          <MemberManage memberTags={memberTags} orgId={org} canEdit={canEdit} />
        </div>
      </div>
    </main>
  );
}

export default Page;
