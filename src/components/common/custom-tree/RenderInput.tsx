import { Input } from 'antd';

interface RenderInputProps {
  currentNode: any;
  setCurrentNode: any;
}

const RenderInput = ({ currentNode, setCurrentNode }: RenderInputProps) => {
  console.log(111111, currentNode);

  return (
    <Input
      type="input"
      size="small"
      value={currentNode?.title}
      placeholder="请输入节点名称"
      onChange={e => {
        console.log(121212, e.target.value);

        setCurrentNode({
          key: currentNode?.key as string | number,
          title: e.target.value,
        });
      }}
      // onBlur={e =>
      //   saveNode(String(currentNode?.key) || uuidv4(), e.target.value)
      // }
    />
  );
};

export default RenderInput;
