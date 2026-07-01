import prisma from '@/lib/prisma';

export class Category {
  static async findAll() {
    return prisma.category.findMany({
      where: { deleted_at: null },
      orderBy: { name: 'asc' },
    });
  }

  static async findById(id: number) {
    return prisma.category.findUnique({
      where: { category_id: id },
    });
  }

  static async create(data: { name: string }) {
    return prisma.category.create({
      data,
    });
  }

  static async update(id: number, data: { name: string }) {
    return prisma.category.update({
      where: { category_id: id },
      data,
    });
  }

  static async delete(id: number) {
    return prisma.category.update({
      where: { category_id: id },
      data: { deleted_at: new Date() },
    });
  }
}
