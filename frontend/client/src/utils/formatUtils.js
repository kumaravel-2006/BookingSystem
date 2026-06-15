export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatTime = (dateStr) => {
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
};