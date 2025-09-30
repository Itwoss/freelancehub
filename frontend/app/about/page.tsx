"use client"

import React from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { ArrowRight, Users, Target, Award, Heart } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Users,
      title: "Community First",
      description: "We believe in building a supportive community where freelancers and clients can thrive together."
    },
    {
      icon: Target,
      title: "Quality Focus",
      description: "Every project and freelancer is carefully vetted to ensure the highest standards of work."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We're committed to providing the best platform experience for all our users."
    },
    {
      icon: Heart,
      title: "Passion",
      description: "We're passionate about connecting talented people with meaningful work opportunities."
    }
  ]

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "/images/team/sarah.jpg",
      description: "Former freelance designer with 10+ years experience building successful teams."
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "/images/team/michael.jpg", 
      description: "Tech leader focused on creating seamless user experiences and scalable solutions."
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Community",
      image: "/images/team/emily.jpg",
      description: "Passionate about building inclusive communities and supporting freelancer success."
    }
  ]

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
                About <span className="text-pink-400">FreelanceHub</span>
              </h1>
              
              <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
                We're on a mission to revolutionize the freelance economy by connecting 
                talented professionals with meaningful work opportunities.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    FreelanceHub was born from a simple observation: the freelance economy 
                    was growing rapidly, but existing platforms weren't meeting the needs 
                    of modern professionals.
                  </p>
                  <p>
                    Founded in 2020 by a team of former freelancers and tech entrepreneurs, 
                    we set out to create a platform that prioritizes quality, community, 
                    and fair compensation for all parties.
                  </p>
                  <p>
                    Today, we're proud to support thousands of freelancers and clients 
                    worldwide, facilitating millions in successful project completions.
                  </p>
                </div>
              </div>
              
              <div className="bg-white/6 rounded-xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-300">10K+</div>
                    <div className="text-sm text-gray-400 mt-1">Active Freelancers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-300">50K+</div>
                    <div className="text-sm text-gray-400 mt-1">Projects Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-300">25K+</div>
                    <div className="text-sm text-gray-400 mt-1">Happy Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-300">100+</div>
                    <div className="text-sm text-gray-400 mt-1">Countries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-transparent">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">Our Values</h2>
              <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
                The principles that guide everything we do at FreelanceHub.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, idx) => {
                const Icon = value.icon
                return (
                  <div
                    key={idx}
                    className="bg-white/6 rounded-xl p-6 text-center hover:bg-white/8 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-white/8 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-pink-300" />
                    </div>
                    <h3 className="font-semibold text-lg text-white mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-300">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">Meet Our Team</h2>
              <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
                The passionate people behind FreelanceHub's success.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, idx) => (
                <div key={idx} className="bg-white/6 rounded-xl p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-white mb-1">{member.name}</h3>
                  <p className="text-pink-300 text-sm mb-3">{member.role}</p>
                  <p className="text-sm text-gray-300">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-pink-600 to-red-500 text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold">Join Our Community</h2>
            <p className="mt-2 max-w-2xl mx-auto">
              Whether you're a freelancer looking for opportunities or a client seeking talent, 
              we'd love to have you join our growing community.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/auth/signup'}
                className="bg-black/10 border border-white/20 text-white hover:bg-black/20"
              >
                Get Started
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/contact'}
                className="border-white/30 text-white hover:bg-white/10"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
