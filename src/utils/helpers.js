export const generateId = () => Math.random().toString(36).substr(2, 9);

export const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  const dayOfWeek = new Date(year, month, 1).getDay();
  const firstDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  return { days, firstDay };
};

export const formatDateString = (date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
