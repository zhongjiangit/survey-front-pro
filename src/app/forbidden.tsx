import { Button, Result } from 'antd';

/**
 * 无权限页面
 * @constructor
 */
const Forbidden = () => {
  return (
    <Result
      title="403"
      status="403"
      subTitle="对不起，你无权访问该页面"
      extra={
        <Button type="primary" href={'/'}>
          返回首页
        </Button>
      }
    />
  );
};

export default Forbidden;
