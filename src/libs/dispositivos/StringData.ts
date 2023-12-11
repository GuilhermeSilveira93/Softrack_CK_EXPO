export const stringData = (format:Date) => {
  const dataString = new Intl.DateTimeFormat('pt-br', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(format)
  return dataString
}