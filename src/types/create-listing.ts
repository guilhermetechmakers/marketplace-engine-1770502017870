/** Create listing page types */

export interface CreateListingPage {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

/** Form data for creating/editing a listing */
export interface CreateListingFormData {
  categoryId: string
  title: string
  description?: string
  price?: number
  currency?: string
  [key: string]: unknown
}
