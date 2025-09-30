'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { useMenuContrast } from '@/lib/hooks/useDynamicContrast'
import { cn } from '@/lib/utils'

interface DynamicMenuProps {
  children: React.ReactNode
  className?: string
  href?: string
  onClick?: () => void
  isActive?: boolean
  variant?: 'default' | 'subtle' | 'active'
}

interface DynamicMenuItemProps {
  children: React.ReactNode
  className?: string
  href?: string
  onClick?: () => void
  isActive?: boolean
  variant?: 'default' | 'subtle' | 'active'
  icon?: React.ReactNode
}

/**
 * Dynamic Menu Container
 * Automatically applies contrasting colors based on background
 */
export function DynamicMenu({ children, className }: DynamicMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null)
  const menuContrast = useMenuContrast(menuRef)

  return (
    <div ref={menuRef} className={cn('space-y-2', className)}>
      {children}
    </div>
  )
}

/**
 * Dynamic Menu Item
 * Automatically applies contrasting colors based on background
 */
export function DynamicMenuItem({ 
  children, 
  className, 
  href, 
  onClick, 
  isActive = false, 
  variant = 'default',
  icon 
}: DynamicMenuItemProps) {
  const itemRef = useRef<HTMLDivElement | null>(null)
  const menuContrast = useMenuContrast(itemRef)

  const getVariantStyles = () => {
    switch (variant) {
      case 'active':
        return {
          color: '#ffffff',
          backgroundColor: 'linear-gradient(to right, #f97316, #ef4444)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }
      case 'subtle':
        return {
          color: menuContrast.menuTextColorSubtle,
          backgroundColor: 'transparent'
        }
      default:
        return {
          color: menuContrast.menuTextColorSubtle,
          backgroundColor: 'transparent'
        }
    }
  }

  const baseStyles = getVariantStyles()

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (!isActive) {
      e.currentTarget.style.color = menuContrast.menuHoverTextColor
      e.currentTarget.style.backgroundColor = menuContrast.menuHoverBackground
    }
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (!isActive) {
      e.currentTarget.style.color = baseStyles.color
      e.currentTarget.style.backgroundColor = baseStyles.backgroundColor
    }
  }

  const content = (
    <div
      ref={itemRef}
      className={cn(
        'w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 cursor-pointer',
        className
      )}
      style={baseStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {icon && <span className="w-4 h-4 mr-3">{icon}</span>}
      {children}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    )
  }

  return content
}

/**
 * Dynamic Menu Link
 * For navigation links with automatic contrast
 */
export function DynamicMenuLink({ 
  children, 
  className, 
  href, 
  isActive = false,
  icon 
}: DynamicMenuItemProps) {
  const linkRef = useRef<HTMLAnchorElement | null>(null)
  const menuContrast = useMenuContrast(linkRef)

  const baseStyles = {
    color: isActive ? '#ffffff' : menuContrast.menuTextColorSubtle,
    backgroundColor: isActive ? 'linear-gradient(to right, #f97316, #ef4444)' : 'transparent'
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isActive) {
      e.currentTarget.style.color = menuContrast.menuHoverTextColor
      e.currentTarget.style.backgroundColor = menuContrast.menuHoverBackground
    }
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isActive) {
      e.currentTarget.style.color = baseStyles.color
      e.currentTarget.style.backgroundColor = baseStyles.backgroundColor
    }
  }

  return (
    <Link
      ref={linkRef}
      href={href!}
      className={cn(
        'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105',
        className
      )}
      style={baseStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {icon && <span className="w-4 h-4 mr-3">{icon}</span>}
      {children}
    </Link>
  )
}

