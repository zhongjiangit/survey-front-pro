import login from './login';
import orgApi from './org';
import staffApi from './staff';
import systemApi from './system';
import tagApi from './tag';
import templateApi from './template';
import expertApi from './expert';
import CookieApi from './cookie';

const api = {
  ...login,
  ...templateApi,
  ...orgApi,
  ...staffApi,
  ...systemApi,
  ...tagApi,
  ...expertApi,
  ...CookieApi,
};

export default api;
