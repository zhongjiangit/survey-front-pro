import createCollectionTask from './createCollectionTask';
import createInspTask from './createInspTask';
import deleteCollectionTask from './deleteCollectionTask';
import deleteReviewTask from './deleteReviewTask';
import editCollectionTask from './editCollectionTask';
import editReviewTask from './editReviewTask';
import getCollectionTask from './getCollectionTask';
import getReviewTaskFill from './getReviewTaskFill';
import getReviewTaskReview from './getReviewTaskReview';
import listAssignCollectionTask from './listAssignCollectionTask';
import listFillCollectionTask from './listFillCollectionTask';
import listMyCollectionTask from './listMyCollectionTask';
import listMyInspTask from './listMyInspTask';
import listReviewTaskExpert from './listReviewTaskExpert';
import listReviewTaskPublisher from './listReviewTaskPublisher';
import listSubCollectionTask from './listSubCollectionTask';
import updateCollectionTask from './updateCollectionTask';
import updateReviewTaskFill from './updateReviewTaskFill';
import updateReviewTaskReview from './updateReviewTaskReview';

const taskApi = {
  createCollectionTask,
  deleteCollectionTask,
  getCollectionTask,
  updateCollectionTask,
  createInspTask,
  deleteReviewTask,
  editReviewTask,
  editCollectionTask,
  getReviewTaskReview,
  getReviewTaskFill,
  listAssignCollectionTask,
  listFillCollectionTask,
  listMyCollectionTask,
  listReviewTaskExpert,
  listReviewTaskPublisher,
  listMyInspTask,
  listSubCollectionTask,
  updateReviewTaskFill,
  updateReviewTaskReview,
};

export default taskApi;
