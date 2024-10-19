import login from './login';
import orgApi from './org';
import staffApi from './staff';
import systemApi from './system';
import tagApi from './tag';
import templateApi from './template';

const api = {
  ...login,
  ...templateApi,
  ...orgApi,
  ...staffApi,
  ...systemApi,
  ...tagApi,
};

export default api;
