import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Pencil, Trash2, Plus, Award } from 'lucide-react'
import TableSkeleton from './TableSkeleton'
import EmptyState from './EmptyState'
import { 
  useEmployees, 
  useCreateEmployee, 
  useUpdateEmployee, 
  useDeleteEmployee 
} from '../hooks/useEmployees'
import { useTasks } from '../hooks/useTasks'

function EmployeeTable() {
  // TanStack Query hooks - replaces manual useEffect and state management
  const { data: employees = [], isLoading, isError, error } = useEmployees()
  const { data: tasks = [] } = useTasks()
  const createEmployee = useCreateEmployee()
  const updateEmployee = useUpdateEmployee()
  const deleteEmployee = useDeleteEmployee()

  // Calculate completed tasks per employee
  const employeeStats = useMemo(() => {
    const stats = {}
    employees.forEach(emp => {
      const completedTasks = tasks.filter(
        task => task.employee_id === emp.id && task.status === 'completed'
      ).length
      stats[emp.id] = completedTasks
    })
    return stats
  }, [employees, tasks])

  // Check if employee is a top performer (>5 completed tasks)
  const isTopPerformer = (employeeId) => {
    return employeeStats[employeeId] > 5
  }

  // Local UI state
  const [showModal, setShowModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', role: '' })
  const [searchQuery, setSearchQuery] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingEmployee) {
        // Update existing employee
        await updateEmployee.mutateAsync({
          id: editingEmployee.id,
          data: formData
        })
      } else {
        // Create new employee
        await createEmployee.mutateAsync(formData)
      }
      closeModal()
    } catch (error) {
      console.error('Error saving employee:', error)
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to save employee'
      const statusCode = error.response?.status
      
      if (statusCode === 401) {
        alert('Authentication error. Please sign out and sign in again.')
      } else if (statusCode === 403) {
        alert('Permission denied. You do not have access to this resource.')
      } else {
        alert(`Error: ${errorMsg}`)
      }
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this employee?')) return
    
    try {
      await deleteEmployee.mutateAsync(id)
    } catch (error) {
      console.error('Error deleting employee:', error)
      alert('Failed to delete employee')
    }
  }

  const openModal = (employee = null) => {
    setEditingEmployee(employee)
    setFormData(employee || { name: '', email: '', role: '' })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingEmployee(null)
    setFormData({ name: '', email: '', role: '' })
  }

  // Filter employees based on search query
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Check if any mutation is in progress
  const isMutating = createEmployee.isPending || updateEmployee.isPending || deleteEmployee.isPending

  // Handle error state
  if (isError) {
    return (
      <div className="animate-fadeIn">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            ❌ Error loading employees: {error?.message || 'Unknown error'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Reload page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      {/* Header Area with Title, Search, and Add Button */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Employees
            {/* Show loading indicator when refetching in background */}
            {isLoading && (
              <span className="ml-2 text-sm text-gray-500">(Loading...)</span>
            )}
          </h2>
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
          </div>
        </div>
        
        {/* Add Employee Button */}
        <button
          onClick={() => openModal()}
          disabled={isMutating}
          className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Employee
        </button>
      </div>

      {/* Loading State - Show Skeleton */}
      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : employees.length === 0 && !searchQuery ? (
        /* Empty State - No Employees */
        <EmptyState type="no-data" onAction={() => openModal()} />
      ) : filteredEmployees.length === 0 && searchQuery ? (
        /* Empty State - No Search Results */
        <EmptyState type="search" searchQuery={searchQuery} />
      ) : (
        /* Professional Data Grid */
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee, index) => (
                  <motion.tr
                    key={employee.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.05,
                      ease: "easeOut"
                    }}
                    whileHover={{ 
                      scale: 1.01,
                      transition: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        {isTopPerformer(employee.id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold rounded-full shadow-sm"
                            title={`${employeeStats[employee.id]} completed tasks`}
                          >
                            <Award className="h-3 w-3" />
                            <span>Top Performer</span>
                          </motion.div>
                        )}
                      </div>
                      {isTopPerformer(employee.id) && (
                        <div className="text-xs text-gray-500 mt-1">
                          {employeeStats[employee.id]} tasks completed
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{employee.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                        {employee.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => openModal(employee)}
                          disabled={isMutating}
                          className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit employee"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(employee.id)}
                          disabled={isMutating}
                          className="inline-flex items-center text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete employee"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto"
            onClick={closeModal}
          >
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
              >
            <h3 className="text-lg font-semibold mb-4">
              {editingEmployee ? 'Edit Employee' : 'Add Employee'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isMutating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isMutating ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EmployeeTable
