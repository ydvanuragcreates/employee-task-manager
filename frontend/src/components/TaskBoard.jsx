import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { taskAPI, employeeAPI } from '../api/api'

function TaskBoard() {
  const [tasks, setTasks] = useState([])
  const [employees, setEmployees] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    employee_id: null
  })
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    fetchTasks()
    fetchEmployees()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getAll()
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      alert('Failed to fetch tasks')
    }
  }

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll()
      setEmployees(response.data)
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  const handleAIGenerate = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a task title first')
      return
    }
    
    setAiLoading(true)
    try {
      const response = await taskAPI.generateDescription(formData.title)
      setFormData({ ...formData, description: response.data.description })
    } catch (error) {
      console.error('Error generating description:', error)
      alert(error.response?.data?.detail || 'Failed to generate description')
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const employeeId = formData.employee_id === '' || formData.employee_id === null 
        ? null 
        : parseInt(formData.employee_id)
      
      const submitData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        employee_id: employeeId
      }
      
      if (editingTask) {
        await taskAPI.update(editingTask.id, submitData)
      } else {
        await taskAPI.create(submitData)
      }
      fetchTasks()
      closeModal()
    } catch (error) {
      console.error('Error saving task:', error)
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to save task'
      alert(`Error: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    try {
      await taskAPI.delete(id)
      fetchTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
      alert('Failed to delete task')
    }
  }

  const openModal = (task = null) => {
    setEditingTask(task)
    setFormData(task || { title: '', description: '', status: 'todo', employee_id: null })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingTask(null)
    setFormData({ title: '', description: '', status: 'todo', employee_id: null })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'todo': return 'To Do'
      case 'in_progress': return 'In Progress'
      case 'completed': return 'Completed'
      default: return status
    }
  }

  const groupedTasks = {
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed')
  }

  return (
    <div className="animate-fadeIn">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Task Board</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(groupedTasks).map(([status, statusTasks]) => (
          <div key={status} className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-lg mb-4 text-gray-700">
              {getStatusLabel(status)} ({statusTasks.length})
            </h3>
            <div className="space-y-3">
              {statusTasks.map((task, index) => (
                <motion.div
                  key={task.id}
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
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                  {task.employee && (
                    <div className="text-xs text-gray-500 mb-3">
                      Assigned to: {task.employee.name}
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                      {getStatusLabel(task.status)}
                    </span>
                    <div className="space-x-2">
                      <button
                        onClick={() => openModal(task)}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {statusTasks.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No tasks
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

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
                className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl"
              >
            <h3 className="text-lg font-semibold mb-4">
              {editingTask ? 'Edit Task' : 'Add Task'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <button
                    type="button"
                    onClick={handleAIGenerate}
                    disabled={aiLoading || !formData.title.trim()}
                    className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <span>✨</span>
                    <span>{aiLoading ? 'Generating...' : 'AI Assistant'}</span>
                  </button>
                </div>
                <textarea
                  required
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task description or use AI Assistant"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to Employee
                </label>
                <select
                  value={formData.employee_id || ''}
                  onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Unassigned</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} - {emp.role}
                    </option>
                  ))}
                </select>
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
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
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

export default TaskBoard
