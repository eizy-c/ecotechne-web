import prisma from '@/lib/prisma';

export class Vehicle {
  static async findAll() {
    return prisma.vehicle.findMany({
      where: { deleted_at: null },
      include: {
        brand: true,
        model: true,
      },
    });
  }

  static async findById(id: number) {
    return prisma.vehicle.findUnique({
      where: { vehicle_id: id },
      include: {
        brand: true,
        model: true,
      },
    });
  }

  static async create(data: { brand_id: number; vehicle_model_id: number; year: string }) {
    return prisma.vehicle.create({
      data,
    });
  }

  static async update(id: number, data: { brand_id?: number; vehicle_model_id?: number; year?: string }) {
    return prisma.vehicle.update({
      where: { vehicle_id: id },
      data,
    });
  }

  static async delete(id: number) {
    return prisma.vehicle.update({
      where: { vehicle_id: id },
      data: { deleted_at: new Date() },
    });
  }
}
