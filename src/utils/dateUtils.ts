export const formatOfflineTime = (lastSeen: Date) => {
  const now = new Date();
  const diffInMillis = now.getTime() - lastSeen.getTime();
  const diffInMinutes = Math.floor(diffInMillis / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Formater la date
  const formattedDate = lastSeen.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Formater la durée écoulée
  let duration;
  if (diffInDays > 0) {
    duration = `${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
  } else if (diffInHours > 0) {
    duration = `${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
  } else {
    duration = `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
  }

  return { formattedDate, duration };
};