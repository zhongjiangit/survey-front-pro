import { TagTypeType } from '@/interfaces/CommonType';
import { CommonResponseType } from '@/interfaces/ResponseType';
import { SurveyService } from '@/service';
import { baseUrl } from '../config';

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
 * createTag
 * @param params
 * @returns
 */
function createTag(params: TagCreateParamsType) {
  return SurveyService.post<CommonResponseType<TagCreateResponse>>(
    `${baseUrl}/tag/save`,
    {
      ...params,
    }
  );
}

export default createTag;
