import commonApi from './common';
import expertApi from './expert';
import login from './login';
import orgApi from './org';
import staffApi from './staff';
import systemApi from './system';
import tagApi from './tag';
import taskApi from './task';
import templateApi from './template';

const Api = {
  ...commonApi,
  ...login,
  ...templateApi,
  ...orgApi,
  ...staffApi,
  ...systemApi,
  ...tagApi,
  ...expertApi,
  ...taskApi,
};

export default Api;
