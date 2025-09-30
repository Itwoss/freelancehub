'use client'

import React from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Linkedin, Instagram, Github } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: 'Integrations', href: '/integrations' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Docs', href: '/docs' },
      { name: 'Changelog', href: '/changelog' },
    ],
    company: [
      { name: 'Blog', href: '/blog' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Help center', href: '/help' },
      { name: 'Sign in', href: '/signin' },
      { name: 'Sign up', href: '/signup' },
    ],
    resources: [
      { name: 'Report a Vulnerability', href: '/report' },
      { name: 'Data Processing Agreement', href: '/dpa' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  }

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'Dribbble', href: '#', icon: Github }, // replace with dribbble if needed
    { name: 'Facebook', href: '#', icon: Facebook },
  ]

  return (
    <footer className="bg-black text-gray-300 relative">
      {/* Newsletter Section */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-semibold text-white">Join our newsletter</h3>
            <p className="text-gray-400 text-sm">
              Get exclusive content and become a part of the Nexus AI community
            </p>
          </div>
          <div className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="Email address"
              className="flex-grow md:flex-grow-0 px-4 py-2 rounded-l-lg bg-black border border-gray-700 text-white placeholder-gray-500 focus:outline-none"
            />
            <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-r-lg">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-t border-gray-800">
        {/* Logo + description */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-pink-600 font-bold text-2xl">N</span>
            <span className="text-white font-semibold text-lg">Nexus AI</span>
          </div>
          <p className="text-gray-400 text-sm max-w-sm">
            Get exclusive content and become a part of the Nexus AI community
          </p>
        </div>

        {/* Product */}
        <div>
          <h3 className="text-white font-semibold mb-4">Product</h3>
          <ul className="space-y-2">
            {footerLinks.product.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-white text-sm">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            {footerLinks.company.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-white text-sm">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-white font-semibold mb-4">Resources</h3>
          <ul className="space-y-2">
            {footerLinks.resources.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-white text-sm">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 py-6 px-4 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <p className="text-gray-500 text-xs">
          © {currentYear} Nexus AI INC. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          {socialLinks.map((social) => (
            <Link
              key={social.name}
              href={social.href}
              aria-label={social.name}
              className="text-gray-400 hover:text-white"
            >
              <social.icon className="w-5 h-5" />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
