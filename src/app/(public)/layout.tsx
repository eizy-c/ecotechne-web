import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const isLoggedIn = !!session;

  const hasServices = await prisma.service.count({ where: { active: true, deleted_at: null } }) > 0;
  const hasStore = await prisma.product.count({ where: { stock: { gt: 0 }, deleted_at: null } }) > 0;
  const hasGallery = await prisma.gallery.count({ where: { deleted_at: null } }) > 0;

  return (
    <>
      <Navbar 
        isLoggedIn={isLoggedIn} 
        hasServices={hasServices}
        hasStore={hasStore}
        hasGallery={hasGallery}
      />
      {children}
      <WhatsAppButton />
      <Footer />
    </>
  );
}
