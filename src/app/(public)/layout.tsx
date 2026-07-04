import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import VisitTracker from "@/components/VisitTracker";
import CookieBanner from "@/components/ui/CookieBanner";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Setting } from "@/Models/Setting";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const isLoggedIn = !!session;

  const hasServices = await prisma.service.count({ where: { active: true, deleted_at: null } }) > 0;
  const hasStore = await prisma.product.count({ where: { stock: { gt: 0 }, deleted_at: null } }) > 0;

  const defaultKeys = [
    { key: 'company.name', defaultValue: 'Ecotechne' },
    { key: 'company.email', defaultValue: 'admiecotechne@gmail.com' },
    { key: 'company.phone', defaultValue: '584265549941' },
    { key: 'company.logo', defaultValue: '/logo-long.png' },
  ];
  const settings = await Setting.getMultiple(defaultKeys);

  return (
    <>
      <VisitTracker />
      <Navbar 
        isLoggedIn={isLoggedIn} 
        hasServices={hasServices}
        hasStore={hasStore}
        settings={settings}
      />
      {children}
      <WhatsAppButton settings={settings} />
      <CookieBanner />
      <Footer settings={settings} />
    </>
  );
}
