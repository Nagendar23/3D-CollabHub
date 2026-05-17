import { useState } from 'react'
import API from '@/lib/api'

export const useDeleteProject = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const deleteProject = async (projectId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await API.delete(`/projects/${projectId}`)
      return response.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete project'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { deleteProject, loading, error }
}
