import createExpert from './create';
import deleteExpert from './delete';
import getExpertList from './get-expert-list';
import updateExpert from './update';

const expertApi = {
  createExpert,
  deleteExpert,
  updateExpert,
  getExpertList,
};

export default expertApi;
