import prisma from '@/lib/prisma';

export class ContactMessage {
  static async findAll() {
    return prisma.contactMessage.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  static async getUnreadCount() {
    return prisma.contactMessage.count({
      where: { is_read: false },
    });
  }

  static async findById(id: number) {
    return prisma.contactMessage.findUnique({
      where: { message_id: id },
    });
  }

  static async create(data: { name: string; phone: string; message: string }) {
    return prisma.contactMessage.create({
      data,
    });
  }

  static async markAsRead(id: number) {
    return prisma.contactMessage.update({
      where: { message_id: id },
      data: { is_read: true },
    });
  }

  static async delete(id: number) {
    return prisma.contactMessage.delete({
      where: { message_id: id },
    });
  }
}
