import { CustomTreeDataNode } from '@/components/common/custom-tree';
import { TagTypeType } from '@/interfaces/CommonType';
import { CommonResponseType } from '@/interfaces/ResponseType';
import { SurveyService } from '@/service';
import { baseUrl } from '../config';

export interface TagListType {
  tags: CustomTreeDataNode;
}

function getTagList(params: {
  currentSystemId?: number;
  tagType?: TagTypeType;
}) {
  return SurveyService.post<CommonResponseType<TagListType>>(
    `${baseUrl}/tag/list`,
    {
      ...params,
    }
  );
}

export default getTagList;
