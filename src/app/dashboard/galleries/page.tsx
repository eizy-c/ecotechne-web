import { Gallery } from '@/Models/Gallery';
import GalleriesList from './GalleriesList';

export default async function GalleriesPage() {
  const galleries = await Gallery.findAll();

  // Serialize objects from DB to pass to Client Component
  const serializedGalleries = JSON.parse(JSON.stringify(galleries));

  return <GalleriesList initialGalleries={serializedGalleries} />;
}
