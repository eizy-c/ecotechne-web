import { google } from 'googleapis';

/**
 * Transforma enlaces de Google Drive compartidos en enlaces directos de imagen.
 */
function transformDriveLink(url: string) {
  if (!url) return '';
  const driveRegex = /(?:\/d\/|id=)([\w-]+)/;
  const match = url.match(driveRegex);
  if (match && (url.includes('drive.google.com') || url.includes('google.com/file'))) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return url;
}

/**
 * Servicio para interactuar con Google Sheets de forma segura en el servidor.

 * Ecotechne utiliza esta integración para gestionar dinámicamente servicios y productos.
 */
export async function getSheetData(range: string) {
  try {
    const creds = process.env.GOOGLE_SHEETS_CREDENTIALS;
    if (!creds) {
      console.warn('⚠️ GOOGLE_SHEETS_CREDENTIALS no está definido en .env.local');
      return null;
    }

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(creds.trim().replace(/^'|'$/g, '')),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Debug: Listar todas las pestañas disponibles si falla
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });
    const sheetNames = spreadsheet.data.sheets?.map(s => s.properties?.title);
    console.log(`📑 Pestañas disponibles en el documento: ${JSON.stringify(sheetNames)}`);

    console.log(`🔍 Intentando obtener datos de Sheet: ${process.env.GOOGLE_SHEET_ID}, Rango: ${range}`);
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range,
    });


    if (!response.data.values || response.data.values.length === 0) {
      console.warn(`Empty response for range ${range}`);
      return [];
    }

    console.log(`✅ Datos recibidos para ${range}: ${response.data.values.length} filas.`);
    return response.data.values;
  } catch (error: any) {
    console.error(`❌ Error en getSheetData (${range}):`, error.message);
    return null;
  }
}


// Helper para obtener servicios
export async function getServices() {
  const data = await getSheetData('Servicios!A1:D10');
  if (!data) return [];
  
  // Filtramos filas vacías (donde el título esté vacío)
  return data
    .filter(row => row[0] && row[0].trim() !== '')
    .map((row) => ({
      title: row[0].trim(),
      description: row[1]?.trim() || '',
      icon: row[2]?.trim() || 'gear',
      active: String(row[3]).toUpperCase() === 'TRUE',
    }));
}

// Helper para obtener datos de la galería de proyectos
export async function getGallery() {
  const data = await getSheetData('Galeria!A1:C20');
  if (!data) return [];
  
  // Filtramos filas vacías
  const projects = data
    .filter(row => row && row[0] && row[0].trim() !== '')
    .map((row) => ({
      titulo: row[0]?.trim() || 'Proyecto sin título',
      descripcion: row[1]?.trim() || '',
      imagen: transformDriveLink(row[2]?.trim() || '') || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop',
    }));

  console.log(`🖼️ Galería mapeada (${projects.length} items):`, JSON.stringify(projects, null, 2));
  return projects;
}






