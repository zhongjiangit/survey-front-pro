import { CustomTreeDataNode } from '@/components/common/custom-tree';
import { TagTypeType } from '@/interfaces/CommonType';
import { CommonResponseType } from '@/interfaces/ResponseType';
import { SurveyService } from '@/service';

export interface TagListType {
  tags: CustomTreeDataNode;
}

function getTagList(params: {
  currentSystemId?: number;
  tagType?: TagTypeType;
}) {
  return SurveyService.post<CommonResponseType<TagListType>>('/api/org/save', {
    ...params,
  });
}

export default getTagList;
