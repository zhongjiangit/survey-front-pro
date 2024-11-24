import createExpert from './create';
import deleteExpert from './delete';
import getExpertList from './getExpertList';
import getExpertListByTags from './listByTags';
import updateExpert from './update';

const expertApi = {
  createExpert,
  deleteExpert,
  updateExpert,
  getExpertList,
  getExpertListByTags,
};

export default expertApi;
