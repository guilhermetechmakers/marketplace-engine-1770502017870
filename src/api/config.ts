import { api } from '@/lib/api'
import type {
  Category,
  ListingFieldSchema,
  FeeRule,
  FeatureFlag,
  MarketplaceSettings,
  ConfigSummary,
} from '@/types/config'

/** Fetch config summary */
export async function fetchConfigSummary(): Promise<ConfigSummary> {
  return api.get<ConfigSummary>('/config/summary')
}

/** Categories */
export async function fetchCategories(): Promise<Category[]> {
  return api.get<Category[]>('/config/categories')
}

export async function createCategory(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
  return api.post<Category>('/config/categories', data)
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category> {
  return api.patch<Category>(`/config/categories/${id}`, data)
}

export async function deleteCategory(id: string): Promise<void> {
  return api.delete(`/config/categories/${id}`)
}

/** Listing field schemas */
export async function fetchFieldSchemas(categoryId?: string): Promise<ListingFieldSchema[]> {
  const q = categoryId ? `?categoryId=${categoryId}` : ''
  return api.get<ListingFieldSchema[]>(`/config/schemas${q}`)
}

export async function createFieldSchema(
  data: Omit<ListingFieldSchema, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ListingFieldSchema> {
  return api.post<ListingFieldSchema>('/config/schemas', data)
}

export async function updateFieldSchema(
  id: string,
  data: Partial<ListingFieldSchema>
): Promise<ListingFieldSchema> {
  return api.patch<ListingFieldSchema>(`/config/schemas/${id}`, data)
}

export async function deleteFieldSchema(id: string): Promise<void> {
  return api.delete(`/config/schemas/${id}`)
}

/** Fee rules */
export async function fetchFeeRules(): Promise<FeeRule[]> {
  return api.get<FeeRule[]>('/config/fees')
}

export async function createFeeRule(data: Omit<FeeRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<FeeRule> {
  return api.post<FeeRule>('/config/fees', data)
}

export async function updateFeeRule(id: string, data: Partial<FeeRule>): Promise<FeeRule> {
  return api.patch<FeeRule>(`/config/fees/${id}`, data)
}

export async function deleteFeeRule(id: string): Promise<void> {
  return api.delete(`/config/fees/${id}`)
}

/** Feature flags */
export async function fetchFeatureFlags(): Promise<FeatureFlag[]> {
  return api.get<FeatureFlag[]>('/config/feature-flags')
}

export async function updateFeatureFlag(id: string, data: Partial<FeatureFlag>): Promise<FeatureFlag> {
  return api.patch<FeatureFlag>(`/config/feature-flags/${id}`, data)
}

/** Marketplace settings */
export async function fetchMarketplaceSettings(): Promise<MarketplaceSettings> {
  return api.get<MarketplaceSettings>('/config/settings')
}

export async function updateMarketplaceSettings(data: Partial<MarketplaceSettings>): Promise<MarketplaceSettings> {
  return api.patch<MarketplaceSettings>('/config/settings', data)
}
