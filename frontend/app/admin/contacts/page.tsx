'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { 
  Mail, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  MessageSquare,
  Calendar,
  Phone,
  Send
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Contact {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'NEW' | 'READ' | 'REPLIED' | 'CLOSED'
  createdAt: string
  updatedAt: string
}

export default function AdminContactsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [replyMessage, setReplyMessage] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
      router.push('/auth/signin')
      return
    }
    fetchContacts()
  }, [status, session])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/contact')
      if (response.ok) {
        const data = await response.json()
        setContacts(data.contacts || [])
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
      toast.error('Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  const updateContactStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        toast.success('Contact status updated')
        fetchContacts()
      } else {
        toast.error('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating contact:', error)
      toast.error('Failed to update contact')
    }
  }

  const sendReply = async (contactId: string) => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a reply message')
      return
    }

    try {
      const response = await fetch(`/api/contact/${contactId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: replyMessage })
      })

      if (response.ok) {
        toast.success('Reply sent successfully')
        setReplyMessage('')
        setSelectedContact(null)
        fetchContacts()
      } else {
        toast.error('Failed to send reply')
      }
    } catch (error) {
      console.error('Error sending reply:', error)
      toast.error('Failed to send reply')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NEW':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'READ':
        return <Eye className="w-4 h-4 text-blue-500" />
      case 'REPLIED':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'CLOSED':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'READ':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'REPLIED':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'CLOSED':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = !searchTerm || 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || contact.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading contacts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Contact Management</h1>
          <p className="text-gray-400">Manage all contact form submissions and customer inquiries</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Contacts</p>
                <p className="text-2xl font-bold text-white">{contacts.length}</p>
              </div>
              <Mail className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">New Messages</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {contacts.filter(c => c.status === 'NEW').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Replied</p>
                <p className="text-2xl font-bold text-green-400">
                  {contacts.filter(c => c.status === 'REPLIED').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Closed</p>
                <p className="text-2xl font-bold text-red-400">
                  {contacts.filter(c => c.status === 'CLOSED').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
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
                  placeholder="Search by name, email, or subject..."
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
                <option value="NEW">New</option>
                <option value="READ">Read</option>
                <option value="REPLIED">Replied</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contacts List */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-6">All Contact Submissions</h3>
            
            {filteredContacts.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white mb-2">No Contacts Found</h4>
                <p className="text-gray-400">No contacts match your current filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredContacts.map((contact) => (
                  <div key={contact.id} className="bg-white/5 rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h4 className="text-lg font-semibold text-white">{contact.subject}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(contact.status)}`}>
                            {getStatusIcon(contact.status)}
                            <span className="ml-1">{contact.status}</span>
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Contact Details</p>
                            <div className="space-y-1">
                              <p className="text-white flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                {contact.name}
                              </p>
                              <p className="text-white flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                {contact.email}
                              </p>
                              <p className="text-white flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {new Date(contact.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Message</p>
                            <p className="text-white text-sm line-clamp-3">
                              {contact.message}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          onClick={() => setSelectedContact(contact)}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-sm"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        
                        {contact.status === 'NEW' && (
                          <Button
                            onClick={() => updateContactStatus(contact.id, 'READ')}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
                          >
                            Mark as Read
                          </Button>
                        )}
                        
                        {contact.status === 'READ' && (
                          <Button
                            onClick={() => setSelectedContact(contact)}
                            className="bg-green-500 hover:bg-green-600 text-white text-sm"
                          >
                            Reply
                          </Button>
                        )}
                        
                        {contact.status === 'REPLIED' && (
                          <Button
                            onClick={() => updateContactStatus(contact.id, 'CLOSED')}
                            className="bg-red-500 hover:bg-red-600 text-white text-sm"
                          >
                            Close
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
      
      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Contact Details</h3>
              <Button
                onClick={() => setSelectedContact(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                Close
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Name</p>
                <p className="text-white">{selectedContact.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-1">Email</p>
                <p className="text-white">{selectedContact.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-1">Subject</p>
                <p className="text-white">{selectedContact.subject}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-1">Message</p>
                <p className="text-white whitespace-pre-wrap">{selectedContact.message}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-1">Date</p>
                <p className="text-white">{new Date(selectedContact.createdAt).toLocaleString()}</p>
              </div>
            </div>
            
            {selectedContact.status !== 'CLOSED' && (
              <div className="mt-6">
                <p className="text-sm text-gray-400 mb-2">Reply Message</p>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply here..."
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  rows={4}
                />
                <div className="flex gap-2 mt-3">
                  <Button
                    onClick={() => sendReply(selectedContact.id)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Send Reply
                  </Button>
                  <Button
                    onClick={() => setReplyMessage('')}
                    className="bg-gray-500 hover:bg-gray-600 text-white"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  )
}
