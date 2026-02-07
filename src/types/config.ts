/** Configuration Layer & Schema Builder types */

/** Category in the taxonomy */
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId: string | null
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/** Category with nested children */
export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[]
}

/** Field type for listing schema */
export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'currency'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'date'
  | 'url'
  | 'email'
  | 'phone'
  | 'image'

/** Validation rule for a field */
export interface FieldValidation {
  type: 'required' | 'min' | 'max' | 'pattern' | 'email' | 'url'
  value?: string | number
  message?: string
}

/** Conditional logic for field visibility */
export interface ConditionalRule {
  fieldId: string
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan'
  value: string | number | boolean
}

/** Listing field schema definition */
export interface ListingFieldSchema {
  id: string
  categoryId: string
  key: string
  label: string
  type: FieldType
  placeholder?: string
  description?: string
  isRequired: boolean
  validations: FieldValidation[]
  conditionalRules?: ConditionalRule[]
  options?: readonly { value: string; label: string }[]
  order: number
  createdAt: string
  updatedAt: string
}

/** Fee rule for marketplace */
export interface FeeRule {
  id: string
  name: string
  type: 'percentage' | 'fixed' | 'tiered'
  value: number
  appliesTo?: 'listing' | 'transaction' | 'subscription'
  categoryId?: string
  minAmount?: number
  maxAmount?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/** Feature flag for marketplace */
export interface FeatureFlag {
  id: string
  key: string
  label: string
  description?: string
  isEnabled: boolean
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

/** Marketplace settings summary */
export interface MarketplaceSettings {
  siteName: string
  currency: string
  fees: FeeRule[]
  featureFlags: FeatureFlag[]
}

/** Config console summary for dashboard */
export interface ConfigSummary {
  categoriesCount: number
  schemasCount: number
  feeRulesCount: number
  featureFlagsCount: number
}
