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

export function Header() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement | null>(null)

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
    <header className="bg-black/90 backdrop-blur-sm border-b border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Mobile menu */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMenuOpen((v) => !v)}
                aria-label="Toggle menu"
                className="p-1 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary-300 md:hidden"
              >
                {isMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
                <span className="sr-only">FreelanceHub</span>
              </Link>
            </div>

            {/* Center: navigation (desktop) */}
            <nav className="hidden md:flex gap-8 items-center">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-mono font-medium text-white hover:text-orange-400 transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Office link */}
              <Link
                href="/mini-office"
                className="text-sm font-mono font-medium text-white hover:text-orange-400 transition-colors duration-200 flex items-center gap-2"
              >
                <Building className="w-4 h-4" />
                Office
              </Link>
            </nav>

            {/* Right: Profile and Contact */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <NotificationBell />

              {/* Profile Icon */}
              {status === 'loading' ? (
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              ) : session ? (
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setIsProfileOpen((v) => !v)}
                    aria-haspopup="true"
                    aria-expanded={isProfileOpen}
                    className="flex items-center gap-2 rounded-full p-1 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center overflow-hidden">
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
                    </div>
                  </button>

                  {isProfileOpen && (
                    <div
                      role="menu"
                      aria-label="Profile menu"
                      className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700 py-2"
                    >
                      <div className="px-3 py-2 text-xs text-gray-400">Signed in as</div>
                      <div className="px-3 pb-2">
                        <div className="text-sm font-medium text-white truncate">{session.user?.name}</div>
                        <div className="text-xs text-gray-400 truncate">{session.user?.email}</div>
                      </div>

                      <hr className="my-2 border-gray-700" />

                      {userNavigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </Link>
                      ))}

                      <button
                        onClick={handleSignOut}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => router.push('/auth/signin')}
                    className="text-white hover:text-orange-400 hover:bg-white/10"
                  >
                    Sign in
                  </Button>
                </div>
              )}

              {/* Contact Button */}
              <Button 
                variant="outline" 
                onClick={() => router.push('/contact')}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 font-mono text-sm"
              >
                CONTACT +
              </Button>
            </div>
          </div>

          {/* Mobile menu panel */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <nav className="flex flex-col gap-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-3 rounded-md text-sm font-mono text-white hover:bg-white/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{item.name}</span>
                  </Link>
                ))}
                
                {/* Office link in mobile menu */}
                <Link
                  href="/mini-office"
                  className="flex items-center gap-3 px-3 py-3 rounded-md text-sm font-mono text-white hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Building className="w-4 h-4" />
                  <span>Office</span>
                </Link>

                <div className="border-t border-gray-700 pt-4 mt-4">
                  {status === 'loading' ? (
                    <div className="h-8 bg-gray-200 rounded animate-pulse" />
                  ) : session ? (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 overflow-hidden">
                          {session.user?.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={session.user.image} alt={session.user.name ?? 'Profile'} className="w-full h-full object-cover" />
                          ) : (
                            <UserCircle className="w-6 h-6 text-white m-2" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{session.user?.name}</div>
                          <div className="text-xs text-gray-400">{session.user?.email}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        onClick={() => { router.push('/auth/signin'); setIsMenuOpen(false) }} 
                        className="w-full text-white hover:text-orange-400 hover:bg-white/10"
                      >
                        Sign in
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => { router.push('/auth/signup'); setIsMenuOpen(false) }} 
                        className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        Sign up
                      </Button>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
  )
}
