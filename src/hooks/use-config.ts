import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as configApi from '@/api/config'
import type {
  Category,
  ListingFieldSchema,
  FeeRule,
  FeatureFlag,
} from '@/types/config'

const CONFIG_KEYS = {
  summary: ['config', 'summary'] as const,
  categories: ['config', 'categories'] as const,
  schemas: (categoryId?: string) => ['config', 'schemas', categoryId ?? 'all'] as const,
  fees: ['config', 'fees'] as const,
  featureFlags: ['config', 'feature-flags'] as const,
  settings: ['config', 'settings'] as const,
} as const

/** Mock data for when API is unavailable */
function getMockCategories(): Category[] {
  return [
    {
      id: '1',
      name: 'Goods',
      slug: 'goods',
      description: 'Physical products',
      parentId: null,
      order: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Services',
      slug: 'services',
      description: 'Professional services',
      parentId: null,
      order: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]
}

function getMockSchemas(): ListingFieldSchema[] {
  return [
    {
      id: '1',
      categoryId: '1',
      key: 'title',
      label: 'Title',
      type: 'text',
      isRequired: true,
      validations: [{ type: 'required', message: 'Title is required' }],
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]
}

function getMockFeeRules(): FeeRule[] {
  return [
    {
      id: '1',
      name: 'Platform Fee',
      type: 'percentage',
      value: 5,
      appliesTo: 'transaction',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]
}

function getMockFeatureFlags(): FeatureFlag[] {
  return [
    {
      id: '1',
      key: 'reviews_enabled',
      label: 'Reviews',
      description: 'Enable buyer reviews',
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]
}

export function useConfigSummary() {
  return useQuery({
    queryKey: CONFIG_KEYS.summary,
    queryFn: async () => {
      try {
        return await configApi.fetchConfigSummary()
      } catch {
        const cats = getMockCategories()
        const schemas = getMockSchemas()
        const fees = getMockFeeRules()
        const flags = getMockFeatureFlags()
        return {
          categoriesCount: cats.length,
          schemasCount: schemas.length,
          feeRulesCount: fees.length,
          featureFlagsCount: flags.length,
        }
      }
    },
  })
}

export function useCategories() {
  return useQuery({
    queryKey: CONFIG_KEYS.categories,
    queryFn: async () => {
      try {
        return await configApi.fetchCategories()
      } catch {
        return getMockCategories()
      }
    },
  })
}

export function useCategoryMutations() {
  const qc = useQueryClient()
  const create = useMutation({
    mutationFn: configApi.createCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CONFIG_KEYS.categories })
      qc.invalidateQueries({ queryKey: CONFIG_KEYS.summary })
      toast.success('Category created')
    },
    onError: () => toast.error('Failed to create category'),
  })
  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      configApi.updateCategory(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CONFIG_KEYS.categories })
      toast.success('Category updated')
    },
    onError: () => toast.error('Failed to update category'),
  })
  const remove = useMutation({
    mutationFn: configApi.deleteCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CONFIG_KEYS.categories })
      qc.invalidateQueries({ queryKey: CONFIG_KEYS.schemas() })
      qc.invalidateQueries({ queryKey: CONFIG_KEYS.summary })
      toast.success('Category deleted')
    },
    onError: () => toast.error('Failed to delete category'),
  })
  return {
    create: create.mutateAsync,
    update: (id: string, data: Partial<Category>) => update.mutateAsync({ id, data }),
    remove: remove.mutateAsync,
    isPending: create.isPending || update.isPending || remove.isPending,
  }
}

export function useFieldSchemas(categoryId?: string) {
  return useQuery({
    queryKey: CONFIG_KEYS.schemas(categoryId),
    queryFn: async () => {
      try {
        return await configApi.fetchFieldSchemas(categoryId)
      } catch {
        return getMockSchemas().filter((s) => !categoryId || s.categoryId === categoryId)
      }
    },
  })
}

export function useFieldSchemaMutations() {
  const qc = useQueryClient()
  const create = useMutation({
    mutationFn: configApi.createFieldSchema,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CONFIG_KEYS.schemas() })
      qc.invalidateQueries({ queryKey: CONFIG_KEYS.summary })
      toast.success('Field schema created')
    },
    onError: () => toast.error('Failed to create field schema'),
  })
  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ListingFieldSchema> }) =>
      configApi.updateFieldSchema(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CONFIG_KEYS.schemas() })
      toast.success('Field schema updated')
    },
    onError: () => toast.error('Failed to update field schema'),
  })
  const remove = useMutation({
    mutationFn: configApi.deleteFieldSchema,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CONFIG_KEYS.schemas() })
      qc.invalidateQueries({ queryKey: CONFIG_KEYS.summary })
      toast.success('Field schema deleted')
    },
    onError: () => toast.error('Failed to delete field schema'),
  })
  return {
    create: create.mutateAsync,
    update: (id: string, data: Partial<ListingFieldSchema>) => update.mutateAsync({ id, data }),
    remove: remove.mutateAsync,
    isPending: create.isPending || update.isPending || remove.isPending,
  }
}

export function useFeeRules() {
  return useQuery({
    queryKey: CONFIG_KEYS.fees,
    queryFn: async () => {
      try {
        return await configApi.fetchFeeRules()
      } catch {
        return getMockFeeRules()
      }
    },
  })
}

export function useFeeRuleMutations() {
  const qc = useQueryClient()
  const create = useMutation({
    mutationFn: configApi.createFeeRule,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CONFIG_KEYS.fees })
      qc.invalidateQueries({ queryKey: CONFIG_KEYS.summary })
      qc.invalidateQueries({ queryKey: CONFIG_KEYS.settings })
      toast.success('Fee rule created')
    },
    onError: () => toast.error('Failed to create fee rule'),
  })
  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FeeRule> }) =>
      configApi.updateFeeRule(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CONFIG_KEYS.fees })
      qc.invalidateQueries({ queryKey: CONFIG_KEYS.settings })
      toast.success('Fee rule updated')
    },
    onError: () => toast.error('Failed to update fee rule'),
  })
  const remove = useMutation({
    mutationFn: configApi.deleteFeeRule,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CONFIG_KEYS.fees })
      qc.invalidateQueries({ queryKey: CONFIG_KEYS.summary })
      qc.invalidateQueries({ queryKey: CONFIG_KEYS.settings })
      toast.success('Fee rule deleted')
    },
    onError: () => toast.error('Failed to delete fee rule'),
  })
  return {
    create: create.mutateAsync,
    update: (id: string, data: Partial<FeeRule>) => update.mutateAsync({ id, data }),
    remove: remove.mutateAsync,
    isPending: create.isPending || update.isPending || remove.isPending,
  }
}

export function useFeatureFlags() {
  return useQuery({
    queryKey: CONFIG_KEYS.featureFlags,
    queryFn: async () => {
      try {
        return await configApi.fetchFeatureFlags()
      } catch {
        return getMockFeatureFlags()
      }
    },
  })
}

export function useFeatureFlagMutations() {
  const qc = useQueryClient()
  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FeatureFlag> }) =>
      configApi.updateFeatureFlag(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CONFIG_KEYS.featureFlags })
      qc.invalidateQueries({ queryKey: CONFIG_KEYS.summary })
      qc.invalidateQueries({ queryKey: CONFIG_KEYS.settings })
      toast.success('Feature flag updated')
    },
    onError: () => toast.error('Failed to update feature flag'),
  })
  return {
    update: (id: string, data: Partial<FeatureFlag>) => update.mutateAsync({ id, data }),
    isPending: update.isPending,
  }
}

export function useMarketplaceSettings() {
  return useQuery({
    queryKey: CONFIG_KEYS.settings,
    queryFn: async () => {
      try {
        return await configApi.fetchMarketplaceSettings()
      } catch {
        return {
          siteName: 'Marketplace',
          currency: 'USD',
          fees: getMockFeeRules(),
          featureFlags: getMockFeatureFlags(),
        }
      }
    },
  })
}

export function useMarketplaceSettingsMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: configApi.updateMarketplaceSettings,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CONFIG_KEYS.settings })
      toast.success('Settings updated')
    },
    onError: () => toast.error('Failed to update settings'),
  })
}

/** Alias for marketplace-settings page compatibility */
export function useMarketplaceSettingsMutations() {
  const mutation = useMarketplaceSettingsMutation()
  return {
    update: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}
