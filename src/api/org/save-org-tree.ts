import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

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
    `${baseUrl}/org/save`,
    {
      ...params,
    }
  );
}

export default saveOrgTree;
