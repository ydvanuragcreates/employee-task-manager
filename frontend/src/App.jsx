import { useState, useEffect } from 'react'
import { SignedIn, SignedOut, SignIn, UserButton, useUser } from '@clerk/clerk-react'
import { AnimatePresence } from 'framer-motion'
import EmployeeTable from './components/EmployeeTable'
import TaskBoard from './components/TaskBoard'
import DashboardStats from './components/DashboardStats'
import Tabs from './components/Tabs'
import ProfileModal from './components/ProfileModal'
import Background3D from './components/Background3D'
import { profileAPI } from './api/api'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profile, setProfile] = useState(null)
  const { user } = useUser()

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'employees', label: 'Employees' },
    { id: 'tasks', label: 'Tasks' }
  ]

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const response = await profileAPI.get()
      setProfile(response.data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleProfileUpdate = async (formData, avatarFile) => {
    try {
      if (avatarFile) {
        await profileAPI.uploadAvatar(avatarFile)
      }
      await profileAPI.update(formData)
      await fetchProfile()
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getAvatarUrl = (url) => {
    if (!url) return null
    if (url.startsWith('http')) return url
    return `http://localhost:8000/${url.replace(/\\/g, '/')}`
  }

  return (
    <div className="min-h-screen">
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/40">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Employee & Task Hub
              </h1>
              <p className="text-gray-600">Sign in to access your dashboard</p>
            </div>
            <SignIn routing="hash" />
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <Background3D />
        
        <header className="bg-white/70 backdrop-blur-md shadow-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-slate-800">
                  Employee & Task Hub
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 hidden sm:block">
                  Welcome, {user?.firstName || 'User'}
                </span>
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/60 backdrop-blur-xl rounded-xl shadow-xl border border-white/40 overflow-hidden">
            <div className="px-6 pt-6">
              <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            <div className="p-6">
              {activeTab === 'dashboard' && <DashboardStats />}
              {activeTab === 'employees' && <EmployeeTable />}
              {activeTab === 'tasks' && <TaskBoard />}
            </div>
          </div>
        </main>

        <AnimatePresence>
          {showProfileModal && profile && (
            <ProfileModal
              profile={profile}
              onClose={() => setShowProfileModal(false)}
              onUpdate={handleProfileUpdate}
            />
          )}
        </AnimatePresence>
      </SignedIn>
    </div>
  )
}

export default App
