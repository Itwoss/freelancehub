import {
  formatPrice,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  truncateText,
  generateSlug,
  debounce,
  throttle,
} from '@/lib/utils'

describe('Utility Functions', () => {
  describe('formatPrice', () => {
    it('formats price correctly', () => {
      expect(formatPrice(100)).toBe('$100.00')
      expect(formatPrice(1234.56)).toBe('$1,234.56')
      expect(formatPrice(0)).toBe('$0.00')
    })
  })

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2023-12-25')
      expect(formatDate(date)).toBe('December 25, 2023')
    })

    it('formats date string correctly', () => {
      expect(formatDate('2023-12-25')).toBe('December 25, 2023')
    })
  })

  describe('formatDateTime', () => {
    it('formats date and time correctly', () => {
      const date = new Date('2023-12-25T14:30:00')
      expect(formatDateTime(date)).toBe('Dec 25, 2023, 2:30 PM')
    })
  })

  describe('formatRelativeTime', () => {
    it('formats relative time correctly', () => {
      const now = new Date()
      const oneMinuteAgo = new Date(now.getTime() - 60000)
      const oneHourAgo = new Date(now.getTime() - 3600000)
      const oneDayAgo = new Date(now.getTime() - 86400000)

      expect(formatRelativeTime(oneMinuteAgo)).toBe('1 minute ago')
      expect(formatRelativeTime(oneHourAgo)).toBe('1 hour ago')
      expect(formatRelativeTime(oneDayAgo)).toBe('1 day ago')
    })

    it('returns "just now" for recent times', () => {
      const now = new Date()
      expect(formatRelativeTime(now)).toBe('just now')
    })
  })

  describe('truncateText', () => {
    it('truncates text correctly', () => {
      const longText = 'This is a very long text that should be truncated'
      expect(truncateText(longText, 20)).toBe('This is a very long...')
    })

    it('returns original text if within limit', () => {
      const shortText = 'Short text'
      expect(truncateText(shortText, 20)).toBe('Short text')
    })
  })

  describe('generateSlug', () => {
    it('generates slug correctly', () => {
      expect(generateSlug('Hello World!')).toBe('hello-world')
      expect(generateSlug('Test@#$%^&*()')).toBe('test')
      expect(generateSlug('Multiple   Spaces')).toBe('multiple-spaces')
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('debounces function calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('throttles function calls', () => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn()
      throttledFn()
      throttledFn()

      expect(mockFn).toHaveBeenCalledTimes(1)

      jest.advanceTimersByTime(100)
      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(2)
    })
  })
})


