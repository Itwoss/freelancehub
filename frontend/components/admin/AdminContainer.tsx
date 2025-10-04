'use client'

import React from 'react'
import { AdminLayout } from './AdminLayout'
import { ProductGrid } from './ProductGrid'

interface AdminContainerProps {
  children: React.ReactNode
  currentPage?: string
  showProductGrid?: boolean
  products?: any[]
  className?: string
}

export function AdminContainer({
  children,
  currentPage = 'overview',
  showProductGrid = false,
  products = [],
  className = ''
}: AdminContainerProps) {
  return (
    <AdminLayout currentPage={currentPage}>
      <div className={`space-y-6 ${className}`}>
        {/* Page Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 capitalize">
                {currentPage === 'overview' ? 'Dashboard' : currentPage}
              </h1>
              <p className="text-gray-600 mt-1">
                {currentPage === 'overview' 
                  ? 'Welcome to your admin dashboard' 
                  : `Manage your ${currentPage} here`
                }
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-500">Live</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {showProductGrid ? (
            <ProductGrid products={products} />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              {children}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminContainer
