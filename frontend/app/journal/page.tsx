import React from 'react'
import Link from 'next/link'

export default function JournalPage() {
  const journalPosts = [
    {
      id: 1,
      title: "The Future of Freelancing: Trends to Watch in 2024",
      excerpt: "Explore the latest trends shaping the freelance economy and how they're transforming the way we work.",
      author: "Sarah Johnson",
      date: "January 15, 2024",
      readTime: "5 min read",
      category: "Industry Insights",
      image: "/placeholder-image/journal-1.jpg"
    },
    {
      id: 2,
      title: "Building Your Personal Brand as a Freelancer",
      excerpt: "Learn how to create a compelling personal brand that attracts high-quality clients and sets you apart from the competition.",
      author: "Mike Chen",
      date: "January 12, 2024",
      readTime: "7 min read",
      category: "Career Growth",
      image: "/placeholder-image/journal-2.jpg"
    },
    {
      id: 3,
      title: "Remote Work Best Practices for Freelancers",
      excerpt: "Discover essential tips and tools for maintaining productivity and work-life balance while working remotely.",
      author: "Emily Rodriguez",
      date: "January 10, 2024",
      readTime: "6 min read",
      category: "Productivity",
      image: "/placeholder-image/journal-3.jpg"
    },
    {
      id: 4,
      title: "Pricing Your Services: A Complete Guide",
      excerpt: "Master the art of pricing your freelance services to maximize your income while remaining competitive.",
      author: "David Kim",
      date: "January 8, 2024",
      readTime: "8 min read",
      category: "Business",
      image: "/placeholder-image/journal-4.jpg"
    },
    {
      id: 5,
      title: "Client Communication: Building Strong Relationships",
      excerpt: "Learn effective communication strategies that help you build lasting relationships with your clients.",
      author: "Lisa Wang",
      date: "January 5, 2024",
      readTime: "4 min read",
      category: "Communication",
      image: "/placeholder-image/journal-5.jpg"
    },
    {
      id: 6,
      title: "Freelancer Tax Guide: Everything You Need to Know",
      excerpt: "Navigate the complexities of freelance taxes with our comprehensive guide to deductions, quarterly payments, and more.",
      author: "Robert Taylor",
      date: "January 3, 2024",
      readTime: "10 min read",
      category: "Finance",
      image: "/placeholder-image/journal-6.jpg"
    }
  ]

  const categories = ["All", "Industry Insights", "Career Growth", "Productivity", "Business", "Communication", "Finance"]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Journal</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Insights, tips, and stories from the freelance community. Stay updated with the latest trends and best practices.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                category === "All" 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src="/placeholder-image/journal-featured.jpg" 
                  alt="Featured article"
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Featured
                  </span>
                  <span className="text-sm text-gray-500">{journalPosts[0].category}</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {journalPosts[0].title}
                </h2>
                <p className="text-gray-600 mb-6 text-lg">
                  {journalPosts[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>By {journalPosts[0].author}</span>
                    <span>•</span>
                    <span>{journalPosts[0].date}</span>
                    <span>•</span>
                    <span>{journalPosts[0].readTime}</span>
                  </div>
                  <Link 
                    href={`/journal/${journalPosts[0].id}`}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Journal Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {journalPosts.slice(1).map((post) => (
            <article key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>By {post.author}</span>
                  <span>{post.readTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <Link 
                    href={`/journal/${post.id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            Load More Articles
          </button>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-blue-600 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Updated with Our Journal
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Get the latest freelance insights, tips, and industry news delivered to your inbox.
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-300"
              />
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

