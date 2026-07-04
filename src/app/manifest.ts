import { MetadataRoute } from 'next';
import { Setting } from '@/Models/Setting';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await Setting.getMultiple([{ key: 'company.name', defaultValue: 'Ecotechne' }]);
  const name = settings['company.name'] || 'Ecotechne';

  return {
    name: name,
    short_name: name,
    description: 'Catálogo y sistema de gestión de equipamiento 4x4 y off-road.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0503',
    theme_color: '#FF6D24',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/logo-short.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/logo-short.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
