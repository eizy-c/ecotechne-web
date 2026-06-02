import { google } from 'googleapis';

/**
 * Servicio para interactuar con Google Sheets de forma segura en el servidor.
 * Ecotechne utiliza esta integración para gestionar dinámicamente servicios y productos.
 */
export async function getSheetData(range: string) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range,
    });

    return response.data.values;
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    // Retornamos null o datos por defecto si falla la integración
    return null;
  }
}

// Ejemplo de helper para parsear filas a objetos tipados
export async function getServices() {
  const data = await getSheetData('Servicios!A2:D10'); // Ajustar nombre de hoja y rango
  if (!data) return [];
  
  return data.map((row) => ({
    title: row[0],
    description: row[1],
    icon: row[2], // nombre de icono de FontAwesome
    active: row[3] === 'TRUE',
  }));
}
