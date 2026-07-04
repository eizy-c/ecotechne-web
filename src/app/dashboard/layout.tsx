import { Sidebar } from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';
import MessageAlerter from '@/components/dashboard/MessageAlerter';
import SessionProvider from '@/components/SessionProvider';
import { ContactMessage } from '@/Models/ContactMessage';
import { redirect } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import { Setting } from '@/Models/Setting';

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
  
  const settings = await Setting.getMultiple([
    { key: 'company.name', defaultValue: 'Ecotechne' },
    { key: 'company.logo', defaultValue: '/logo-long.png' }
  ]);
  const companyName = settings['company.name'] || 'Ecotechne';
  const companyLogo = settings['company.logo'] || '/logo-long.png';

  return (
    <div className="min-h-screen bg-background flex">
      <SessionProvider user={user} unreadCount={unreadCount}>
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#1A1A1A',
              color: '#FFFFFF',
              border: '1px solid #FF6D24',
              borderRadius: '12px'
            }
          }} 
        />
        <MessageAlerter initialCount={unreadCount} />
        <Sidebar companyName={companyName} companyLogo={companyLogo} />
        <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
          <Header />
          <main className="flex-1 p-4 pb-24 md:p-8 overflow-x-hidden animate-fade-in-up">
            {children}
          </main>
          <MobileBottomNav />
        </div>
      </SessionProvider>
    </div>
  );
}
