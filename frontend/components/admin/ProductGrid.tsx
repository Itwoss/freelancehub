'use client'

import React from 'react'
import { Badge } from './Badge'

interface ProductCardProps {
  id: string
  title: string
  description: string
  category: string
  price?: number
  status?: 'new' | 'sponsored' | 'highlight'
  icon?: React.ReactNode
  onClick?: () => void
}

interface ProductGridProps {
  children?: React.ReactNode
  products?: ProductCardProps[]
  className?: string
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  description,
  category,
  price,
  status,
  icon,
  onClick
}) => {
  const getStatusBadge = () => {
    if (!status) return null
    
    const statusConfig = {
      new: { label: 'New', className: 'bg-green-100 text-green-800' },
      sponsored: { label: 'Sponsored', className: 'bg-blue-100 text-blue-800' },
      highlight: { label: 'Highlight', className: 'bg-purple-100 text-purple-800' }
    }
    
    const config = statusConfig[status]
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
      {/* Header with badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            {icon || (
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-500">{category}</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
        {description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {category}
        </span>
        {price && (
          <span className="text-lg font-bold text-gray-900">
            ${price.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  )
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  children, 
  products = [], 
  className = '' 
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ${className}`}>
      {children || products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  )
}

export { ProductCard }
