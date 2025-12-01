# TanStack Query Migration Checklist

## ✅ Completed

### Setup
- [x] Install `@tanstack/react-query`
- [x] Install `@tanstack/react-query-devtools`
- [x] Create QueryClient in `main.jsx`
- [x] Wrap app with `QueryClientProvider`
- [x] Add React Query Devtools

### Employee Management
- [x] Create `useEmployees` hook
- [x] Create `useCreateEmployee` mutation
- [x] Create `useUpdateEmployee` mutation
- [x] Create `useDeleteEmployee` mutation
- [x] Refactor `EmployeeTable.jsx` to use hooks
- [x] Remove manual `useEffect` and `useState`
- [x] Add automatic cache invalidation
- [x] Add loading/error states
- [x] Disable buttons during mutations

### Documentation
- [x] Create comprehensive guide
- [x] Create quick reference
- [x] Create upgrade summary
- [x] Add code examples

## 🔄 Optional Next Steps

### Task Management
- [ ] Refactor `TaskBoard.jsx` to use `useTasks` hooks
- [ ] Remove manual data fetching from TaskBoard
- [ ] Test task mutations with cache invalidation

### Advanced Features
- [ ] Add optimistic updates for instant UI feedback
- [ ] Implement pagination for large datasets
- [ ] Add infinite scroll if needed
- [ ] Cache search/filter results separately

### Performance Optimization
- [ ] Adjust `staleTime` based on data freshness needs
- [ ] Configure `cacheTime` for memory management
- [ ] Add `select` option to transform data
- [ ] Implement prefetching for better UX

### Error Handling
- [ ] Add global error boundary
- [ ] Implement retry logic customization
- [ ] Add toast notifications for errors
- [ ] Log errors to monitoring service

### Testing
- [ ] Test cache behavior (5-second stale time)
- [ ] Test window focus refetch
- [ ] Test mutation invalidation
- [ ] Test error scenarios
- [ ] Test loading states

## Testing Instructions

### 1. Cache Behavior Test
```
1. Open employees page
2. Note the data
3. Wait 5+ seconds
4. Switch to another tab
5. Switch back to app
6. Verify: Data refetches automatically
```

### 2. Mutation Test
```
1. Add a new employee
2. Verify: Table updates without reload
3. Edit an employee
4. Verify: Changes appear instantly
5. Delete an employee
6. Verify: Removed from list immediately
```

### 3. Devtools Test
```
1. Open React Query Devtools (bottom-right)
2. Perform CRUD operations
3. Watch queries change state:
   - fetching → success → stale
4. See cache invalidation in real-time
```

### 4. Error Handling Test
```
1. Stop the backend server
2. Try to add an employee
3. Verify: Error message appears
4. Verify: Retry logic works
5. Restart backend
6. Verify: Auto-reconnect works
```

### 5. Loading State Test
```
1. Throttle network (Chrome DevTools)
2. Reload page
3. Verify: Loading skeleton appears
4. Verify: Data loads after delay
5. Verify: Buttons disabled during mutations
```

## Rollback Plan (If Needed)

If issues arise, you can rollback:

1. **Restore old EmployeeTable.jsx**:
   ```bash
   git checkout HEAD~1 frontend/src/components/EmployeeTable.jsx
   ```

2. **Remove TanStack Query**:
   ```bash
   npm uninstall @tanstack/react-query @tanstack/react-query-devtools
   ```

3. **Restore old main.jsx**:
   ```bash
   git checkout HEAD~1 frontend/src/main.jsx
   ```

4. **Delete hooks**:
   ```bash
   rm -rf frontend/src/hooks
   ```

## Success Criteria

✅ All tests pass
✅ No console errors
✅ Data fetches correctly
✅ Mutations work and update cache
✅ Loading states display properly
✅ Error handling works
✅ Devtools show correct state
✅ Performance improved (fewer API calls)

## Support

If you encounter issues:
1. Check React Query Devtools for query state
2. Check browser console for errors
3. Review `TANSTACK_QUERY_GUIDE.md`
4. Check [TanStack Query Docs](https://tanstack.com/query/latest)

## Notes

- **Stale Time**: 5 seconds (adjust if needed)
- **Retry Count**: 2 for queries, 1 for mutations
- **Devtools**: Only visible in development mode
- **Cache**: Automatically managed by React Query
