# Ecotechne 4x4 - Panel de Control y Catálogo Web

Este proyecto es una aplicación web completa desarrollada con Next.js 15 (App Router), React, y Prisma ORM para Ecotechne 4x4.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu sistema:
- **Node.js** (versión 18 o superior)
- **MySQL** o MariaDB (o acceso a una base de datos compatible)
- **Git** (opcional, para clonar el repositorio)

## Paso a Paso para Desplegar Localmente

Sigue estos pasos cuidadosamente para ejecutar el proyecto en tu entorno local:

### 1. Descargar el código
Si descargaste un archivo ZIP desde GitHub, extráelo en una carpeta de tu elección.
Si prefieres usar Git, clona el repositorio:
```bash
git clone <URL_DEL_REPOSITORIO>
cd ecotechne
```

### 2. Instalar las dependencias
Abre una terminal o consola de comandos en la raíz de la carpeta del proyecto y ejecuta:
```bash
npm install
```
*(Esto descargará todas las librerías necesarias para que el proyecto funcione).*

### 3. Configurar las Variables de Entorno
En la raíz del proyecto encontrarás un archivo llamado `.env.example` o similar (o simplemente crea uno llamado `.env`).
Abre/Crea el archivo `.env` en un editor de texto e incluye lo siguiente:

```env
# Configuración de tu Base de Datos MySQL
# Reemplaza 'usuario', 'contraseña', 'localhost', '3306' y 'ecotechne_db' con tus datos reales.
DATABASE_URL="mysql://root:@localhost:3306/ecotechne"

# Clave secreta para las sesiones y tokens de seguridad (Pon cualquier texto largo y seguro)
JWT_SECRET="mi_clave_secreta_super_segura_12345"
```

### 4. Preparar la Base de Datos
Primero, asegúrate de que tu servidor MySQL esté ejecutándose (por ejemplo, XAMPP). Crea una base de datos vacía llamada `ecotechne` (o el nombre que hayas puesto en la URL de arriba).
Luego, en tu terminal, ejecuta el comando para aplicar la estructura (tablas) a tu base de datos:
```bash
npx prisma db push
```

**(Opcional)** Si la base de datos es nueva y quieres generar un usuario administrador inicial, puedes correr el script de seed si existe:
```bash
npm run seed
```

### 5. Iniciar el Servidor de Desarrollo
Finalmente, inicia la aplicación web con el siguiente comando:
```bash
npm run dev
```

La consola te indicará que el servidor está corriendo.
Abre tu navegador y entra a: [http://localhost:3000](http://localhost:3000)

---

## Estructura del Proyecto
- `src/app`: Contiene todas las páginas (Frontend de la web pública y el Dashboard).
- `src/components`: Componentes reutilizables (Botones, Modales, Barras laterales).
- `src/actions`: Funciones que se ejecutan directamente en el servidor (Server Actions) para conectarse a la Base de datos.
- `src/lib/prisma.ts`: Conexión directa a la Base de Datos.
- `prisma/schema.prisma`: El esquema y modelo de la base de datos completa.

¡Disfruta del proyecto!
