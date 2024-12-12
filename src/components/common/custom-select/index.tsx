'use client';

import { WidgetTypeEnum } from '@/types/CommonType';
import { CaretRightOutlined, FormOutlined } from '@ant-design/icons';
import { Collapse, Tag, Tooltip } from 'antd';
import {
  CloudUpload,
  Disc,
  FolderTree,
  SquareCheck,
  Text,
  TextCursorInput,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

interface CustomSelectValue {
  componentId?: number;
}

interface CustomSelectProps {
  source?: any;
  id?: string;
  initValue?: number;
  value?: CustomSelectValue;
  onChange?: (value: CustomSelectValue) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = props => {
  const { source, id, initValue, value = {}, onChange } = props;
  const [componentId, setComponentId] = useState<number>(initValue || 0);

  const triggerChange = useCallback(
    (changedValue: { componentId?: number }) => {
      onChange?.({ componentId, ...value, ...changedValue });
    },
    [onChange, value, componentId]
  );

  const onComponentIdChange = useCallback(
    (e: number) => {
      const newComponentId = e || 0;

      if (Number.isNaN(componentId)) {
        return;
      }
      setComponentId(newComponentId);
      triggerChange({ componentId: newComponentId });
    },
    [componentId, triggerChange]
  );

  const items = useMemo(() => {
    return source?.map((group: any) => ({
      ...group,
      children: (
        <div className="grid grid-cols-2 gap-2">
          {group.children?.map(
            (item: { type: string; label: string; value: number }) => (
              <Tooltip key={item.value} title={item.label}>
                <Tag
                  className="cursor-pointer"
                  onClick={() => {
                    onComponentIdChange(item.value);
                  }}
                  icon={
                    <div
                      style={{ paddingBottom: '4px', display: 'inline-block' }}
                    >
                      <WidgetIcon type={item.type} />
                    </div>
                  }
                  color={item.value === componentId ? '#55acee' : 'default'}
                  style={{
                    width: '140px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {' '}
                  <span style={{ lineHeight: '24px', fontSize: '14px' }}>
                    {item.label}
                  </span>
                </Tag>
              </Tooltip>
            )
          )}
        </div>
      ),
    }));
  }, [componentId, onComponentIdChange, source]);

  return (
    <span id={id}>
      <Collapse
        items={items}
        ghost
        defaultActiveKey={['1']}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      />
    </span>
  );
};

export default CustomSelect;

const WidgetIcon = ({ type }: { type: string }) => {
  let icon;
  switch (type) {
    case WidgetTypeEnum.Input:
      icon = <TextCursorInput className="text-blue-400 h-4 w-4 inline-block" />;
      break;
    case WidgetTypeEnum.Radio:
      icon = <Disc className="text-blue-400 h-4 w-4 inline-block" />;
      break;
    case WidgetTypeEnum.Checkbox:
      icon = <SquareCheck className="text-blue-400 h-4 w-4 inline-block" />;
      break;
    case WidgetTypeEnum.Textarea:
      icon = <Text className="text-blue-400 h-4 w-4 inline-block" />;
      break;
    case WidgetTypeEnum.File:
      icon = <CloudUpload className="text-blue-400 h-4 w-4 inline-block" />;
      break;
    case WidgetTypeEnum.Tree:
      icon = <FolderTree className="text-blue-400 h-4 w-4 inline-block" />;
      break;
    default:
      icon = <FormOutlined className="text-blue-400 h-4 w-4 inline-block" />;
  }
  return <>{icon}</>;
};
