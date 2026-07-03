import prisma from '@/lib/prisma';

export class GalleryImage {
  static async findAll() {
    return prisma.galleryImage.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        album: true,
      }
    });
  }

  static async findById(id: number) {
    return prisma.galleryImage.findUnique({
      where: { image_id: id },
      include: {
        album: true,
      }
    });
  }

  static async create(data: { image_url: string; description?: string; album_id?: number }) {
    return prisma.galleryImage.create({ data });
  }

  static async delete(id: number) {
    return prisma.galleryImage.delete({
      where: { image_id: id },
    });
  }
}
