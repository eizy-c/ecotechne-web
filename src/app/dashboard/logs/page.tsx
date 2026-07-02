import prisma from '@/lib/prisma';
import { requirePermission } from '@/lib/auth';
import LogsTable from './LogsTable';

export const metadata = {
  title: 'Auditoría | Panel de Administración',
};

export default async function LogsPage() {
  await requirePermission('read:logs');

  const logs = await prisma.auditLog.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      user: {
        select: { name: true, email: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Registro de Auditoría</h1>
          <p className="text-foreground/60">Historial de acciones realizadas en el sistema</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden p-6">
        <LogsTable logs={logs} />
      </div>
    </div>
  );
}
