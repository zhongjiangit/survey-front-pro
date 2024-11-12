import { Button, Result } from 'antd';

/**
 * 未找到页面
 * @constructor
 */
const NotFound = () => {
  return (
    <Result
      title="404"
      status="404"
      subTitle="抱歉，你访问的页面不存在"
      extra={
        <Button type="primary" href={'/'}>
          返回首页
        </Button>
      }
    />
  );
};

export default NotFound;
