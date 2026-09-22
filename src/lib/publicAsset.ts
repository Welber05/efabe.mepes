/** Resolve paths saved in the CMS against the deployment base (including GitHub Pages). */
export function publicAssetUrl(value?: string): string {
  const url = (value || '/logomarca.jpeg').trim();
  if (/^(?:https?:|data:|blob:|local-media:)/i.test(url)) return url;
  const base = import.meta.env.BASE_URL || '/';
  if (url.startsWith(base)) return url;
  return `${base}${url.replace(/^\/+/, '')}`;
}
