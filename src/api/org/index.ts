import getOrgDetails from './get-details';
import getOrgList from './get-list';
import listAllAssignSub from './listAllAssignSub';
import listLevelAssignSub from './listLevelAssignSub';
import saveOrgTree from './save-org-tree';
import setOrgDetail from './set-detail';

const orgApi = {
  getOrgDetails,
  getOrgList,
  setOrgDetail,
  saveOrgTree,
  listLevelAssignSub,
  listAllAssignSub,
};

export default orgApi;
