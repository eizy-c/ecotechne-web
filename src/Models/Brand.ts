import prisma from '@/lib/prisma';

export class Brand {
  static async findAll() {
    return prisma.brand.findMany({
      where: { deleted_at: null },
      orderBy: { name: 'asc' },
    });
  }

  static async findById(id: number) {
    return prisma.brand.findUnique({
      where: { brand_id: id },
    });
  }

  static async create(data: { name: string }) {
    return prisma.brand.create({
      data,
    });
  }

  static async update(id: number, data: { name: string }) {
    return prisma.brand.update({
      where: { brand_id: id },
      data,
    });
  }

  static async delete(id: number) {
    return prisma.brand.update({
      where: { brand_id: id },
      data: { deleted_at: new Date() },
    });
  }
}
