import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskAPI } from '../api/api'

// Query key factory for tasks
export const taskKeys = {
  all: ['tasks'],
  detail: (id) => ['tasks', id],
}

/**
 * Custom hook to fetch all tasks
 */
export function useTasks() {
  return useQuery({
    queryKey: taskKeys.all,
    queryFn: async () => {
      const response = await taskAPI.getAll()
      return response.data
    },
    staleTime: 5000,
    refetchOnWindowFocus: true,
    retry: 2,
  })
}

/**
 * Custom hook to fetch a single task by ID
 */
export function useTask(id) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: async () => {
      const response = await taskAPI.getById(id)
      return response.data
    },
    enabled: !!id,
    staleTime: 5000,
  })
}

/**
 * Custom hook to create a new task
 */
export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (taskData) => {
      const response = await taskAPI.create(taskData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
    onError: (error) => {
      console.error('Error creating task:', error)
    },
  })
}

/**
 * Custom hook to update a task
 */
export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await taskAPI.update(id, data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(data.id) })
    },
    onError: (error) => {
      console.error('Error updating task:', error)
    },
  })
}

/**
 * Custom hook to delete a task
 */
export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      await taskAPI.delete(id)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
    onError: (error) => {
      console.error('Error deleting task:', error)
    },
  })
}
