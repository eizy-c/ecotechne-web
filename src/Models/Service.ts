import prisma from '@/lib/prisma';

export class Service {
  static async findAllActives() {
    return prisma.service.findMany({
      where: { active: true, deleted_at: null },
      orderBy: { name: 'asc' },
    });
  }

  static async findBySlug(slug: string) {
    return prisma.service.findUnique({
      where: { slug },
    });
  }

  static async findAll() {
    return prisma.service.findMany({
      where: { deleted_at: null },
      orderBy: { name: 'asc' },
    });
  }

  static async findById(id: number) {
    return prisma.service.findUnique({
      where: { service_id: id },
    });
  }

  static async create(data: any) {
    return prisma.service.create({
      data,
    });
  }

  static async update(id: number, data: any) {
    return prisma.service.update({
      where: { service_id: id },
      data,
    });
  }

  static async delete(id: number) {
    return prisma.service.update({
      where: { service_id: id },
      data: { deleted_at: new Date() },
    });
  }
}
