
export const generateOrderId = () => {
  const letters = Array.from({ length: 3 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join("");
  const numbers = Math.floor(10000 + Math.random() * 90000); // 5 digits
  return `${letters}${numbers}`;
};
