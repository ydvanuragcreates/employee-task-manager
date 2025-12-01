# TanStack Query (React Query) Implementation Guide

## Overview

This project now uses **TanStack Query v5** for production-grade data fetching and state management. This replaces manual `useEffect` and `useState` patterns with a more robust, cacheable, and optimized solution.

## Key Features Implemented

### 1. **Automatic Caching**
- Data is cached for **5 seconds** (`staleTime: 5000`)
- Reduces unnecessary API calls
- Improves performance and user experience

### 2. **Smart Refetching**
- **Window Focus**: Automatically refetches when you switch back to the tab
- **Reconnection**: Refetches when internet connection is restored
- **Manual Invalidation**: Updates cache when mutations succeed

### 3. **Optimistic Updates**
- Mutations automatically invalidate related queries
- UI updates immediately after successful operations
- No need for manual `fetchEmployees()` calls

### 4. **Built-in Loading & Error States**
- `isLoading`: Initial data fetch
- `isFetching`: Background refetch
- `isError`: Error handling
- `isPending`: Mutation in progress

### 5. **Developer Tools**
- React Query Devtools included (bottom-right corner in dev mode)
- Visualize cache, queries, and mutations in real-time

## Project Structure

```
frontend/src/
├── hooks/
│   ├── useEmployees.js    # Employee data hooks
│   └── useTasks.js         # Task data hooks
├── main.jsx                # QueryClientProvider setup
└── components/
    └── EmployeeTable.jsx   # Refactored with TanStack Query
```

## Configuration

### QueryClient Setup (main.jsx)

```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,              // Cache for 5 seconds
      refetchOnWindowFocus: true,   // Refetch on tab focus
      retry: 2,                     // Retry failed requests twice
      refetchOnReconnect: true,     // Refetch on reconnect
    },
    mutations: {
      retry: 1,                     // Retry failed mutations once
    },
  },
})
```

## Custom Hooks

### Employee Hooks (`useEmployees.js`)

#### 1. `useEmployees()` - Fetch all employees
```javascript
const { data: employees, isLoading, isError, error } = useEmployees()
```

**Returns:**
- `data`: Array of employees (defaults to `[]`)
- `isLoading`: `true` during initial fetch
- `isFetching`: `true` during background refetch
- `isError`: `true` if request failed
- `error`: Error object if failed

#### 2. `useCreateEmployee()` - Create new employee
```javascript
const createEmployee = useCreateEmployee()

// Usage
await createEmployee.mutateAsync({ name, email, role })
```

**Features:**
- Automatically invalidates employee cache on success
- Returns promise for async/await usage
- `isPending`: `true` while mutation is in progress

#### 3. `useUpdateEmployee()` - Update employee
```javascript
const updateEmployee = useUpdateEmployee()

// Usage
await updateEmployee.mutateAsync({ id, data: { name, email, role } })
```

#### 4. `useDeleteEmployee()` - Delete employee
```javascript
const deleteEmployee = useDeleteEmployee()

// Usage
await deleteEmployee.mutateAsync(employeeId)
```

### Task Hooks (`useTasks.js`)

Similar hooks available for tasks:
- `useTasks()`
- `useCreateTask()`
- `useUpdateTask()`
- `useDeleteTask()`

## Migration from Old Pattern

### Before (Manual State Management)
```javascript
const [employees, setEmployees] = useState([])
const [loading, setLoading] = useState(false)

useEffect(() => {
  fetchEmployees()
}, [])

const fetchEmployees = async () => {
  setLoading(true)
  try {
    const response = await employeeAPI.getAll()
    setEmployees(response.data)
  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false)
  }
}

const handleCreate = async (data) => {
  await employeeAPI.create(data)
  fetchEmployees() // Manual refetch
}
```

### After (TanStack Query)
```javascript
const { data: employees = [], isLoading } = useEmployees()
const createEmployee = useCreateEmployee()

const handleCreate = async (data) => {
  await createEmployee.mutateAsync(data)
  // Cache automatically invalidated - no manual refetch needed!
}
```

## Benefits

### 1. **Less Boilerplate**
- No manual `useState` for data, loading, error
- No manual `useEffect` for fetching
- No manual refetch calls after mutations

### 2. **Better Performance**
- Automatic caching reduces API calls
- Background refetching keeps data fresh
- Deduplication of simultaneous requests

### 3. **Better UX**
- Instant updates after mutations
- Auto-refresh when switching tabs
- Optimistic updates possible

### 4. **Better DX**
- React Query Devtools for debugging
- TypeScript support (if needed)
- Centralized query configuration

## Testing the Implementation

### 1. **Cache Behavior**
1. Load the employees page
2. Wait 5 seconds
3. Switch to another tab and back
4. Notice: Data refetches automatically

### 2. **Mutation Invalidation**
1. Add a new employee
2. Notice: Table updates immediately without page reload
3. Check React Query Devtools: See cache invalidation

### 3. **Loading States**
1. Open React Query Devtools (bottom-right)
2. Perform actions
3. Watch queries transition: `fetching` → `success` → `stale`

## React Query Devtools

Access the devtools in development mode:
- **Location**: Bottom-right corner
- **Toggle**: Click the React Query icon
- **Features**:
  - View all queries and their states
  - See cached data
  - Manually refetch or invalidate
  - Monitor mutations

## Advanced Usage

### Optimistic Updates (Future Enhancement)
```javascript
export function useUpdateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await employeeAPI.update(id, data)
      return response.data
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: employeeKeys.all })
      
      // Snapshot previous value
      const previousEmployees = queryClient.getQueryData(employeeKeys.all)
      
      // Optimistically update
      queryClient.setQueryData(employeeKeys.all, (old) =>
        old.map((emp) => (emp.id === id ? { ...emp, ...data } : emp))
      )
      
      return { previousEmployees }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(employeeKeys.all, context.previousEmployees)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
    },
  })
}
```

### Pagination (Future Enhancement)
```javascript
export function useEmployees(page = 1) {
  return useQuery({
    queryKey: [...employeeKeys.all, page],
    queryFn: async () => {
      const response = await employeeAPI.getAll({ page })
      return response.data
    },
    keepPreviousData: true, // Keep old data while fetching new page
  })
}
```

## Troubleshooting

### Data not updating after mutation
- Check if `invalidateQueries` is called in mutation's `onSuccess`
- Verify query keys match between query and invalidation

### Too many refetches
- Adjust `staleTime` (increase for less frequent refetches)
- Set `refetchOnWindowFocus: false` if not needed

### Cache not working
- Ensure query keys are consistent
- Check React Query Devtools to see cache state

## Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Query Devtools](https://tanstack.com/query/latest/docs/react/devtools)
- [Query Keys Guide](https://tanstack.com/query/latest/docs/react/guides/query-keys)

## Next Steps

1. ✅ Employees implemented with TanStack Query
2. 🔄 Refactor TaskBoard component to use `useTasks` hooks
3. 🔄 Add optimistic updates for better UX
4. 🔄 Implement pagination if needed
5. 🔄 Add infinite scroll for large datasets
