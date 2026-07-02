import prisma from '@/lib/prisma';

export class Product {
  static async findAll() {
    const products = await prisma.product.findMany({
      where: { deleted_at: null },
      include: {
        images: true,
        categoryProducts: { include: { category: true } },
        vehicleProducts: {
          include: {
            vehicle: { include: { brand: true, model: true } }
          }
        },
      },
      orderBy: { name: 'asc' },
    });
    return products.map(Product.mapRelations);
  }

  static async findBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: true,
        categoryProducts: { include: { category: true } },
        vehicleProducts: {
          include: {
            vehicle: { include: { brand: true, model: true } }
          }
        },
      },
    });
    return product ? Product.mapRelations(product) : null;
  }

  static async findById(id: number) {
    const product = await prisma.product.findUnique({
      where: { product_id: id },
      include: {
        images: true,
        categoryProducts: { include: { category: true } },
        vehicleProducts: {
          include: {
            vehicle: { include: { brand: true, model: true } }
          }
        },
      },
    });
    return product ? Product.mapRelations(product) : null;
  }

  static mapRelations(p: any) {
    return {
      ...p,
      categories: p.categoryProducts?.map((cp: any) => cp.category) || [],
      vehicles: p.vehicleProducts?.map((vp: any) => vp.vehicle) || [],
    };
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
