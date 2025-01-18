const message = (type: string, msg: string) => {
  if (typeof window !== 'undefined') {
    // @ts-expect-error: window.messageApi might not be typed correctly
    window.messageApi[type](msg);
  }
};

export default message;
