import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { CheckCircle2, Clock, TrendingUp, Users, ListTodo, Target } from 'lucide-react'
import { useEmployees } from '../hooks/useEmployees'
import { useTasks } from '../hooks/useTasks'

function DashboardStats() {
  const { data: employees = [], isLoading: employeesLoading } = useEmployees()
  const { data: tasks = [], isLoading: tasksLoading } = useTasks()

  // Calculate statistics
  const stats = useMemo(() => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.status === 'completed').length
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length
    const todoTasks = tasks.filter(t => t.status === 'todo').length
    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0

    // Task status distribution for pie chart
    const statusDistribution = [
      { name: 'To Do', value: todoTasks, color: '#3B82F6' },
      { name: 'In Progress', value: inProgressTasks, color: '#F59E0B' },
      { name: 'Completed', value: completedTasks, color: '#10B981' },
    ].filter(item => item.value > 0)

    // Top performers - tasks per employee
    const employeeTaskCount = employees.map(emp => {
      const taskCount = tasks.filter(t => t.employee_id === emp.id).length
      return {
        name: emp.name.split(' ')[0], // First name only for chart
        tasks: taskCount,
        fullName: emp.name
      }
    }).sort((a, b) => b.tasks - a.tasks).slice(0, 5) // Top 5

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      completionRate,
      statusDistribution,
      employeeTaskCount,
      totalEmployees: employees.length
    }
  }, [tasks, employees])

  const isLoading = employeesLoading || tasksLoading

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md border border-white/40 rounded-lg p-3 shadow-xl">
          <p className="text-sm font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            {payload[0].dataKey === 'tasks' ? 'Tasks: ' : 'Count: '}
            <span className="font-bold text-blue-600">{payload[0].value}</span>
          </p>
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/60 backdrop-blur-xl rounded-xl p-6 border border-white/40 animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="animate-fadeIn"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Tasks Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-white/60 backdrop-blur-xl rounded-xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTasks}</p>
              <p className="text-xs text-gray-500 mt-2">
                {stats.totalEmployees} employees
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl">
              <ListTodo className="h-8 w-8 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Pending Reviews Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-white/60 backdrop-blur-xl rounded-xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-gray-900">{stats.inProgressTasks}</p>
              <p className="text-xs text-gray-500 mt-2">
                {stats.todoTasks} pending
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-xl">
              <Clock className="h-8 w-8 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Completion Rate Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-white/60 backdrop-blur-xl rounded-xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completionRate}%</p>
              <p className="text-xs text-gray-500 mt-2">
                {stats.completedTasks} completed
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-xl">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Task Status Distribution */}
        <motion.div
          variants={itemVariants}
          className="bg-white/60 backdrop-blur-xl rounded-xl p-6 border border-white/40 shadow-lg"
        >
          <div className="flex items-center mb-4">
            <Target className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-bold text-gray-900">Task Status Distribution</h3>
          </div>
          
          {stats.statusDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {stats.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-gray-500">No tasks available</p>
            </div>
          )}

          {/* Legend */}
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {stats.statusDistribution.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bar Chart - Top Performers */}
        <motion.div
          variants={itemVariants}
          className="bg-white/60 backdrop-blur-xl rounded-xl p-6 border border-white/40 shadow-lg"
        >
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-bold text-gray-900">Top Performers</h3>
          </div>

          {stats.employeeTaskCount.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.employeeTaskCount}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#d1d5db' }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="tasks"
                  fill="url(#colorGradient)"
                  radius={[8, 8, 0, 0]}
                  animationBegin={0}
                  animationDuration={800}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#1D4ED8" stopOpacity={1} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-gray-500">No employee data available</p>
            </div>
          )}

          {/* Top performer badge */}
          {stats.employeeTaskCount.length > 0 && stats.employeeTaskCount[0].tasks > 0 && (
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-700">
                  <span className="font-bold text-blue-600">{stats.employeeTaskCount[0].fullName}</span>
                  {' '}is leading with{' '}
                  <span className="font-bold">{stats.employeeTaskCount[0].tasks}</span>
                  {' '}tasks
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Additional Insights */}
      {stats.totalTasks > 0 && (
        <motion.div
          variants={itemVariants}
          className="mt-6 bg-white/60 backdrop-blur-xl rounded-xl p-6 border border-white/40 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <ListTodo className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Average Tasks</p>
                <p className="text-xs text-gray-600">
                  {stats.totalEmployees > 0 
                    ? (stats.totalTasks / stats.totalEmployees).toFixed(1) 
                    : 0} tasks per employee
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Success Rate</p>
                <p className="text-xs text-gray-600">
                  {stats.completionRate}% of tasks completed
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Active Work</p>
                <p className="text-xs text-gray-600">
                  {stats.inProgressTasks + stats.todoTasks} tasks in pipeline
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default DashboardStats
