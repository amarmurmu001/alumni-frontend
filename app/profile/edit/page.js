'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { api } from '../../utils/api'
import { HiOutlineAcademicCap, HiOutlineOfficeBuilding, 
         HiOutlineLocationMarker, HiOutlineMail } from 'react-icons/hi'

export default function EditProfilePage() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    graduationYear: '',
    major: '',
    currentJob: '',
    location: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const data = await api.user.getProfile()
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      if (error.message === 'Unauthorized') {
        router.push('/auth')
        return
      }
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      await api.user.updateProfile(profile)
      router.push('/profile')
    } catch (error) {
      console.error('Error updating profile:', error)
      setError(error.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  const inputClasses = "mt-1 block w-full bg-transparent rounded-lg border border-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
  const labelClasses = "block text-sm font-medium text-gray-300 mb-1"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto px-4 py-12"
    >
      <div className="space-y-8">
        <div className="border-b border-gray-800 pb-8">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-4xl font-bold text-white mb-2"
          >
            Edit Profile
          </motion.h1>
          <p className="text-gray-400">Update your personal information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className={labelClasses}>First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="lastName" className={labelClasses}>Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className={labelClasses}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>
          </motion.section>

          {/* Academic Information */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">Academic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="graduationYear" className={labelClasses}>Graduation Year</label>
                <input
                  type="number"
                  id="graduationYear"
                  name="graduationYear"
                  value={profile.graduationYear}
                  onChange={handleChange}
                  min="1900"
                  max="2100"
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="major" className={labelClasses}>Major</label>
                <input
                  type="text"
                  id="major"
                  name="major"
                  value={profile.major}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
            </div>
          </motion.section>

          {/* Professional Information */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">Professional Information</h2>
            <div>
              <label htmlFor="currentJob" className={labelClasses}>Current Job</label>
              <input
                type="text"
                id="currentJob"
                name="currentJob"
                value={profile.currentJob}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="location" className={labelClasses}>Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={profile.location}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          </motion.section>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm"
            >
              {error}
            </motion.p>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end space-x-4 pt-6 border-t border-gray-800"
          >
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  )
}