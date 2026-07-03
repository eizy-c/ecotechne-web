import prisma from '@/lib/prisma';

export class Product {
  static async findAll() {
    const products = await prisma.product.findMany({
      where: { deleted_at: null },
      include: {
        images: { include: { image: true } },
        categoryProducts: { include: { category: true } },
        vehicleProducts: true,
      },
      orderBy: { name: 'asc' },
    });

    // Fetch all vehicles for these products in one go
    const vehicleIds = Array.from(new Set(products.flatMap(p => p.vehicleProducts.map((vp: any) => vp.vehicle_id))));
    const vehicles = await prisma.vehicle.findMany({
      where: { vehicle_id: { in: vehicleIds } },
      include: { brand: true, model: true }
    });

    const vehicleMap = new Map(vehicles.map(v => [v.vehicle_id, v]));

    return products.map((p: any) => ({
      ...p,
      categories: p.categoryProducts?.map((cp: any) => cp.category) || [],
      vehicles: p.vehicleProducts?.map((vp: any) => vehicleMap.get(vp.vehicle_id)).filter(Boolean) || [],
    }));
  }

  static async findBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { include: { image: true } },
        categoryProducts: { include: { category: true } },
        vehicleProducts: true,
      },
    });
    
    if (!product) return null;

    const vehicleIds = product.vehicleProducts.map((vp: any) => vp.vehicle_id);
    const vehicles = await prisma.vehicle.findMany({
      where: { vehicle_id: { in: vehicleIds } },
      include: { brand: true, model: true }
    });

    return {
      ...product,
      categories: product.categoryProducts?.map((cp: any) => cp.category) || [],
      vehicles: vehicles,
    };
  }

  static async findById(id: number) {
    const product = await prisma.product.findUnique({
      where: { product_id: id },
      include: {
        images: { include: { image: true } },
        categoryProducts: { include: { category: true } },
        vehicleProducts: true,
      },
    });

    if (!product) return null;

    const vehicleIds = product.vehicleProducts.map((vp: any) => vp.vehicle_id);
    const vehicles = await prisma.vehicle.findMany({
      where: { vehicle_id: { in: vehicleIds } },
      include: { brand: true, model: true }
    });

    return {
      ...product,
      categories: product.categoryProducts?.map((cp: any) => cp.category) || [],
      vehicles: vehicles,
    };
  }

  // mapRelations is no longer used but kept for backwards compatibility if any other code calls it
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
