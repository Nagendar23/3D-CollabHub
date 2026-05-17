import { useState } from 'react'
import API from '@/lib/api'

export const useDeleteFile = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const deleteFile = async (fileId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await API.delete(`/files/${fileId}`)
      return response.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete file'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { deleteFile, loading, error }
}
