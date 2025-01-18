import { CustomTreeDataNode } from '@/components/common/custom-tree';
import { SurveyService } from '@/service';
import { TagTypeType } from '@/types/CommonType';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

export interface TagListType {
  tags: CustomTreeDataNode;
}

function getTagList(params: {
  currentSystemId: number;
  tagType: TagTypeType;
  showUntagged?: 0 | 1;
}) {
  return SurveyService.post<CommonResponseType<CustomTreeDataNode[]>>(
    `${baseUrl}/tag/list`,
    {
      ...params,
    }
  );
}

export default getTagList;
