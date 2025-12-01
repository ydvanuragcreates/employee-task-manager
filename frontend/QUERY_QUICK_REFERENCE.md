# TanStack Query Quick Reference

## Import Hooks

```javascript
import { 
  useEmployees, 
  useCreateEmployee, 
  useUpdateEmployee, 
  useDeleteEmployee 
} from '../hooks/useEmployees'
```

## Fetch Data

```javascript
const { 
  data: employees = [],  // Data with default value
  isLoading,             // Initial loading state
  isFetching,            // Background refetch state
  isError,               // Error state
  error,                 // Error object
  refetch                // Manual refetch function
} = useEmployees()
```

## Create/Update/Delete

```javascript
const createEmployee = useCreateEmployee()
const updateEmployee = useUpdateEmployee()
const deleteEmployee = useDeleteEmployee()

// Check if mutation is in progress
const isMutating = createEmployee.isPending || 
                   updateEmployee.isPending || 
                   deleteEmployee.isPending
```

## Usage Examples

### Create
```javascript
try {
  await createEmployee.mutateAsync({ name, email, role })
  // Success - cache automatically updated!
} catch (error) {
  // Handle error
}
```

### Update
```javascript
await updateEmployee.mutateAsync({
  id: employeeId,
  data: { name, email, role }
})
```

### Delete
```javascript
await deleteEmployee.mutateAsync(employeeId)
```

## Key Features

| Feature | Value | Description |
|---------|-------|-------------|
| `staleTime` | 5000ms | Data cached for 5 seconds |
| `refetchOnWindowFocus` | true | Auto-refetch on tab focus |
| `retry` | 2 | Retry failed requests twice |
| `refetchOnReconnect` | true | Refetch when internet reconnects |

## Common Patterns

### Loading State
```javascript
{isLoading && <Skeleton />}
{!isLoading && <DataTable data={employees} />}
```

### Error Handling
```javascript
if (isError) {
  return <ErrorMessage error={error} />
}
```

### Disable Actions During Mutation
```javascript
<button disabled={isMutating}>
  {isMutating ? 'Saving...' : 'Save'}
</button>
```

## React Query Devtools

Press the React Query icon in the bottom-right corner to:
- View all queries and their states
- See cached data
- Manually trigger refetches
- Debug query behavior

## Cache Invalidation

Happens automatically after mutations:
- ✅ Create employee → Invalidates employee list
- ✅ Update employee → Invalidates list + specific employee
- ✅ Delete employee → Invalidates employee list

No manual `refetch()` needed!
