import prisma from '@/lib/prisma';

export class Setting {
  /**
   * Obtiene el valor de una configuración por su clave.
   * Si no existe, devuelve el valor por defecto proporcionado.
   */
  static async get(key: string, defaultValue: string = ''): Promise<string> {
    try {
      const setting = await prisma.setting.findUnique({
        where: { key }
      });
      return setting ? setting.value : defaultValue;
    } catch (error) {
      console.error(`Error fetching setting ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Obtiene múltiples configuraciones a la vez y devuelve un objeto de clave-valor.
   */
  static async getMultiple(keys: { key: string, defaultValue: string }[]): Promise<Record<string, string>> {
    try {
      const keyNames = keys.map(k => k.key);
      const settings = await prisma.setting.findMany({
        where: { key: { in: keyNames } }
      });

      const result: Record<string, string> = {};
      
      keys.forEach(k => {
        const found = settings.find(s => s.key === k.key);
        result[k.key] = found ? found.value : k.defaultValue;
      });

      return result;
    } catch (error) {
      console.error('Error fetching multiple settings:', error);
      const fallback: Record<string, string> = {};
      keys.forEach(k => fallback[k.key] = k.defaultValue);
      return fallback;
    }
  }

  /**
   * Actualiza o crea una configuración.
   */
  static async set(key: string, value: string): Promise<any> {
    return prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
  }

  /**
   * Actualiza o crea múltiples configuraciones.
   */
  static async setMultiple(settings: Record<string, string>): Promise<void> {
    const promises = Object.entries(settings).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      });
    });

    await Promise.all(promises);
  }
}
