import prisma from '@/lib/prisma';
import AnalyticsClient from './AnalyticsClient';

export default async function AnalyticsPage() {
  const [
    totalVisits,
    totalProductLeads,
    totalServiceLeads,
    recentProductLeads,
    recentServiceLeads
  ] = await Promise.all([
    prisma.visit.count(),
    prisma.productLead.count(),
    prisma.serviceLead.count(),
    prisma.productLead.findMany({
      orderBy: { created_at: 'desc' },
      include: { product: true }
    }),
    prisma.serviceLead.findMany({
      orderBy: { created_at: 'desc' },
      include: { service: true }
    })
  ]);

  return (
    <AnalyticsClient 
      totalVisits={totalVisits}
      totalProductLeads={totalProductLeads}
      totalServiceLeads={totalServiceLeads}
      recentProductLeads={recentProductLeads}
      recentServiceLeads={recentServiceLeads}
    />
  );
}
