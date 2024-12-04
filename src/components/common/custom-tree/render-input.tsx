import { Input } from 'antd';

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
  return (
    <Input
      type="input"
      size="small"
      value={currentNode?.title}
      placeholder="请输入节点名称"
      onBlur={onSave}
      onChange={e => {
        setCurrentNode({ ...currentNode, title: e.target.value });
      }}
    />
  );
};

export default RenderInput;
