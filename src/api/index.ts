import CookieApi from './cookie';
import expertApi from './expert';
import login from './login';
import orgApi from './org';
import staffApi from './staff';
import systemApi from './system';
import tagApi from './tag';
import taskApi from './task';
import templateApi from './template';

const Api = {
  ...login,
  ...templateApi,
  ...orgApi,
  ...staffApi,
  ...systemApi,
  ...tagApi,
  ...expertApi,
  ...CookieApi,
  ...taskApi,
};

export default Api;
