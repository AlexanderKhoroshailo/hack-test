export const sendData = (data) => {
  return new Promise((res) => {
    setTimeout(() => {
      if (data.amount % 2 === 0) {
        Object.keys(data).forEach((key) => {
          localStorage.setItem(`${key}`, data[key]);
        });
        res({ success: true });
      } else {
        res({ success: false });
      }
    }, 1000);
  });
};
