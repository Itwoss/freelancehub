'use client'

import React, { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { 
  ArrowLeft,
  Camera,
  Music,
  Upload,
  X,
  Image as ImageIcon,
  FileText,
  Globe,
  Lock
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function CreatePostPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioTitle, setAudioTitle] = useState('')
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
    router.push('/auth/signin?callbackUrl=/mini-office/create-post')
    return null
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      toast.error('Please select image files only')
      return
    }

    if (images.length + imageFiles.length > 10) {
      toast.error('Maximum 10 images allowed')
      return
    }

    setImages(prev => [...prev, ...imageFiles])
    
    // Create previews
    imageFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file)
      setAudioTitle(file.name.replace(/\.[^/.]+$/, ''))
    } else {
      toast.error('Please select an audio file')
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const removeAudio = () => {
    setAudioFile(null)
    setAudioTitle('')
    if (audioInputRef.current) {
      audioInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!caption.trim()) {
      toast.error('Caption is required')
      return
    }

    if (images.length === 0 && !audioFile) {
      toast.error('Please add at least one image or audio file')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('caption', caption)
      formData.append('isPublic', isPublic.toString())
      
      if (audioFile) {
        formData.append('audio', audioFile)
        formData.append('audioTitle', audioTitle)
      }

      images.forEach((image, index) => {
        formData.append(`images`, image)
      })

      const response = await fetch('/api/social/posts', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Post created successfully! It will be reviewed before going live.')
        router.push('/mini-office')
      } else {
        toast.error(data.error || 'Failed to create post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error('Failed to create post')
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
            <h1 className="text-2xl font-bold text-gray-900">Create Post</h1>
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your post a title..."
                className="mt-1"
              />
            </div>

            {/* Caption */}
            <div>
              <Label htmlFor="caption">Caption *</Label>
              <textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="What's on your mind?"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={4}
                required
              />
            </div>

            {/* Images */}
            <div>
              <Label>Images</Label>
              <div className="mt-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Add Images ({images.length}/10)
                </Button>
                
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Audio */}
            <div>
              <Label>Audio (Optional)</Label>
              <div className="mt-2">
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => audioInputRef.current?.click()}
                  className="w-full"
                >
                  <Music className="w-4 h-4 mr-2" />
                  Add Audio
                </Button>
                
                {audioFile && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Music className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{audioFile.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeAudio}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <Input
                      type="text"
                      value={audioTitle}
                      onChange={(e) => setAudioTitle(e.target.value)}
                      placeholder="Audio title"
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Privacy */}
            <div>
              <Label>Privacy</Label>
              <div className="mt-2 space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="privacy"
                    checked={isPublic}
                    onChange={() => setIsPublic(true)}
                    className="text-primary-600"
                  />
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Public - Everyone can see this post</span>
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
                  <span className="text-sm">Private - Only you can see this post</span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex space-x-4">
              <Button
                type="submit"
                loading={loading}
                disabled={loading || !caption.trim() || (images.length === 0 && !audioFile)}
                className="flex-1"
              >
                <FileText className="w-4 h-4 mr-2" />
                Create Post
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
          <h3 className="text-sm font-medium text-blue-900 mb-2">Post Guidelines</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• All posts are reviewed by administrators before going live</li>
            <li>• Keep content professional and work-related</li>
            <li>• Respect your colleagues and maintain a positive environment</li>
            <li>• You can add up to 10 images and 1 audio file per post</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  )
}


