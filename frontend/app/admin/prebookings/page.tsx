'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from '@/lib/session-provider'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  DollarSign,
  User,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Prebooking {
  id: string
  productId: string
  productTitle: string
  userDetails: {
    name: string
    email: string
    phone?: string
    message?: string
  }
  amount: number
  currency: string
  status: 'PENDING' | 'PAID' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'
  paymentId?: string
  orderId?: string
  receipt?: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    image?: string
    phone?: string
  }
}

export default function AdminPrebookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [prebookings, setPrebookings] = useState<Prebooking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [stats, setStats] = useState<any>({})

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
      router.push('/auth/signin')
      return
    }
    fetchPrebookings()
  }, [status, router])

  const fetchPrebookings = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter) params.append('status', statusFilter)
      
      const response = await fetch(`/api/admin/prebookings?${params}`)
      if (response.ok) {
        const data = await response.json()
        setPrebookings(data.prebookings || [])
        setStats(data.stats || {})
      }
    } catch (error) {
      console.error('Error fetching prebookings:', error)
      toast.error('Failed to load prebookings')
    } finally {
      setLoading(false)
    }
  }

  const updatePrebookingStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/prebookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        toast.success('Prebooking status updated')
        fetchPrebookings()
      } else {
        toast.error('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating prebooking:', error)
      toast.error('Failed to update prebooking')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'COMPLETED':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading prebookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Prebooking Management</h1>
          <p className="text-gray-400">Manage all prebooking payments and customer details</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Prebookings</p>
                <p className="text-2xl font-bold text-white">{prebookings.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {prebookings.filter(p => p.status === 'PENDING').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Paid</p>
                <p className="text-2xl font-bold text-green-400">
                  {prebookings.filter(p => p.status === 'PAID').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-orange-400">
                  ₹{prebookings.reduce((sum, p) => sum + p.amount, 0)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by product, name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REFUNDED">Refunded</option>
              </select>
              <Button
                onClick={fetchPrebookings}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Prebookings List */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-6">All Prebookings</h3>
            
            {prebookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white mb-2">No Prebookings Found</h4>
                <p className="text-gray-400">No prebookings match your current filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {prebookings.map((prebooking) => (
                  <div key={prebooking.id} className="bg-white/5 rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h4 className="text-lg font-semibold text-white">{prebooking.productTitle}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(prebooking.status)}`}>
                            {getStatusIcon(prebooking.status)}
                            <span className="ml-1">{prebooking.status}</span>
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Customer Details</p>
                            <div className="space-y-1">
                              <p className="text-white flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                {prebooking.userDetails.name}
                              </p>
                              <p className="text-white flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                {prebooking.userDetails.email}
                              </p>
                              {prebooking.userDetails.phone && (
                                <p className="text-white flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-gray-400" />
                                  {prebooking.userDetails.phone}
                                </p>
                              )}
                              {prebooking.userDetails.message && (
                                <p className="text-white flex items-center gap-2">
                                  <MessageSquare className="w-4 h-4 text-gray-400" />
                                  {prebooking.userDetails.message}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Payment Details</p>
                            <div className="space-y-1">
                              <p className="text-white">
                                <strong>Amount:</strong> {prebooking.currency === 'INR' ? '₹' : '$'}{prebooking.amount}
                              </p>
                              <p className="text-white">
                                <strong>Date:</strong> {new Date(prebooking.createdAt).toLocaleDateString()}
                              </p>
                              {prebooking.paymentId && (
                                <p className="text-white">
                                  <strong>Payment ID:</strong> {prebooking.paymentId}
                                </p>
                              )}
                              {prebooking.orderId && (
                                <p className="text-white">
                                  <strong>Order ID:</strong> {prebooking.orderId}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        {prebooking.status === 'PENDING' && (
                          <>
                            <Button
                              onClick={() => updatePrebookingStatus(prebooking.id, 'PAID')}
                              className="bg-green-500 hover:bg-green-600 text-white text-sm"
                            >
                              Mark as Paid
                            </Button>
                            <Button
                              onClick={() => updatePrebookingStatus(prebooking.id, 'CANCELLED')}
                              className="bg-red-500 hover:bg-red-600 text-white text-sm"
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {prebooking.status === 'PAID' && (
                          <Button
                            onClick={() => updatePrebookingStatus(prebooking.id, 'COMPLETED')}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-sm"
                          >
                            Mark as Completed
                          </Button>
                        )}
                        {prebooking.status === 'COMPLETED' && (
                          <Button
                            onClick={() => updatePrebookingStatus(prebooking.id, 'REFUNDED')}
                            className="bg-gray-500 hover:bg-gray-600 text-white text-sm"
                          >
                            Refund
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
