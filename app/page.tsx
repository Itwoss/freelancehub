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
  CheckCircle
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
      <main className="pt-24">
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
            <div className="grid lg:grid-cols-2 items-center gap-12">
              {/* Left copy */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-3 mb-6">
                  <span className="rounded-full px-3 py-1 text-sm bg-white/8 text-white/90 backdrop-blur-sm">
                    ✨ Our AI generates support at all times
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
                  Support AI source code
                  <br />
                  ability to <span className="text-pink-400">Think Fast</span>
                </h1>

                <p className="mt-6 max-w-2xl text-gray-300 text-lg">
                  Through our advanced AI technology, we empower developers with the
                  ability to think fast, produce more efficient code, and deliver amazing
                  solutions in less time.
                </p>

                <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start">
                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center rounded-full bg-black/70 border border-white/20 px-6 py-3 text-white shadow-sm hover:opacity-95"
                  >
                    Get Started
                  </Link>

                  <Link
                    href="#how"
                    className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 3v18l15-9L5 3z"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    How it works
                  </Link>
                </div>

                <ul className="mt-8 flex flex-wrap gap-4 text-sm text-gray-300 justify-center lg:justify-start">
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" /> Trusted payments
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-pink-400" /> 10k+ vetted freelancers
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-400" /> Fast matching
                  </li>
                </ul>
              </div>

              {/* Right visual + overlay card */}
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/6 max-w-xl mx-auto lg:ml-auto">
                  <Image
                    src="/images/hero-illustration.jpg"
                    alt="Hero"
                    width={1200}
                    height={800}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="absolute -bottom-8 left-8 bg-gradient-to-r from-white/6 to-white/3 backdrop-blur-sm border border-white/6 rounded-xl p-4 shadow-lg min-w-[240px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-300">Top Project</div>
                      <div className="font-medium">Design a Landing Page</div>
                    </div>
                    <div className="text-sm text-pink-300 font-semibold">$450</div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">2 proposals • 3 days left</div>
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

        {/* PROJECTS SHOWCASE */}
        <section className="py-16 bg-transparent">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white">Featured Projects</h2>
              <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
                Discover amazing projects and talented freelancers ready to bring your ideas to life.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Project Card 1 */}
              <div className="bg-white/6 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">E-commerce Website</h3>
                      <p className="text-sm text-gray-400">Web Development</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-pink-300">$2,500</div>
                    <div className="text-xs text-gray-400">Fixed Price</div>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-4">
                  Build a modern e-commerce platform with React, Node.js, and Stripe integration.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">A</span>
                    </div>
                    <span className="text-sm text-gray-300">Alex Johnson</span>
                  </div>
                  <div className="text-xs text-gray-400">5 days left</div>
                </div>
              </div>

              {/* Project Card 2 */}
              <div className="bg-white/6 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Mobile App Design</h3>
                      <p className="text-sm text-gray-400">UI/UX Design</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-pink-300">$1,200</div>
                    <div className="text-xs text-gray-400">Fixed Price</div>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-4">
                  Design a sleek mobile app interface for a fitness tracking application.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">S</span>
                    </div>
                    <span className="text-sm text-gray-300">Sarah Chen</span>
                  </div>
                  <div className="text-xs text-gray-400">3 days left</div>
                </div>
              </div>

              {/* Project Card 3 */}
              <div className="bg-white/6 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Content Marketing</h3>
                      <p className="text-sm text-gray-400">Marketing</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-pink-300">$800</div>
                    <div className="text-xs text-gray-400">Fixed Price</div>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-4">
                  Create engaging content strategy and social media campaigns for a tech startup.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">M</span>
                    </div>
                    <span className="text-sm text-gray-300">Mike Davis</span>
                  </div>
                  <div className="text-xs text-gray-400">7 days left</div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link 
                href="/projects" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-red-500 text-white px-6 py-3 rounded-full font-medium hover:opacity-95 transition-opacity"
              >
                <Briefcase className="w-5 h-5" />
                View All Projects
                <ArrowRight className="w-4 h-4" />
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
