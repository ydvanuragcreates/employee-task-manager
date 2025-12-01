import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { employeeAPI } from '../api/api'

// Query key factory for better organization
export const employeeKeys = {
  all: ['employees'],
  detail: (id) => ['employees', id],
}

/**
 * Custom hook to fetch all employees
 * Features:
 * - Caches data for 5 seconds (staleTime)
 * - Auto-refetches when window regains focus
 * - Automatic retry on failure
 */
export function useEmployees() {
  return useQuery({
    queryKey: employeeKeys.all,
    queryFn: async () => {
      const response = await employeeAPI.getAll()
      return response.data
    },
    staleTime: 5000, // Cache for 5 seconds
    refetchOnWindowFocus: true, // Auto-update when tab is focused
    retry: 2, // Retry failed requests twice
  })
}

/**
 * Custom hook to fetch a single employee by ID
 */
export function useEmployee(id) {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: async () => {
      const response = await employeeAPI.getById(id)
      return response.data
    },
    enabled: !!id, // Only run if ID exists
    staleTime: 5000,
  })
}

/**
 * Custom hook to create a new employee
 * Automatically invalidates the employees cache on success
 */
export function useCreateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (employeeData) => {
      const response = await employeeAPI.create(employeeData)
      return response.data
    },
    onSuccess: () => {
      // Invalidate and refetch employees list
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
    },
    onError: (error) => {
      console.error('Error creating employee:', error)
    },
  })
}

/**
 * Custom hook to update an employee
 * Automatically invalidates the employees cache on success
 */
export function useUpdateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await employeeAPI.update(id, data)
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate both the list and the specific employee
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(data.id) })
    },
    onError: (error) => {
      console.error('Error updating employee:', error)
    },
  })
}

/**
 * Custom hook to delete an employee
 * Automatically invalidates the employees cache on success
 */
export function useDeleteEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      await employeeAPI.delete(id)
      return id
    },
    onSuccess: () => {
      // Invalidate employees list
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
    },
    onError: (error) => {
      console.error('Error deleting employee:', error)
    },
  })
}
