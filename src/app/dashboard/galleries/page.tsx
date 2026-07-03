import { Album } from '@/Models/Album';
import { GalleryImage } from '@/Models/GalleryImage';
import MediaManager from './MediaManager';

export default async function GalleriesPage() {
  const albums = await Album.findAll();
  const images = await GalleryImage.findAll();

  // Serialize objects from DB to pass to Client Component
  const serializedAlbums = JSON.parse(JSON.stringify(albums));
  const serializedImages = JSON.parse(JSON.stringify(images));

  return <MediaManager initialAlbums={serializedAlbums} initialImages={serializedImages} />;
}
