import prisma from '@/lib/prisma';

export class Permission {
  static async findAll() {
    return prisma.permission.findMany({
      where: { deleted_at: null },
      orderBy: { name: 'asc' },
    });
  }

  static async findById(id: number) {
    return prisma.permission.findUnique({
      where: { permission_id: id },
    });
  }

  static async create(data: { name: string; description?: string }) {
    return prisma.permission.create({
      data,
    });
  }

  static async update(id: number, data: { name: string; description?: string }) {
    return prisma.permission.update({
      where: { permission_id: id },
      data,
    });
  }

  static async delete(id: number) {
    return prisma.permission.update({
      where: { permission_id: id },
      data: { deleted_at: new Date() },
    });
  }
}
