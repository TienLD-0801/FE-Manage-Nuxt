export const convertTimeMessage = (time: string): string => {
  const hour = new Date(time).getHours();
  const minute = new Date(time).getMinutes();
  const formatTime = `${hour}:${minute < 10 ? `0${minute}` : `${minute}`}`;
  return formatTime;
};
