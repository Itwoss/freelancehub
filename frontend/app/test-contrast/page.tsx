'use client'

import React, { useState } from 'react'
import { DynamicMenu, DynamicMenuItem, DynamicMenuLink } from '@/components/ui/DynamicMenu'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { 
  Home, 
  User, 
  Settings, 
  Briefcase, 
  Star,
  Bell,
  Search,
  Plus
} from 'lucide-react'

const backgrounds = [
  { name: 'Light Gray', color: '#f3f4f6' },
  { name: 'White', color: '#ffffff' },
  { name: 'Dark Gray', color: '#1f2937' },
  { name: 'Black', color: '#000000' },
  { name: 'Blue', color: '#3b82f6' },
  { name: 'Green', color: '#10b981' },
  { name: 'Red', color: '#ef4444' },
  { name: 'Purple', color: '#8b5cf6' },
  { name: 'Orange', color: '#f97316' },
  { name: 'Yellow', color: '#eab308' }
]

const menuItems = [
  { name: 'Home', icon: Home, href: '/' },
  { name: 'Profile', icon: User, href: '/profile' },
  { name: 'Projects', icon: Briefcase, href: '/projects' },
  { name: 'Reviews', icon: Star, href: '/reviews' },
  { name: 'Settings', icon: Settings, href: '/settings' }
]

export default function TestContrastPage() {
  const [selectedBackground, setSelectedBackground] = useState(backgrounds[2]) // Start with dark gray
  const [activeItem, setActiveItem] = useState('Home')

  return (
    <div 
      className="min-h-screen transition-colors duration-500"
      style={{ backgroundColor: selectedBackground.color }}
    >
      <Header />
      
      <div className="pt-24 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Dynamic Contrast Test</h1>
            <p className="text-lg mb-6">
              This page demonstrates the dynamic contrast system. 
              Change the background color below to see how menu text colors automatically adjust for maximum readability.
            </p>
            
            {/* Background Color Selector */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Select Background Color:</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {backgrounds.map((bg) => (
                  <Button
                    key={bg.name}
                    onClick={() => setSelectedBackground(bg)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedBackground.name === bg.name 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: bg.color }}
                  >
                    <span 
                      className="text-sm font-medium"
                      style={{ 
                        color: bg.color === '#ffffff' || bg.color === '#f3f4f6' ? '#000000' : '#ffffff'
                      }}
                    >
                      {bg.name}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Test Menu 1: Basic Menu */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-4">Basic Dynamic Menu</h3>
              <DynamicMenu>
                {menuItems.map((item) => (
                  <DynamicMenuLink
                    key={item.name}
                    href={item.href}
                    icon={<item.icon className="w-4 h-4" />}
                    isActive={activeItem === item.name}
                    onClick={() => setActiveItem(item.name)}
                  >
                    {item.name}
                  </DynamicMenuLink>
                ))}
              </DynamicMenu>
            </div>

            {/* Test Menu 2: Sidebar Style */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-4">Sidebar Style Menu</h3>
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <DynamicMenuItem
                    key={item.name}
                    icon={<item.icon className="w-4 h-4" />}
                    isActive={activeItem === item.name}
                    variant={activeItem === item.name ? 'active' : 'subtle'}
                    onClick={() => setActiveItem(item.name)}
                  >
                    {item.name}
                  </DynamicMenuItem>
                ))}
              </div>
            </div>

            {/* Test Menu 3: Navigation Bar Style */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-4">Navigation Bar Style</h3>
              <div className="flex flex-wrap gap-2">
                {menuItems.map((item) => (
                  <DynamicMenuLink
                    key={item.name}
                    href={item.href}
                    className="px-4 py-2 rounded-full"
                    isActive={activeItem === item.name}
                    onClick={() => setActiveItem(item.name)}
                  >
                    {item.name}
                  </DynamicMenuLink>
                ))}
              </div>
            </div>

            {/* Test Menu 4: Mobile Menu Style */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-4">Mobile Menu Style</h3>
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <DynamicMenuItem
                    key={item.name}
                    icon={<item.icon className="w-4 h-4" />}
                    isActive={activeItem === item.name}
                    variant={activeItem === item.name ? 'active' : 'default'}
                    onClick={() => setActiveItem(item.name)}
                    className="px-4 py-3 rounded-xl"
                  >
                    {item.name}
                  </DynamicMenuItem>
                ))}
              </div>
            </div>
          </div>

          {/* Information Panel */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold mb-4">How It Works</h3>
            <div className="space-y-2 text-sm">
              <p>• <strong>Automatic Detection:</strong> The system automatically detects the background color of the menu container</p>
              <p>• <strong>Luminance Calculation:</strong> Uses WCAG guidelines to calculate relative luminance</p>
              <p>• <strong>Contrast Optimization:</strong> Chooses black or white text for maximum readability</p>
              <p>• <strong>Real-time Updates:</strong> Colors update automatically when background changes</p>
              <p>• <strong>Hover Effects:</strong> Subtle hover states that maintain contrast</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

