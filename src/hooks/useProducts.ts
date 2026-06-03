"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Product, PaginatedResponse } from "@/types";

interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  sort?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery<PaginatedResponse<Product>>({
    queryKey: ["products", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== "") params.set(k, String(v));
      });
      const { data } = await api.get(`/products?${params}`);
      return data;
    },
    staleTime: 60 * 1000,
  });
}

export function useProduct(slug: string) {
  return useQuery<{ success: boolean; data: Product }>({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data } = await api.get(`/products/${slug}`);
      return data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedProducts() {
  return useQuery<{ success: boolean; data: Product[] }>({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const { data } = await api.get("/products?isFeatured=true");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useNewArrivals() {
  return useQuery<{ success: boolean; data: Product[] }>({
    queryKey: ['products', 'new-arrivals'],
    queryFn: async () => {
      const { data } = await api.get('/products?isNewArrival=true');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useWishlist() {
  return useQuery<{ success: boolean; data: Product[] }>({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const { data } = await api.get('/users/wishlist');
      return data;
    },
    staleTime: 60 * 1000,
  });
}
