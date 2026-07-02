import prisma from '@/lib/prisma';

export class Gallery {
  static async findAll() {
    return prisma.gallery.findMany({
      where: { deleted_at: null },
      orderBy: { created_at: 'desc' },
    });
  }

  static async findBySlug(slug: string) {
    return prisma.gallery.findUnique({
      where: { slug },
    });
  }

  static async findById(id: number) {
    return prisma.gallery.findUnique({
      where: { gallery_id: id },
    });
  }

  static async create(data: { title: string; description?: string; image_url: string; is_featured?: boolean }) {
    return prisma.gallery.create({
      data,
    });
  }

  static async update(id: number, data: { title: string; description?: string; image_url?: string; is_featured?: boolean }) {
    return prisma.gallery.update({
      where: { gallery_id: id },
      data,
    });
  }

  static async delete(id: number) {
    return prisma.gallery.update({
      where: { gallery_id: id },
      data: { deleted_at: new Date() },
    });
  }
}
