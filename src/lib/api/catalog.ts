/**
 * Public Catalogue, Categories, and Collections API
 */

import { apiClient } from "./client";
import {
  Category,
  CategoryTree,
  Collection,
  Product,
  ProductListResponse,
  ProductQueryParams,
} from "./types";

export const catalogApi = {
  /**
   * Retrieve hierarchical category taxonomy tree for dynamic department navigation.
   */
  async getCategoryTree(): Promise<CategoryTree[]> {
    return apiClient<CategoryTree[]>("/categories/tree", { skipAuth: true });
  },

  /**
   * List storefront categories with optional parent filtering or roots-only flag.
   */
  async getCategories(params?: { parent_id?: number; roots_only?: boolean }): Promise<Category[]> {
    return apiClient<Category[]>("/categories", { params, skipAuth: true });
  },

  /**
   * Get single category by slug or numeric ID.
   */
  async getCategory(identifier: string): Promise<Category> {
    return apiClient<Category>(`/categories/${identifier}`, { skipAuth: true });
  },

  /**
   * List active curated collections for seasonal groupings.
   */
  async getCollections(): Promise<Collection[]> {
    return apiClient<Collection[]>("/collections", { skipAuth: true });
  },

  /**
   * Search, filter, and paginate storefront products.
   */
  async getProducts(params?: ProductQueryParams): Promise<ProductListResponse> {
    const cleanParams: Record<string, any> = { ...params };
    if (cleanParams.page_size && !cleanParams.limit) {
      cleanParams.limit = cleanParams.page_size;
      delete cleanParams.page_size;
    }
    return apiClient<ProductListResponse>("/products", { params: cleanParams, skipAuth: true });
  },

  /**
   * Retrieve single product with full variant inventory and image gallery by URL slug.
   */
  async getProductBySlug(slug: string): Promise<Product> {
    return apiClient<Product>(`/products/${slug}`, { skipAuth: true });
  },
};
