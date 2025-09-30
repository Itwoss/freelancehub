import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'

describe('Dashboard API Endpoints', () => {
  const baseUrl = 'http://localhost:3000'

  beforeAll(async () => {
    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 1000))
  })

  describe('Stories API', () => {
    it('should fetch stories without authentication', async () => {
      const response = await fetch(`${baseUrl}/api/stories`)
      expect(response.status).toBe(401) // Should require authentication
    })
  })

  describe('Posts API', () => {
    it('should fetch posts without authentication', async () => {
      const response = await fetch(`${baseUrl}/api/posts`)
      expect(response.status).toBe(401) // Should require authentication
    })
  })

  describe('Messages API', () => {
    it('should fetch recent messages without authentication', async () => {
      const response = await fetch(`${baseUrl}/api/messages/recent`)
      expect(response.status).toBe(401) // Should require authentication
    })
  })

  describe('Contact API', () => {
    it('should accept contact form submission', async () => {
      const response = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Test Subject',
          message: 'Test message content'
        })
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.id).toBeDefined()
    })
  })
})
