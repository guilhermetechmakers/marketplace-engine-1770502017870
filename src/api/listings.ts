import { api } from '@/lib/api'
import type { Listing } from '@/types/listings'

export async function fetchListingById(id: string): Promise<Listing> {
  return api.get<Listing>(`/listings/${id}`)
}
