import { CommonResponseType } from '@/interfaces/ResponseType';
import { SurveyService } from '@/service';

interface TagCreateParamsType {
  currentSystemId: number;
  orgs: TagsType;
}

type TagsType = {
  key?: number;
  title: string;
  children: TagsType[];
};
interface TagCreateResponse {
  orgs: TagsType;
}

function saveOrgTree(params: TagCreateParamsType) {
  return SurveyService.post<CommonResponseType<TagCreateResponse>>(
    '/api/org/save',
    {
      ...params,
    }
  );
}

export default saveOrgTree;