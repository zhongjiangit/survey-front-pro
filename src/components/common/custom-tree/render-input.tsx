import { Input } from 'antd';
import { useState } from 'react';

interface RenderInputProps {
  currentNode: any;
  setCurrentNode: any;
  onSave: any;
}

const RenderInput = ({
  currentNode,
  setCurrentNode,
  onSave,
}: RenderInputProps) => {
  const [title, setTitle] = useState(currentNode?.title);
  return (
    <Input
      type="input"
      size="small"
      autoFocus={true}
      value={title}
      placeholder="请输入节点名称"
      onBlur={() => {
        setCurrentNode({ ...currentNode, title });
        onSave({ ...currentNode, title });
      }}
      onChange={e => {
        setTitle(e.target.value);
      }}
    />
  );
};

export default RenderInput;
