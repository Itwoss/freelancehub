'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  ArrowLeft,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  User,
  Mail,
  Phone,
  Calendar,
  Eye,
  MoreVertical
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Booking {
  id: string
  productId: string
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  message: string
  status: 'pending' | 'approved' | 'rejected'
  paymentStatus: 'pending' | 'paid' | 'failed'
  amount: number
  currency: string
  createdAt: string
  updatedAt: string
}

export default function AdminBookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const mockBookings: Booking[] = [
    {
      id: '1',
      productId: '1',
      userId: '1',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      userPhone: '+1-555-0123',
      message: 'Looking forward to using this template!',
      status: 'pending',
      paymentStatus: 'pending',
      amount: 69,
      currency: 'USD',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      productId: '2',
      userId: '2',
      userName: 'Sarah Wilson',
      userEmail: 'sarah@example.com',
      userPhone: '+1-555-0456',
      message: 'Need this for my new project',
      status: 'approved',
      paymentStatus: 'paid',
      amount: 89,
      currency: 'USD',
      createdAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-14T15:45:00Z'
    },
    {
      id: '3',
      productId: '1',
      userId: '3',
      userName: 'Mike Johnson',
      userEmail: 'mike@example.com',
      userPhone: '+1-555-0789',
      message: 'Interested in the AI template',
      status: 'rejected',
      paymentStatus: 'failed',
      amount: 69,
      currency: 'USD',
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-13T11:30:00Z'
    }
  ]

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
      router.push('/auth/signin')
      return
    }
    
    // Simulate API call
    setTimeout(() => {
      setBookings(mockBookings)
      setLoading(false)
    }, 1000)
  }, [status, session, router])

  const handleApproveBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'approved'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to approve booking')
      }

      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'approved' as const }
          : booking
      ))
      
      toast.success('Booking approved successfully')
    } catch (error) {
      console.error('Approve booking error:', error)
      toast.error('Failed to approve booking')
    }
  }

  const handleRejectBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'rejected'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to reject booking')
      }

      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'rejected' as const }
          : booking
      ))
      
      toast.success('Booking rejected')
    } catch (error) {
      console.error('Reject booking error:', error)
      toast.error('Failed to reject booking')
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          booking.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          booking.id.includes(searchQuery)
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-500/20'
      case 'rejected': return 'text-red-400 bg-red-500/20'
      case 'pending': return 'text-yellow-400 bg-yellow-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-400 bg-green-500/20'
      case 'failed': return 'text-red-400 bg-red-500/20'
      case 'pending': return 'text-yellow-400 bg-yellow-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Booking Management</h1>
              <p className="text-sm text-gray-400">Manage and approve customer bookings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Booking ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Payment</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4 text-sm text-gray-300">
                      #{booking.id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-white">{booking.userName}</div>
                        <div className="text-sm text-gray-400">{booking.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      Product #{booking.productId}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      ${booking.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApproveBooking(booking.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleRejectBooking(booking.id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedBooking(booking)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No bookings found</div>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Booking Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{selectedBooking.userName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{selectedBooking.userEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{selectedBooking.userPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">
                        {new Date(selectedBooking.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Booking Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Booking ID:</span>
                      <span className="text-white">#{selectedBooking.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Product ID:</span>
                      <span className="text-white">#{selectedBooking.productId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-white">${selectedBooking.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                        {selectedBooking.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Payment Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                        {selectedBooking.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedBooking.message && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Message</h3>
                    <p className="text-gray-300 bg-gray-800 p-4 rounded-lg">
                      {selectedBooking.message}
                    </p>
                  </div>
                )}

                {selectedBooking.status === 'pending' && (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        handleApproveBooking(selectedBooking.id)
                        setSelectedBooking(null)
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Booking
                    </Button>
                    <Button
                      onClick={() => {
                        handleRejectBooking(selectedBooking.id)
                        setSelectedBooking(null)
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Booking
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
