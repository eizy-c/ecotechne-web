'use server';

import { Setting } from '@/Models/Setting';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateSettings(formData: FormData) {
  const settings: Record<string, string> = {};
  
  formData.forEach((value, key) => {
    // Solo guardamos los valores string que no sean propiedades internas (como action_id, etc.)
    if (typeof value === 'string' && !key.startsWith('$')) {
      settings[key] = value;
    }
  });

  await Setting.setMultiple(settings);
  
  // Revalidar las rutas afectadas
  revalidatePath('/');
  revalidatePath('/dashboard/settings');

  redirect('/dashboard/settings?success=1');
}
