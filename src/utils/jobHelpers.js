export const formatDeadline = (deadlineStr) => {
  if (!deadlineStr) return { text: 'No deadline specified', isUrgent: false, daysLeft: null };
  const deadline = new Date(deadlineStr);
  const now = new Date();
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: 'Closed', isUrgent: false, isClosed: true, daysLeft: 0 };
  }
  if (diffDays === 0) {
    return { text: 'Closes Today!', isUrgent: true, daysLeft: 0 };
  }
  if (diffDays <= 7) {
    return { text: `${diffDays} days left`, isUrgent: true, daysLeft: diffDays };
  }
  if (diffDays <= 30) {
    return { text: `${diffDays} days left`, isUrgent: false, daysLeft: diffDays };
  }

  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return {
    text: deadline.toLocaleDateString('en-IN', options),
    isUrgent: false,
    daysLeft: diffDays,
  };
};

export const getSectorColors = (sector) => {
  switch (sector) {
    case 'Government':
      return { bg: '#E8F0FE', text: '#2457A6', border: '#BFDBFE' };
    case 'PSU':
      return { bg: '#E0F2F1', text: '#0E635C', border: '#99F6E4' };
    case 'Private Sector':
      return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' };
    default:
      return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
  }
};
