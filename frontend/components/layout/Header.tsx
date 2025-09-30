'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
  Plus,
  Home,
  Briefcase,
  Star,
  Users,
  Building,
  FileText,
  UserCircle
} from 'lucide-react'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { cn } from '@/lib/utils'
import { useMenuContrast } from '@/lib/hooks/useDynamicContrast'

export function Header() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement | null>(null)
  const headerRef = useRef<HTMLDivElement | null>(null)
  
  // Get dynamic contrast colors based on background
  const menuContrast = useMenuContrast(headerRef)

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const navigation = [
    { name: 'HOME', href: '/' },
    { name: 'ABOUT', href: '/about' },
    { name: 'PROJECTS', href: '/projects' },
    { name: 'JOURNAL', href: '/journal' }
  ]

  const userNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: User },
    { name: 'My Projects', href: '/dashboard/projects', icon: Briefcase },
    { name: 'Orders', href: '/dashboard/orders', icon: Star },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings }
  ]

  return (
    <div ref={headerRef} className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      <header className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl shadow-black/20" >
        <div className="flex items-center justify-between h-16 px-6">
            {/* Left: Mobile Menu + Profile Avatar */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen((v) => !v)}
                aria-label="Toggle menu"
                className="p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 md:hidden transition-all duration-300"
              >
                {isMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
              </button>

              {/* Profile Avatar */}
              {status === 'loading' ? (
                <div className="w-10 h-10 bg-white/20 rounded-full animate-pulse" />
              ) : session ? (
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setIsProfileOpen((v) => !v)}
                    aria-haspopup="true"
                    aria-expanded={isProfileOpen}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center overflow-hidden ring-2 ring-white/30 hover:ring-white/50 transition-all duration-300"
                  >
                    {session.user?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={session.user.image}
                        alt={session.user.name ?? 'Profile'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserCircle className="w-6 h-6 text-white" />
                    )}
                  </button>

                  {isProfileOpen && (
                    <div
                      role="menu"
                      aria-label="Profile menu"
                      className="absolute left-0 mt-2 w-48 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2"
                    >
                      <div className="px-3 py-2 text-xs text-white/60">Signed in as</div>
                      <div className="px-3 pb-2">
                        <div className="text-sm font-medium text-white truncate">{session.user?.name}</div>
                        <div className="text-xs text-white/60 truncate">{session.user?.email}</div>
                      </div>

                      <hr className="my-2 border-white/20" />

                      {userNavigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-white rounded-lg mx-2"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </Link>
                      ))}

                      <button
                        onClick={handleSignOut}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg mx-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center ring-2 ring-white/30 hover:ring-white/50 transition-all duration-300">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                </Link>
              )}
            </div>

            {/* Center: Navigation Menu */}
            <nav className="hidden md:flex gap-1 items-center">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105"
                  style={{
                    color: menuContrast.menuTextColorSubtle,
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = menuContrast.menuHoverTextColor
                    e.currentTarget.style.backgroundColor = menuContrast.menuHoverBackground
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = menuContrast.menuTextColorSubtle
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Office link */}
              <Link
                href="/mini-office"
                className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105 flex items-center gap-2"
                style={{
                  color: menuContrast.menuTextColorSubtle,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = menuContrast.menuHoverTextColor
                  e.currentTarget.style.backgroundColor = menuContrast.menuHoverBackground
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = menuContrast.menuTextColorSubtle
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <Building className="w-4 h-4" />
                Office
              </Link>
            </nav>

            {/* Right: Contact Button */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <NotificationBell />
              </div>

              {/* Contact Button */}
              <Button 
                onClick={() => router.push('/contact')}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Contact +
              </Button>
            </div>
          </div>
      
      </header>

      {/* Mobile menu panel */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-4">
          <nav className="flex flex-col gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300"
                style={{
                  color: menuContrast.menuTextColorSubtle,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = menuContrast.menuHoverTextColor
                  e.currentTarget.style.backgroundColor = menuContrast.menuHoverBackground
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = menuContrast.menuTextColorSubtle
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{item.name}</span>
              </Link>
            ))}
            
            {/* Office link in mobile menu */}
            <Link
              href="/mini-office"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300"
              style={{
                color: menuContrast.menuTextColorSubtle,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = menuContrast.menuHoverTextColor
                e.currentTarget.style.backgroundColor = menuContrast.menuHoverBackground
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = menuContrast.menuTextColorSubtle
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              <Building className="w-4 h-4" />
              <span>Office</span>
            </Link>

            {!session && (
              <div className="border-t border-white/20 pt-4 mt-4">
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => { router.push('/auth/signin'); setIsMenuOpen(false) }} 
                    className="flex-1 text-white/90 hover:text-white hover:bg-white/10 rounded-xl"
                  >
                    Sign in
                  </Button>
                  <Button 
                    onClick={() => { router.push('/contact'); setIsMenuOpen(false) }} 
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl"
                  >
                    Contact +
                  </Button>
                </div>
              </div>
            )}
          </nav>
        </div>
      )}
    </div>
  )
}
