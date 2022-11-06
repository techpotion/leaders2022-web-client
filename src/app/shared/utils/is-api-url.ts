export function isApiUrl(url: string): boolean {
  return url.startsWith('/api/v1');
}
