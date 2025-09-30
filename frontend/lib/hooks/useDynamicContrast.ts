'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { 
  getBackgroundColor, 
  getContrastingTextColor, 
  getContrastingTextColorWithOpacity 
} from '@/lib/utils'

interface ContrastColors {
  textColor: string
  textColorWithOpacity: string
  isLightBackground: boolean
  backgroundColor: { r: number; g: number; b: number } | null
}

/**
 * Custom hook for dynamic contrast calculation
 * Automatically detects background color and provides contrasting text colors
 */
export function useDynamicContrast(elementRef?: React.RefObject<HTMLElement>) {
  const [contrastColors, setContrastColors] = useState<ContrastColors>({
    textColor: '#ffffff',
    textColorWithOpacity: 'rgba(255, 255, 255, 0.9)',
    isLightBackground: false,
    backgroundColor: null
  })

  const updateContrast = useCallback(() => {
    const targetElement = elementRef?.current || document.body
    
    if (!targetElement) return

    const backgroundColor = getBackgroundColor(targetElement)
    
    if (backgroundColor) {
      const textColor = getContrastingTextColor(backgroundColor)
      const textColorWithOpacity = getContrastingTextColorWithOpacity(backgroundColor, 0.9)
      const isLightBackground = backgroundColor.r > 128 && backgroundColor.g > 128 && backgroundColor.b > 128
      
      setContrastColors({
        textColor,
        textColorWithOpacity,
        isLightBackground,
        backgroundColor
      })
    }
  }, [elementRef])

  useEffect(() => {
    // Initial calculation
    updateContrast()

    // Set up ResizeObserver to detect background changes
    const resizeObserver = new ResizeObserver(() => {
      updateContrast()
    })

    const targetElement = elementRef?.current || document.body
    if (targetElement) {
      resizeObserver.observe(targetElement)
    }

    // Also listen for style changes
    const mutationObserver = new MutationObserver(() => {
      updateContrast()
    })

    if (targetElement) {
      mutationObserver.observe(targetElement, {
        attributes: true,
        attributeFilter: ['style', 'class']
      })
    }

    // Listen for window resize and scroll events
    const handleResize = () => updateContrast()
    const handleScroll = () => updateContrast()

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [updateContrast])

  return {
    ...contrastColors,
    updateContrast
  }
}

/**
 * Hook for getting contrasting colors for menu items
 * Provides both solid and semi-transparent text colors
 */
export function useMenuContrast(elementRef?: React.RefObject<HTMLElement>) {
  const contrast = useDynamicContrast(elementRef)
  
  return {
    // Solid colors for maximum contrast
    menuTextColor: contrast.textColor,
    menuHoverTextColor: contrast.textColor,
    
    // Semi-transparent colors for subtle effects
    menuTextColorSubtle: contrast.textColorWithOpacity,
    menuHoverTextColorSubtle: contrast.isLightBackground 
      ? 'rgba(0, 0, 0, 0.7)' 
      : 'rgba(255, 255, 255, 0.7)',
    
    // Background colors for hover states
    menuHoverBackground: contrast.isLightBackground 
      ? 'rgba(0, 0, 0, 0.1)' 
      : 'rgba(255, 255, 255, 0.1)',
    
    // Active state colors
    menuActiveTextColor: contrast.textColor,
    menuActiveBackground: contrast.isLightBackground 
      ? 'rgba(0, 0, 0, 0.15)' 
      : 'rgba(255, 255, 255, 0.15)',
    
    // Utility properties
    isLightBackground: contrast.isLightBackground,
    backgroundColor: contrast.backgroundColor
  }
}

