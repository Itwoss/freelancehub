"use client"

import React, { useState } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { Calendar, User, Tag, ArrowRight, Search, Filter } from "lucide-react"

export default function JournalPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Posts" },
    { id: "design", name: "Design" },
    { id: "development", name: "Development" },
    { id: "business", name: "Business" },
    { id: "freelancing", name: "Freelancing" }
  ]

  const blogPosts = [
    {
      id: 1,
      title: "How to Choose the Right Palette for Your Brand",
      excerpt: "Learn the essential principles of color theory and how to create a cohesive brand identity that resonates with your target audience.",
      author: "Sarah Chen",
      date: "FEB 24, 2025",
      category: "design",
      readTime: "5 min read",
      image: "/images/blog/palette.jpg",
      featured: true
    },
    {
      id: 2,
      title: "Building Scalable React Applications",
      excerpt: "Best practices for structuring large React applications, including state management, component organization, and performance optimization.",
      author: "Michael Rodriguez",
      date: "FEB 22, 2025",
      category: "development",
      readTime: "8 min read",
      image: "/images/blog/react.jpg",
      featured: false
    },
    {
      id: 3,
      title: "The Future of Remote Work",
      excerpt: "Exploring how the freelance economy is evolving and what it means for both freelancers and businesses in the post-pandemic world.",
      author: "Emily Johnson",
      date: "FEB 20, 2025",
      category: "business",
      readTime: "6 min read",
      image: "/images/blog/remote-work.jpg",
      featured: false
    },
    {
      id: 4,
      title: "Pricing Your Services as a Freelancer",
      excerpt: "A comprehensive guide to setting competitive rates, understanding market value, and building sustainable freelance pricing strategies.",
      author: "David Kim",
      date: "FEB 18, 2025",
      category: "freelancing",
      readTime: "7 min read",
      image: "/images/blog/pricing.jpg",
      featured: false
    },
    {
      id: 5,
      title: "UI/UX Design Trends for 2025",
      excerpt: "Discover the latest design trends that will shape user experiences in 2025, from micro-interactions to accessibility improvements.",
      author: "Lisa Wang",
      date: "FEB 16, 2025",
      category: "design",
      readTime: "4 min read",
      image: "/images/blog/ui-trends.jpg",
      featured: false
    },
    {
      id: 6,
      title: "Building Your Personal Brand",
      excerpt: "Learn how to establish a strong personal brand that attracts clients and sets you apart in the competitive freelance market.",
      author: "Alex Thompson",
      date: "FEB 14, 2025",
      category: "freelancing",
      readTime: "9 min read",
      image: "/images/blog/personal-brand.jpg",
      featured: false
    }
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredPost = blogPosts.find(post => post.featured)
  const regularPosts = filteredPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#2b0b0f]/40 to-black opacity-95" />
            <div
              className="absolute inset-0 opacity-18"
              style={{
                backgroundImage: "radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)",
                backgroundSize: "16px 16px"
              }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
                Our <span className="text-pink-400">Journal</span>
              </h1>
              
              <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
                Insights, tips, and stories from the freelance community. 
                Learn from experts and stay updated with the latest trends.
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? "bg-pink-500 text-white"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="py-8">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="bg-white/6 rounded-2xl overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="p-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                      <Tag className="w-4 h-4 text-pink-400" />
                      <span className="text-sm text-pink-400 font-medium uppercase tracking-wide">
                        Featured Article
                      </span>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white mb-4">
                      {featuredPost.title}
                    </h2>
                    
                    <p className="text-gray-300 mb-6 text-lg">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">{featuredPost.date}</span>
                      </div>
                      <span className="text-sm text-gray-400">{featuredPost.readTime}</span>
                    </div>
                    
                    <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                      Read Article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                  
                  <div className="bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
                    <div className="text-center text-white p-8">
                      <div className="text-6xl font-bold mb-4">🎨</div>
                      <p className="text-lg opacity-90">Featured Article</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white/6 rounded-xl overflow-hidden hover:bg-white/8 transition-colors group"
                >
                  <div className="bg-gradient-to-br from-pink-500 to-red-500 h-48 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-4xl font-bold mb-2">📝</div>
                      <p className="text-sm opacity-90">Article Image</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4 text-pink-400" />
                      <span className="text-sm text-pink-400 font-medium uppercase tracking-wide">
                        {post.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-300 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-300 mb-4 text-sm">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            {post.author.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{post.author}</div>
                          <div className="text-xs text-gray-400">{post.date}</div>
                        </div>
                      </div>
                      
                      <span className="text-xs text-gray-400">{post.readTime}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">No articles found matching your criteria.</div>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                  }}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-gradient-to-r from-pink-600 to-red-500 text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold">Stay Updated</h2>
            <p className="mt-2 max-w-2xl mx-auto">
              Get the latest articles, tips, and insights delivered to your inbox. 
              Join thousands of freelancers who trust our content.
            </p>

            <div className="mt-8 max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <Button className="bg-white text-pink-600 hover:bg-gray-100">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
