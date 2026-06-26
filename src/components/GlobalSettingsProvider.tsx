'use client';
import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import api from '@/lib/api';

export function GlobalSettingsProvider() {
  const setGlobalSettings = useCartStore((s) => s.setGlobalSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        setGlobalSettings(data.data);
      } catch (err) {
        console.error('Failed to fetch global settings', err);
      }
    };
    fetchSettings();
  }, [setGlobalSettings]);

  return null;
}
