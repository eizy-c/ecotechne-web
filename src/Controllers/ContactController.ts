'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';

// Esquema de validación estricto para el formulario de contacto
const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100, 'Nombre muy largo').trim(),
  email: z.string().email('Correo electrónico inválido').trim().toLowerCase(),
  message: z.string().min(10, 'El mensaje debe ser más largo').max(1000, 'Mensaje demasiado largo').trim(),
});

export async function submitContactForm(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    
    // 1. Sanitización y Validación con Zod
    // Nota: Zod no tiene .escapeHTML() nativo sin extend, así que lo simulamos
    // o simplemente confiamos en Prisma que ya escapa el SQL. Para XSS, React escapa por defecto.
    const strictSchema = z.object({
      name: z.string().min(2, 'El nombre es muy corto').max(100).trim(),
      email: z.string().email('Email inválido').trim().toLowerCase(),
      message: z.string().min(10, 'El mensaje es muy corto').max(1000).trim(),
    });

    const result = strictSchema.safeParse(rawData);

    if (!result.success) {
      return { error: result.error.errors[0].message };
    }

    const { name, email, message } = result.data;

    // 2. Inserción segura usando Prisma (Evita SQL Injection nativamente)
    // Actualmente en schema.prisma no tenemos un modelo "Contacto" o "Inquiry" definido
    // Pero lo dejaremos preparado para cuando se añada a la base de datos o
    // enviaremos un email. Por ahora, si no hay modelo, puedes usar console.log o nodemailer.
    
    // Suponiendo que añades un modelo Inquiry o Mensaje a Prisma en el futuro:
    /*
    await prisma.inquiry.create({
      data: { name, email, message }
    });
    */

    console.log(`Nuevo mensaje de contacto seguro: ${name} (${email}) - ${message}`);

    return { success: true, message: 'Mensaje enviado correctamente' };
  } catch (error) {
    console.error('Error procesando contacto:', error);
    return { error: 'Error del servidor al enviar el mensaje' };
  }
}
