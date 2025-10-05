'use client'

import React, { useState } from 'react'
import { useSession } from '@/lib/session-provider'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ArrowLeft, Camera, Image, Video, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CreateStoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    content: '',
    type: 'image' as 'image' | 'video'
  })

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Story created successfully!')
      router.push('/mini-office')
    } catch (error) {
      toast.error('Failed to create story')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Create New Story</h1>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Story Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Story Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'image', label: 'Image Story', icon: Image },
                    { value: 'video', label: 'Video Story', icon: Video }
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({...formData, type: type.value as any})}
                      className={`p-4 rounded-lg border-2 flex items-center justify-center ${
                        formData.type === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <type.icon className="w-6 h-6 mr-2" />
                      <span className="font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="text-gray-500">
                    {formData.type === 'image' ? (
                      <Image className="w-16 h-16 mx-auto mb-4" />
                    ) : (
                      <Video className="w-16 h-16 mx-auto mb-4" />
                    )}
                    <p className="text-lg font-medium mb-2">Upload your {formData.type}</p>
                    <p className="text-sm text-gray-400 mb-4">
                      {formData.type === 'image' 
                        ? 'PNG, JPG up to 10MB' 
                        : 'MP4 up to 50MB'
                      }
                    </p>
                    <Button type="button" variant="outline">
                      <Camera className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption (Optional)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a caption to your story..."
                />
              </div>

              {/* Story Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <div className="bg-gray-100 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p>Story preview will appear here</p>
                    <p className="text-sm">Upload a {formData.type} to see preview</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Share Story
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
