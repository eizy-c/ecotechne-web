import { Sidebar } from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { ContactMessage } from '@/Models/ContactMessage';
import { redirect } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { cookies } from 'next/headers';
import * as jose from 'jose';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  
  let user = null;
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-default-key-change-it-in-env');
      const { payload } = await jose.jwtVerify(token, secret);
      user = payload;
    } catch (error) {
      console.error('Error verifying token in layout', error);
    }
  }

  const unreadCount = await ContactMessage.getUnreadCount();

  return (
    <div className="min-h-screen bg-background flex">
      <Toaster position="top-right" />
      <Sidebar unreadCount={unreadCount} permissions={user?.permissions as string[]} />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <Header user={user} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
