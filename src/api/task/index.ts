import createCollectionTask from './createCollectionTask';
import createInspTask from './createInspTask';
import deleteCollectionTask from './deleteCollectionTask';
import deleteReviewTask from './deleteReviewTask';
import editCollectionTask from './editCollectionTask';
import editInspTask from './editInspTask';
import getCollectionTask from './getCollectionTask';
import getInspTaskFill from './getInspTaskFill';
import getInspTaskReview from './getInspTaskReview';
import listAssignCollectionTask from './listAssignCollectionTask';
import listAssignInspTask from './listAssignInspTask';
import listFillCollectionTask from './listFillCollectionTask';
import listFillInspTask from './listFillInspTask';
import listMyCollectionTask from './listMyCollectionTask';
import listMyInspTask from './listMyInspTask';
import listReviewTaskPublisher from './listReviewAssignByExpert';
import listReviewTaskExpert from './listReviewTaskExpert';
import listSubCollectionTask from './listSubCollectionTask';
import listSubInspTask from './listSubInspTask';
import updateCollectionTask from './updateCollectionTask';
import updateInspTaskFill from './updateInspTaskFill';
import updateInspTaskReview from './updateInspTaskReview';

const taskApi = {
  createCollectionTask,
  deleteCollectionTask,
  getCollectionTask,
  updateCollectionTask,
  createInspTask,
  deleteReviewTask,
  editInspTask,
  editCollectionTask,
  getInspTaskReview,
  getInspTaskFill,
  listAssignCollectionTask,
  listFillCollectionTask,
  listMyCollectionTask,
  listReviewTaskExpert,
  listReviewTaskPublisher,
  listMyInspTask,
  listSubCollectionTask,
  updateInspTaskFill,
  updateInspTaskReview,
  listSubInspTask,
  listAssignInspTask,
  listFillInspTask,
};

export default taskApi;
