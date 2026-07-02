import prisma from '@/lib/prisma';

export class Client {
  static async findOrCreate(data: { name: string, email?: string | null, phone?: string | null, country?: string | null }) {
    let client = null;
    
    if (data.email) {
      client = await prisma.client.findUnique({ where: { email: data.email } });
    }

    if (client) {
      // Update existing client with latest info
      client = await prisma.client.update({
        where: { client_id: client.client_id },
        data: {
          name: data.name,
          phone: data.phone || client.phone,
          country: data.country || client.country,
        }
      });
    } else {
      // Create new client
      client = await prisma.client.create({
        data: {
          name: data.name,
          email: data.email || null,
          phone: data.phone || null,
          country: data.country || null,
        }
      });
    }

    return client;
  }
}
