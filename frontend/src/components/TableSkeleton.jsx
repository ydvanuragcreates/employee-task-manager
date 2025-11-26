function TableSkeleton({ rows = 5 }) {
  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">
                <div className="h-3 bg-gray-300 rounded w-16 animate-pulse"></div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="h-3 bg-gray-300 rounded w-20 animate-pulse"></div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="h-3 bg-gray-300 rounded w-12 animate-pulse"></div>
              </th>
              <th className="px-6 py-4 text-right">
                <div className="h-3 bg-gray-300 rounded w-16 ml-auto animate-pulse"></div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(rows)].map((_, index) => (
              <tr key={index} className="animate-pulse">
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TableSkeleton
