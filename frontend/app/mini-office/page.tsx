"use client"

import Link from "next/link"

export default function MiniOfficePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <section className="mb-10">
        <h1 className="text-3xl font-semibold">Mini Office</h1>
        <p className="mt-2 text-neutral-600">A lightweight workspace to navigate common actions quickly.</p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Dashboard" href="/dashboard" description="View your overview, orders and profile." />
        <Card title="Projects" href="/projects" description="Browse and manage projects." />
        <Card title="Products" href="/products" description="Explore marketplace products." />
        <Card title="Orders" href="/dashboard/orders" description="See your recent orders." />
        <Card title="Profile" href="/dashboard/profile" description="Update your account details." />
        <Card title="Admin" href="/admin/login" description="Administrator sign in." />
      </div>
    </main>
  )
}

function Card({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-neutral-200 p-5 transition hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="mt-1 text-sm text-neutral-600">{description}</p>
    </Link>
  )
}


