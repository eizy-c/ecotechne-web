import prisma from '@/lib/prisma';

export class Product {
  static async findAll() {
    return prisma.product.findMany({
      where: { deleted_at: null },
      include: {
        categories: true,
        vehicles: {
          include: { brand: true, model: true }
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  static async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        categories: true,
        vehicles: {
          include: { brand: true, model: true }
        },
      },
    });
  }

  static async findById(id: number) {
    return prisma.product.findUnique({
      where: { product_id: id },
      include: {
        categories: true,
        vehicles: {
          include: { brand: true, model: true }
        },
      },
    });
  }

  static async create(data: any) {
    return prisma.product.create({
      data,
    });
  }

  static async update(id: number, data: any) {
    return prisma.product.update({
      where: { product_id: id },
      data,
    });
  }

  static async delete(id: number) {
    return prisma.product.update({
      where: { product_id: id },
      data: { deleted_at: new Date() },
    });
  }
}
