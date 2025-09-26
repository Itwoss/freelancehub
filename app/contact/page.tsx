"use client"

import React, { useState } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        setSubmitStatus('error')
        console.error('Form submission error:', result.error)
      }
    } catch (error) {
      setSubmitStatus('error')
      console.error('Network error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "hello@freelancehub.com",
      description: "Send us an email and we'll respond within 24 hours"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      description: "Mon-Fri from 9am to 6pm EST"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "123 Freelance Street, Tech City, TC 12345",
      description: "Come say hello at our office"
    }
  ]

  const faqs = [
    {
      question: "How do I get started as a freelancer?",
      answer: "Simply create an account, complete your profile with your skills and portfolio, and start browsing available projects. You can also set up job alerts to be notified of relevant opportunities."
    },
    {
      question: "What are the fees for using FreelanceHub?",
      answer: "We charge a small service fee on completed projects. For freelancers, it's 3% of the project value. For clients, there are no upfront fees - you only pay when you hire someone."
    },
    {
      question: "How do I ensure payment security?",
      answer: "We use escrow services to hold payments until project completion. This protects both freelancers and clients, ensuring work is delivered before payment is released."
    },
    {
      question: "Can I work with international clients?",
      answer: "Absolutely! Our platform supports freelancers and clients from around the world. We handle currency conversion and international payments seamlessly."
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
                Get in <span className="text-pink-400">Touch</span>
              </h1>
              
              <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
                Have questions? We're here to help! Reach out to our team and we'll 
                get back to you as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white/6 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-white">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-pink-500"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-pink-500"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject" className="text-white">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-pink-500"
                      placeholder="What's this about?"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="text-white">Message</Label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                  
                  {submitStatus === 'success' && (
                    <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-4">
                      <p className="text-green-300 text-sm">
                        ✅ Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
                      </p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
                      <p className="text-red-300 text-sm">
                        ❌ Sorry, there was an error sending your message. Please try again or contact us directly.
                      </p>
                    </div>
                  )}

                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                  <div className="space-y-6">
                    {contactInfo.map((info, idx) => {
                      const Icon = info.icon
                      return (
                        <div key={idx} className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center">
                            <Icon className="w-6 h-6 text-pink-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white mb-1">{info.title}</h3>
                            <p className="text-pink-300 font-medium">{info.details}</p>
                            <p className="text-sm text-gray-400 mt-1">{info.description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Response Time */}
                <div className="bg-white/6 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-5 h-5 text-pink-400" />
                    <h3 className="font-semibold text-white">Response Time</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    We typically respond to all inquiries within 24 hours during business days. 
                    For urgent matters, please call us directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
              <p className="mt-2 text-gray-400">
                Find answers to common questions about our platform.
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white/6 rounded-xl p-6">
                  <h3 className="font-semibold text-white mb-3">{faq.question}</h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-pink-600 to-red-500 text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
            <p className="mt-2 max-w-2xl mx-auto">
              Join thousands of freelancers and clients who are already using FreelanceHub 
              to build successful partnerships.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/auth/signup'}
                className="bg-white text-pink-600 hover:bg-gray-100"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Join Our Community
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/projects'}
                className="border-white/30 text-white hover:bg-white/10"
              >
                Browse Projects
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
