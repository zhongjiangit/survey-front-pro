import getCaptcha, { getCaptchaUrl } from './getCaptcha';
import getConfig from './getConfig';
import sendSms from './sendSms';
import verifyCaptcha from './verifyCaptcha';

const commonApi = {
  getCaptcha,
  sendSms,
  getConfig,
  getCaptchaUrl,
  verifyCaptcha,
};

export default commonApi;
