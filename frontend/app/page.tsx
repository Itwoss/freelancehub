"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/Header"          // <-- your header preserved
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import {
  ArrowRight,
  Star,
  Users,
  Briefcase,
  Shield,
  Zap,
  CheckCircle,
  BookOpen,
  Eye,
  ExternalLink
} from "lucide-react"

/**
 * Use this file as your homepage. Header content is not changed —
 * it renders your existing <Header /> component at the top.
 *
 * Replace image paths if you have custom assets.
 */

export default function HomePage() {
  const features = [
    {
      icon: Users,
      title: "Find Top Talent",
      description: "Browse verified freelancers with portfolios and real reviews."
    },
    {
      icon: Briefcase,
      title: "Quality Projects",
      description: "Post projects with milestones and attract high-quality bids."
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Escrow and instant invoicing keep payments safe for both sides."
    },
    {
      icon: Zap,
      title: "Fast Matching",
      description: "Smart matching surfaces the best candidates for every job."
    }
  ]

  const stats = [
    { label: "Active Freelancers", value: 10000 },
    { label: "Projects Completed", value: 50000 },
    { label: "Happy Clients", value: 25000 },
    { label: "Countries", value: 100 }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Freelance Designer",
      content:
        "FreelanceHub helped me replace full-time income within months. The clients are great and communication is simple.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Software Developer",
      content: "Great platform — reliable payments and high-quality projects.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Consultant",
      content: "I scaled my consultancy and found long-term clients here.",
      rating: 5
    }
  ]

  // stat count animation
  const [counts, setCounts] = useState(stats.map(() => 0))
  useEffect(() => {
    const duration = 1000
    const fps = 30
    const steps = Math.round((duration / 1000) * fps)
    let step = 0
    const diffs = stats.map((s) => s.value)
    const iv = setInterval(() => {
      step++
      setCounts(diffs.map((d) => Math.round((Math.min(step, steps) / steps) * d)))
      if (step >= steps) clearInterval(iv)
    }, duration / steps)
    return () => clearInterval(iv)
  }, [])

  // testimonial carousel
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 5500)
    return () => clearInterval(t)
  }, [])

  // scroll effect for header/backdrop (doesn't change your Header, only used for spacing if needed)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      {/* YOUR HEADER (unchanged) */}
      <Header />

      {/* HERO */}
      <main className="pt-20">
        <section className="relative overflow-hidden">
          {/* background gradient + dotted pattern */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#2b0b0f]/40 to-black opacity-95" />
            <div
              className="absolute inset-0 opacity-18"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)",
                backgroundSize: "16px 16px"
              }}
            />
            <svg
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 800 400"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="r" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#66121f" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#r)" />
            </svg>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-3 mb-6">
                <span className="rounded-full px-4 py-2 text-sm bg-white/10 text-white/90 backdrop-blur-sm border border-white/20">
                  🚀 Discover Amazing Projects
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
                Find Your Next
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                  Project
                </span>
              </h1>

              <p className="mt-6 max-w-3xl mx-auto text-gray-300 text-xl">
                Connect with talented freelancers and discover amazing projects. 
                From web development to design, find the perfect match for your skills.
              </p>

              <div className="mt-10 flex items-center gap-6 justify-center">
                <Link
                  href="/projects"
                  className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Browse Projects
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>

                <Link
                  href="/projects/create"
                  className="inline-flex items-center rounded-full border border-white/20 px-8 py-4 text-white hover:bg-white/10 transition-all duration-300"
                >
                  Post a Project
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">10k+</div>
                  <div className="text-sm text-gray-400">Active Freelancers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">50k+</div>
                  <div className="text-sm text-gray-400">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">25k+</div>
                  <div className="text-sm text-gray-400">Happy Clients</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Spacer so floating card doesn't overlap next sections */}
        <div className="h-20" />

        {/* STATS (light card on dark bg) */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-white/6 rounded-xl p-6">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-pink-300">
                    {counts[i].toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-300 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-16 bg-transparent">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white">Why customers choose FreelanceHub</h2>
              <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
                Tools and services that make freelancing simple and secure.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, idx) => {
                const Icon = f.icon
                return (
                  <article
                    key={idx}
                    className="relative bg-white/6 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-lg bg-white/8 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-pink-300" />
                    </div>
                    <h3 className="font-semibold text-lg text-white">{f.title}</h3>
                    <p className="mt-2 text-sm text-gray-300">{f.description}</p>
                    <div className="mt-4">
                      <Link
                        href="/features"
                        className="text-sm font-medium text-pink-300 inline-flex items-center"
                      >
                        Learn more
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* FEATURED PROJECTS SHOWCASE */}
        <section className="py-20 bg-transparent">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                <span className="text-orange-400 font-medium text-sm uppercase tracking-wide">Featured Projects</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Discover Amazing
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500"> Projects</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Handpicked projects from talented freelancers. Find your next opportunity or get inspired by amazing work.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Project Card 1 */}
              <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">E-commerce Platform</h3>
                      <p className="text-sm text-gray-400">Web Development</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-400">$2,500</div>
                    <div className="text-xs text-gray-400">Fixed Price</div>
                  </div>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Build a modern e-commerce platform with React, Node.js, and Stripe integration. 
                  Looking for a full-stack developer with e-commerce experience.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-sm text-white font-bold">AJ</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Alex Johnson</div>
                      <div className="text-xs text-gray-400">5 days left</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-300">4.9</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">React</span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">Node.js</span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">Stripe</span>
                </div>
              </div>

              {/* Project Card 2 */}
              <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Mobile App Design</h3>
                      <p className="text-sm text-gray-400">UI/UX Design</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-400">$1,200</div>
                    <div className="text-xs text-gray-400">Fixed Price</div>
                  </div>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Design a sleek mobile app interface for a fitness tracking application. 
                  Need modern, intuitive design with excellent user experience.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-sm text-white font-bold">SC</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Sarah Chen</div>
                      <div className="text-xs text-gray-400">3 days left</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-300">4.8</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">Figma</span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">UI/UX</span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">Mobile</span>
                </div>
              </div>

              {/* Project Card 3 */}
              <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Content Marketing</h3>
                      <p className="text-sm text-gray-400">Marketing</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-400">$800</div>
                    <div className="text-xs text-gray-400">Fixed Price</div>
                  </div>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Create engaging content strategy and social media campaigns for a tech startup. 
                  Looking for creative marketer with startup experience.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-sm text-white font-bold">MD</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Mike Davis</div>
                      <div className="text-xs text-gray-400">7 days left</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-300">4.7</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full">SEO</span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">Social Media</span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">Content</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link 
                href="/projects" 
                className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Briefcase className="w-5 h-5" />
                View All Projects
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="py-20 bg-transparent">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                <span className="text-orange-400 font-medium text-sm uppercase tracking-wide">Featured Products</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Premium Digital
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500"> Products</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover our collection of premium templates, designs, and digital products. 
                Perfect for your next project or business venture.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Product Card 1 */}
              <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                <div className="relative aspect-video bg-gray-800 rounded-xl mb-6 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-white/50" />
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button className="bg-white text-black hover:bg-gray-200">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Popular
                  </div>
                </div>
                
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Nexus AI - Framer Template</h3>
                    <p className="text-gray-400 text-sm">AI Platform Marketing Template</p>
                  </div>
                  <div className="text-2xl font-bold text-orange-400">$69</div>
                </div>
                
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                  Dynamic solution combining AI Platform Marketing with 7 collections in an elegant Dark Theme.
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-300">4.9 (127 reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">Dark Theme</span>
                    <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">AI</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Book Now
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Product Card 2 */}
              <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                <div className="relative aspect-video bg-gray-800 rounded-xl mb-6 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-white/50" />
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button className="bg-white text-black hover:bg-gray-200">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    New
                  </div>
                </div>
                
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">E-commerce Dashboard</h3>
                    <p className="text-gray-400 text-sm">Analytics & Management Template</p>
                  </div>
                  <div className="text-2xl font-bold text-orange-400">$89</div>
                </div>
                
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                  Modern e-commerce dashboard with analytics, order management, and customer insights.
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-300">4.8 (89 reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">React</span>
                    <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">Dashboard</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Book Now
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Product Card 3 */}
              <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                <div className="relative aspect-video bg-gray-800 rounded-xl mb-6 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-white/50" />
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button className="bg-white text-black hover:bg-gray-200">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Mobile App UI Kit</h3>
                    <p className="text-gray-400 text-sm">Complete Mobile Design System</p>
                  </div>
                  <div className="text-2xl font-bold text-orange-400">$49</div>
                </div>
                
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                  Complete mobile app UI kit with 50+ screens, components, and design system.
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-300">4.7 (156 reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">Mobile</span>
                    <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">UI Kit</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Book Now
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link 
                href="/products" 
                className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <BookOpen className="w-5 h-5" />
                View All Products
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white">What our users say</h2>
              <p className="mt-2 text-gray-400">Real stories from freelancers and clients using FreelanceHub.</p>
            </div>

            <div className="relative">
              <div className="bg-white/6 rounded-xl shadow p-6">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 flex items-center justify-center bg-white/12 rounded-full font-semibold text-white">
                    {testimonials[index].name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="font-semibold text-white">{testimonials[index].name}</div>
                      <div className="text-sm text-gray-300">• {testimonials[index].role}</div>
                      <div className="ml-4 flex items-center gap-1 text-yellow-400">
                        {Array.from({ length: testimonials[index].rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4" />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-gray-300 italic">“{testimonials[index].content}”</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setIndex(i)}
                        aria-label={`Show testimonial ${i + 1}`}
                        className={`w-2 h-2 rounded-full ${i === index ? "bg-pink-300" : "bg-gray-400/40"}`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
                      aria-label="Previous testimonial"
                      className="p-2 rounded-md hover:bg-white/8"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
                      aria-label="Next testimonial"
                      className="p-2 rounded-md hover:bg-white/8"
                    >
                      ›
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-pink-600 to-red-500 text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold">Ready to start?</h2>
            <p className="mt-2 max-w-2xl mx-auto">Create your account, post a project, or find freelance work — all in one place.</p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="inline-flex items-center rounded-full bg-black/10 border border-white/20 px-6 py-3 text-white shadow-sm hover:opacity-95">
                Create account
              </Link>
              <Link href="/projects" className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 text-white hover:bg-white/10">
                Browse Projects
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* YOUR FOOTER (unchanged) */}
      <Footer />
    </div>
  )
}
