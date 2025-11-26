import { UserPlus, Search } from 'lucide-react'

function EmptyState({ type = 'no-data', onAction, searchQuery }) {
  if (type === 'search') {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No results found
        </h3>
        <p className="text-gray-600 mb-1">
          No employees match "{searchQuery}"
        </p>
        <p className="text-sm text-gray-500">
          Try adjusting your search terms
        </p>
      </div>
    )
  }

  return (
    <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
      <div className="flex justify-center mb-4">
        <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
          <UserPlus className="h-10 w-10 text-blue-600" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No employees yet
      </h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        Get started by adding your first employee to the system
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm transition-all"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add Your First Employee
        </button>
      )}
    </div>
  )
}

export default EmptyState
