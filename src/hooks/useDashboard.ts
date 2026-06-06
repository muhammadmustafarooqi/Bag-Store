'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const { data } = await api.get(`/admin/dashboard?t=${Date.now()}`);
      return data.data;
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useSalesAnalytics(period: 'week' | 'month' | 'year' = 'week') {
  return useQuery({
    queryKey: ['admin', 'analytics', period],
    queryFn: async () => {
      const { data } = await api.get(`/admin/analytics/sales?period=${period}`);
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
