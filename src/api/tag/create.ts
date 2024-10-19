import { TagTypeType } from '@/interfaces/CommonType';
import { CommonResponseType } from '@/interfaces/ResponseType';
import { SurveyService } from '@/service';

type TagsType = {
  key?: number;
  title: string;
  children: TagsType[];
};

interface TagCreateParamsType {
  currentSystemId: number;
  tagType: TagTypeType;
  tags: TagsType;
}

interface TagCreateResponse {
  tags: TagsType;
}

/**
 * useTagCreateMutation
 * @param params
 * @returns
 */
function createTag(params: TagCreateParamsType) {
  return SurveyService.post<CommonResponseType<TagCreateResponse>>(
    'api/tag/save',
    {
      ...params,
    }
  );
}

export default createTag;
