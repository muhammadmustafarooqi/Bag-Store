'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Order, PaginatedResponse } from '@/types';

export function useOrders(page = 1) {
  return useQuery<PaginatedResponse<Order>>({
    queryKey: ['orders', page],
    queryFn: async () => {
      const { data } = await api.get(`/orders/my-orders?page=${page}`);
      return data;
    },
    staleTime: 60 * 1000,
  });
}

export function useOrder(orderId: string) {
  return useQuery<{ success: boolean; data: Order }>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${orderId}`);
      return data;
    },
    enabled: !!orderId,
  });
}
