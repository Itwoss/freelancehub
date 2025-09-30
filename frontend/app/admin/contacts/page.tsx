"use client"

import React, { useState, useEffect } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { 
  Mail, 
  User, 
  Calendar, 
  MessageSquare, 
  Search, 
  Filter,
  Eye,
  Reply,
  Archive,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"

interface ContactSubmission {
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
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contact')
      const data = await response.json()
      setContacts(data.contacts || [])
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateContactStatus = async (id: string, status: string) => {
    try {
      // You would implement this API endpoint
      console.log(`Updating contact ${id} to status ${status}`)
      // For now, just update locally
      setContacts(prev => prev.map(contact => 
        contact.id === id ? { ...contact, status: status as any } : contact
      ))
    } catch (error) {
      console.error('Error updating contact status:', error)
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || contact.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NEW':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      case 'READ':
        return <Eye className="w-4 h-4 text-blue-400" />
      case 'REPLIED':
        return <Reply className="w-4 h-4 text-green-400" />
      case 'CLOSED':
        return <CheckCircle className="w-4 h-4 text-gray-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-red-500/20 text-red-300 border-red-500/50'
      case 'READ':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50'
      case 'REPLIED':
        return 'bg-green-500/20 text-green-300 border-green-500/50'
      case 'CLOSED':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white antialiased">
        <Header />
        <main className="pt-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-32">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading contacts...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      <Header />
      
      <main className="pt-24">
        {/* Header */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white">Contact Submissions</h1>
                <p className="text-gray-400 mt-2">Manage and respond to contact form submissions</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-pink-300">{contacts.length}</div>
                <div className="text-sm text-gray-400">Total Submissions</div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                {['all', 'NEW', 'READ', 'REPLIED', 'CLOSED'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === status
                        ? "bg-pink-500 text-white"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    {status === 'all' ? 'All' : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Contacts List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Contacts List */}
              <div className="lg:col-span-1">
                <div className="bg-white/6 rounded-xl p-6">
                  <h3 className="font-semibold text-white mb-4">Contact Messages ({filteredContacts.length})</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredContacts.map((contact) => (
                      <div
                        key={contact.id}
                        onClick={() => setSelectedContact(contact)}
                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                          selectedContact?.id === contact.id
                            ? "bg-pink-500/20 border border-pink-500/50"
                            : "bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(contact.status)}
                            <span className="font-medium text-white">{contact.name}</span>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(contact.status)}`}>
                            {contact.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mb-1">{contact.subject}</p>
                        <p className="text-xs text-gray-400">{contact.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="lg:col-span-2">
                {selectedContact ? (
                  <div className="bg-white/6 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-white">{selectedContact.subject}</h3>
                        <p className="text-gray-400">From: {selectedContact.name} ({selectedContact.email})</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => updateContactStatus(selectedContact.id, 'READ')}
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Mark as Read
                        </Button>
                        <Button
                          onClick={() => updateContactStatus(selectedContact.id, 'REPLIED')}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Reply className="w-4 h-4 mr-2" />
                          Mark as Replied
                        </Button>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-white mb-2">Message:</h4>
                      <p className="text-gray-300 whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        Received: {new Date(selectedContact.createdAt).toLocaleString()}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => updateContactStatus(selectedContact.id, 'CLOSED')}
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Archive className="w-4 h-4 mr-2" />
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/6 rounded-xl p-6 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Select a contact to view details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
