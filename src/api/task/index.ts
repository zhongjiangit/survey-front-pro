import approveFill from './approveFill';
import approveReview from './approveReview';
import createCollectionTask from './createCollectionTask';
import createInspTask from './createInspTask';
import createSingleFill from './createSingleFill';
import deleteCollectionTask from './deleteCollectionTask';
import deleteReviewTask from './deleteReviewTask';
import deleteSingleFill from './deleteSingleFill';
import editCollectionTask from './editCollectionTask';
import editInspTask from './editInspTask';
import expertSubmit from './expertSubmit';
import fillerSubmit from './fillerSubmit';
import getCollectionTask from './getCollectionTask';
import getFillProcessDetails from './getFillProcessDetails';
import getInspTaskFill from './getInspTaskFill';
import getInspTaskReview from './getInspTaskReview';
import getSingleFillDetails from './getSingleFillDetails';
import listAssignCollectionTask from './listAssignCollectionTask';
import listAssignInspTask from './listAssignInspTask';
import listFillCollectionTask from './listFillCollectionTask';
import listFillInspTask from './listFillInspTask';
import listFillsByTaskPage from './listFillsByTaskPage';
import listMyCollectionTask from './listMyCollectionTask';
import listMyInspTask from './listMyInspTask';
import listNeedReviewExpertDetails from './listNeedReviewExpertDetails';
import listReviewTaskPublisher from './listReviewAssignByExpert';
import listReviewAssignByFill from './listReviewAssignByFill';
import listReviewDetailsExpert from './listReviewDetailsExpert';
import listReviewDetailsManager from './listReviewDetailsManager';
import listReviewTaskExpert from './listReviewTaskExpert';
import listSingleFill from './listSingleFill';
import listSubCollectionTask from './listSubCollectionTask';
import listSubInspTask from './listSubInspTask';
import reviewAssignAdd from './reviewAssignAdd';
import reviewAssignDelete from './reviewAssignDelete';
import saveReviewDetails from './saveReviewDetails';
import saveSingleFillDetails from './saveSingleFillDetails';
import setCollectionFillComplete from './setCollectionFillComplete';
import setInspFillComplete from './setInspFillComplete';
import setReviewReviewComplete from './setReviewReviewComplete';
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
  listSingleFill,
  listReviewDetailsManager,
  listNeedReviewExpertDetails,
  getSingleFillDetails,
  listReviewDetailsExpert,
  listReviewAssignByFill,
  listFillsByTaskPage,
  reviewAssignAdd,
  setCollectionFillComplete,
  setInspFillComplete,
  setReviewReviewComplete,
  approveFill,
  approveReview,
  deleteSingleFill,
  createSingleFill,
  saveSingleFillDetails,
  saveReviewDetails,
  fillerSubmit,
  expertSubmit,
  reviewAssignDelete,
  getFillProcessDetails,
};

export default taskApi;
