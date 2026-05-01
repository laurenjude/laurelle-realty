import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const PAGE_SIZE = 12

export function useProperties(filters = {}, page = 1) {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalCount, setTotalCount] = useState(0)

  const filtersKey = JSON.stringify(filters)

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .eq('status', 'available')

      if (filters.listingType) query = query.eq('listing_type', filters.listingType)
      if (filters.propertyType) query = query.eq('property_type', filters.propertyType)
      if (filters.location) query = query.ilike('location', `%${filters.location}%`)
      if (filters.minPrice) query = query.gte('price', Number(filters.minPrice))
      if (filters.maxPrice) query = query.lte('price', Number(filters.maxPrice))
      if (filters.bedrooms) query = query.gte('bedrooms', Number(filters.bedrooms))
      if (filters.bathrooms) query = query.gte('bathrooms', Number(filters.bathrooms))
      if (filters.featured) query = query.eq('featured', true)

      if (filters.sortBy === 'price_asc') {
        query = query.order('price', { ascending: true })
      } else if (filters.sortBy === 'price_desc') {
        query = query.order('price', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const from = (page - 1) * PAGE_SIZE
      query = query.range(from, from + PAGE_SIZE - 1)

      const { data, error: err, count } = await query

      if (err) throw err

      setProperties(data || [])
      setTotalCount(count || 0)
    } catch (err) {
      console.error('useProperties error:', err)
      setError('Failed to load properties. Please try again.')
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, page])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return { properties, loading, error, totalCount, totalPages, refetch: fetchProperties }
}

export function useProperty(id) {
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    let cancelled = false

    async function fetchProperty() {
      setLoading(true)
      setError(null)

      try {
        const { data, error: err } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single()

        if (err) throw err
        if (!cancelled) setProperty(data)
      } catch (err) {
        console.error('useProperty error:', err)
        if (!cancelled) setError('Failed to load property details. Please try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchProperty()
    return () => { cancelled = true }
  }, [id])

  return { property, loading, error }
}
