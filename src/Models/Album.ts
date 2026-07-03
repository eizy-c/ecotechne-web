import prisma from '@/lib/prisma';

export class Album {
  static async findAll() {
    return prisma.album.findMany({
      where: { deleted_at: null },
      orderBy: { created_at: 'desc' },
      include: {
        images: true,
      }
    });
  }

  static async findById(id: number) {
    return prisma.album.findFirst({
      where: { album_id: id, deleted_at: null },
      include: {
        images: true,
      }
    });
  }

  static async create(data: { name: string; description?: string }) {
    return prisma.album.create({ data });
  }

  static async update(id: number, data: { name?: string; description?: string }) {
    return prisma.album.update({
      where: { album_id: id },
      data,
    });
  }

  static async delete(id: number) {
    return prisma.album.update({
      where: { album_id: id },
      data: { deleted_at: new Date() },
    });
  }
}
