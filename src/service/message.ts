const message = (type: string, msg: string) => {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.messageApi[type](msg);
  }
};

export default message;