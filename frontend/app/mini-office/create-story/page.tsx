'use client'

import React, { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { 
  ArrowLeft,
  Camera,
  Video,
  Upload,
  X,
  Image as ImageIcon,
  FileText,
  Globe,
  Lock,
  Clock
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function CreateStoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [content, setContent] = useState<File | null>(null)
  const [contentPreview, setContentPreview] = useState<string | null>(null)
  const [type, setType] = useState<'IMAGE' | 'VIDEO'>('IMAGE')
  const [isPublic, setIsPublic] = useState(true)
  const [loading, setLoading] = useState(false)

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin?callbackUrl=/mini-office/create-story')
    return null
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (type === 'IMAGE' && !file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (type === 'VIDEO' && !file.type.startsWith('video/')) {
      toast.error('Please select a video file')
      return
    }

    setContent(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setContentPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeContent = () => {
    setContent(null)
    setContentPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content) {
      toast.error('Please select an image or video file')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('content', content)
      formData.append('type', type)
      formData.append('isPublic', isPublic.toString())

      const response = await fetch('/api/social/stories', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Story created successfully! It will be reviewed before going live.')
        router.push('/mini-office')
      } else {
        toast.error(data.error || 'Failed to create story')
      }
    } catch (error) {
      console.error('Error creating story:', error)
      toast.error('Failed to create story')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/mini-office">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Create Story</h1>
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Content Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="type"
                    value="IMAGE"
                    checked={type === 'IMAGE'}
                    onChange={(e) => {
                      setType(e.target.value as 'IMAGE' | 'VIDEO')
                      setContent(null)
                      setContentPreview(null)
                    }}
                    className="text-primary-600"
                  />
                  <ImageIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Image</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="type"
                    value="VIDEO"
                    checked={type === 'VIDEO'}
                    onChange={(e) => {
                      setType(e.target.value as 'IMAGE' | 'VIDEO')
                      setContent(null)
                      setContentPreview(null)
                    }}
                    className="text-primary-600"
                  />
                  <Video className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Video</span>
                </label>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {type === 'IMAGE' ? 'Image' : 'Video'}
              </label>
              <div className="mt-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={type === 'IMAGE' ? 'image/*' : 'video/*'}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  {type === 'IMAGE' ? (
                    <Camera className="w-4 h-4 mr-2" />
                  ) : (
                    <Video className="w-4 h-4 mr-2" />
                  )}
                  Select {type === 'IMAGE' ? 'Image' : 'Video'}
                </Button>
                
                {contentPreview && (
                  <div className="mt-4">
                    <div className="relative group">
                      {type === 'IMAGE' ? (
                        <img
                          src={contentPreview}
                          alt="Story preview"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      ) : (
                        <video
                          src={contentPreview}
                          controls
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      )}
                      <button
                        type="button"
                        onClick={removeContent}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Privacy */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Privacy
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="privacy"
                    checked={isPublic}
                    onChange={() => setIsPublic(true)}
                    className="text-primary-600"
                  />
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Public - Everyone can see this story</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="privacy"
                    checked={!isPublic}
                    onChange={() => setIsPublic(false)}
                    className="text-primary-600"
                  />
                  <Lock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Private - Only you can see this story</span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex space-x-4">
              <Button
                type="submit"
                loading={loading}
                disabled={loading || !content}
                className="flex-1"
              >
                <FileText className="w-4 h-4 mr-2" />
                Create Story
              </Button>
              <Link href="/mini-office">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Story Guidelines</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Stories are visible for 24 hours after creation</li>
            <li>• All stories are reviewed by administrators before going live</li>
            <li>• Keep content professional and work-related</li>
            <li>• Respect your colleagues and maintain a positive environment</li>
            <li>• You can share images or videos up to 10MB each</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  )
}


