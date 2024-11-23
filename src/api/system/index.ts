import createSystem from './createSystem';
import deleteSystem from './deleteSystem';
import getSystemListAll from './getSystemListAll';
import listVisibleLevels from './listVisibleLevels';
import updateSystem from './updateSystem';

const systemApi = {
  createSystem,
  getSystemListAll,
  listVisibleLevels,
  deleteSystem,
  updateSystem,
};

export default systemApi;
