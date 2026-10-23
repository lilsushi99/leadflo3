export function formatCurrency(amount: number, currency: string = 'NGN'): string {
  if (currency === 'USD') {
    return `$${amount.toLocaleString()}`;
  }
  return `₦${amount.toLocaleString()}`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateString;
  }
}

export function getInitials(name: string): string {
  if (!name) return '??';
  return name
    .split(' ')
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
