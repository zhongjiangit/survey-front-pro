import createCollectDetails from './create-details';
import createTemplateOutline from './create-outline';
import getTemplateDetails from './get-details';
import getAllWidgetsList from './list-all-widgets';
import getTemplateOutlineList from './list-outline';
import deleteTemplate from './template-delete';
import updateTemplateTitle from './update-title';

const templateApi = {
  createTemplateOutline,
  getTemplateOutlineList,
  updateTemplateTitle,
  getTemplateDetails,
  getAllWidgetsList,
  createCollectDetails,
  deleteTemplate,
};

export default templateApi;
