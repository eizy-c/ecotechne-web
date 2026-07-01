import prisma from '@/lib/prisma';

export class VehicleModel {
  static async findAll() {
    return prisma.vehicleModel.findMany({
      where: { deleted_at: null },
      include: { brand: true },
      orderBy: { name: 'asc' },
    });
  }

  static async findById(id: number) {
    return prisma.vehicleModel.findUnique({
      where: { vehicle_model_id: id },
      include: { brand: true },
    });
  }

  static async create(data: { name: string; brand_id: number }) {
    return prisma.vehicleModel.create({
      data,
    });
  }

  static async update(id: number, data: { name?: string; brand_id?: number }) {
    return prisma.vehicleModel.update({
      where: { vehicle_model_id: id },
      data,
    });
  }

  static async delete(id: number) {
    return prisma.vehicleModel.update({
      where: { vehicle_model_id: id },
      data: { deleted_at: new Date() },
    });
  }
}
