import createStaff from './create';
import deleteStaff from './delete';
import getStaffList from './get-staff-list';
import updateStaff from './update';

const staffApi = {
  createStaff,
  deleteStaff,
  updateStaff,
  getStaffList,
};

export default staffApi;
