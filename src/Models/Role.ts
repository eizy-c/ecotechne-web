import prisma from '@/lib/prisma';

export class Role {
  static async findAll() {
    return prisma.role.findMany({
      where: { deleted_at: null },
      orderBy: { name: 'asc' },
    });
  }

  static async findById(id: number) {
    return prisma.role.findUnique({
      where: { role_id: id },
    });
  }

  static async create(data: { name: string; description?: string }) {
    return prisma.role.create({
      data,
    });
  }

  static async update(id: number, data: { name: string; description?: string }) {
    return prisma.role.update({
      where: { role_id: id },
      data,
    });
  }

  static async delete(id: number) {
    return prisma.role.update({
      where: { role_id: id },
      data: { deleted_at: new Date() },
    });
  }
}
