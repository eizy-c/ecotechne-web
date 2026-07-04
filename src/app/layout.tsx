import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

import { Setting } from "@/Models/Setting";
import { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: '#FF6D24',
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await Setting.getMultiple([
    { key: 'company.name', defaultValue: 'Ecotechne' },
    { key: 'company.favicon', defaultValue: '/favicon.ico' }
  ]);
  const companyName = settings['company.name'] || 'Ecotechne';
  const favicon = settings['company.favicon'] || '/favicon.ico';

  return {
    title: `${companyName} | Precisión Ingeniería e Innovación 4x4`,
    description: "Especialistas en diseño y fabricación de accesorios premium para vehículos 4x4, pickup y off-road.",
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'Ecotechne',
    },
    icons: {
      icon: favicon,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
        <meta name="application-name" content="Ecotechne" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Ecotechne" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0A0503" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#FF6D24" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen`} suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster richColors position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}


