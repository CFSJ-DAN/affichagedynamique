export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds} secondes`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0 
    ? `${minutes} min ${remainingSeconds} sec`
    : `${minutes} minutes`;
};

export const calculateTotalDuration = (items: { duration: number }[]): number => {
  return items.reduce((total, item) => total + (item.duration || 0), 0);
};