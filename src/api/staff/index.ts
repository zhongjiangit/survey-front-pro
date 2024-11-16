import createStaff from './create';
import deleteStaff from './delete';
import getStaffList from './getStaffList';
import getStaffListByTags from './listByTags';
import updateStaff from './update';

const staffApi = {
  createStaff,
  deleteStaff,
  updateStaff,
  getStaffList,
  getStaffListByTags,
};

export default staffApi;
