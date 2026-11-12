/**
 * Storefront Shopping Cart & Wishlist API
 */

import { apiClient } from "./client";
import {
  AddToCartRequest,
  CartResponse,
  MergeCartRequest,
  UpdateCartItemRequest,
  WishlistResponse,
} from "./types";

export const cartApi = {
  /**
   * Retrieve active cart with server-verified prices, inventory limits, and free delivery status.
   */
  async getCart(): Promise<CartResponse> {
    return apiClient<CartResponse>("/cart");
  },

  /**
   * Add a product variant to the cart.
   */
  async addToCart(variantId: number, quantity: number = 1): Promise<CartResponse> {
    const payload: AddToCartRequest = { variant_id: variantId, quantity };
    return apiClient<CartResponse>("/cart/items", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update line-item quantity in cart.
   */
  async updateCartItem(itemId: number, quantity: number): Promise<CartResponse> {
    const payload: UpdateCartItemRequest = { quantity };
    return apiClient<CartResponse>(`/cart/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Remove item from cart.
   */
  async removeCartItem(itemId: number): Promise<CartResponse> {
    return apiClient<CartResponse>(`/cart/items/${itemId}`, {
      method: "DELETE",
    });
  },

  /**
   * Clear all items from cart.
   */
  async clearCart(): Promise<CartResponse> {
    return apiClient<CartResponse>("/cart", {
      method: "DELETE",
    });
  },

  /**
   * Merge anonymous guest cart into authenticated customer account on login.
   */
  async mergeCart(anonymousToken: string): Promise<CartResponse> {
    const payload: MergeCartRequest = { anonymous_token: anonymousToken };
    return apiClient<CartResponse>("/cart/merge", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // -------------------------------------------------------------------------
  // Wishlist API
  // -------------------------------------------------------------------------

  /**
   * Retrieve authenticated customer wishlist.
   */
  async getWishlist(): Promise<WishlistResponse> {
    return apiClient<WishlistResponse>("/wishlist");
  },

  /**
   * Add product to customer wishlist.
   */
  async addToWishlist(productId: number): Promise<WishlistResponse> {
    return apiClient<WishlistResponse>("/wishlist/items", {
      method: "POST",
      body: JSON.stringify({ product_id: productId }),
    });
  },

  /**
   * Remove product from customer wishlist.
   */
  async removeFromWishlist(productId: number): Promise<WishlistResponse> {
    return apiClient<WishlistResponse>(`/wishlist/items/${productId}`, {
      method: "DELETE",
    });
  },

  /**
   * Empty customer wishlist.
   */
  async clearWishlist(): Promise<WishlistResponse> {
    return apiClient<WishlistResponse>("/wishlist", {
      method: "DELETE",
    });
  },
};
