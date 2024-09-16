export const getPublicUrl = (path: string) => {
  const prefix = path.startsWith('/') ? '' : '/'

  return `http://localhost:7000${prefix}${path}`
}
