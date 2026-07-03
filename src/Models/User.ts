import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export class User {
  static async findAll() {
    return prisma.user.findMany({
      where: { deleted_at: null },
      include: {
        role: true, },
      orderBy: { user_id: 'desc' }
    });
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { 
        role: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        } 
      },
    });
  }

  static async create(data: Prisma.UserUncheckedCreateInput) {
    return prisma.user.create({
      data,
    });
  }

  static async update(user_id: number, data: Prisma.UserUncheckedUpdateInput) {
    return prisma.user.update({
      where: { user_id },
      data,
    });
  }

  static async findById(user_id: number) {
    return prisma.user.findUnique({
      where: { user_id },
      include: { 
        role: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        } 
      },
    });
  }

  static async delete(id: number) {
    return prisma.user.update({
      where: { user_id: id },
      data: { deleted_at: new Date() },
    });
  }
}
