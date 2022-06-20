export const formatHour = (date: Date) =>
  date.toLocaleTimeString('es-MX', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: undefined,
}).toUpperCase();

export const formatPrice = (value: number, opts: { locale?: string; currency?: string } = {}) => {
  const { locale = 'es-MX', currency = 'MXN' } = opts

  const formatter = new Intl.NumberFormat(locale, {
    currency,
    style: 'currency',
    maximumFractionDigits: 2,
  })
  return formatter.format(value)
}