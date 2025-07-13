import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { api } from '../services/axiosAgent'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

// Mock window.location
const locationMock = {
  href: '',
}

describe('Axios 401 Interceptor', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })
    
    // Mock location
    Object.defineProperty(window, 'location', {
      value: locationMock,
      writable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should clear token and redirect on 401 response', async () => {
    // Mock token in localStorage
    localStorageMock.getItem.mockReturnValue('fake-token')
    
    // Mock axios to return 401
    vi.spyOn(api, 'request').mockRejectedValue({
      response: { status: 401 },
      isAxiosError: true,
    })

    try {
      await api.get('/some-protected-endpoint')
    } catch (error) {
      // Error should be thrown
    }

    // Verify token was removed
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
    
    // Verify redirect happened
    expect(locationMock.href).toBe('/')
  })

  it('should not affect non-401 errors', async () => {
    // Mock token in localStorage
    localStorageMock.getItem.mockReturnValue('fake-token')
    
    // Mock axios to return 500
    const mockError = {
      response: { status: 500 },
      isAxiosError: true,
    }
    vi.spyOn(api, 'request').mockRejectedValue(mockError)

    try {
      await api.get('/some-endpoint')
    } catch (error) {
      // Error should be thrown
    }

    // Verify token was NOT removed
    expect(localStorageMock.removeItem).not.toHaveBeenCalled()
    
    // Verify no redirect happened
    expect(locationMock.href).toBe('')
  })

  it('should handle network errors without clearing token', async () => {
    // Mock token in localStorage
    localStorageMock.getItem.mockReturnValue('fake-token')
    
    // Mock network error (no response)
    const networkError = {
      response: undefined,
      isAxiosError: true,
      message: 'Network Error',
    }
    vi.spyOn(api, 'request').mockRejectedValue(networkError)

    try {
      await api.get('/some-endpoint')
    } catch (error) {
      // Error should be thrown
    }

    // Verify token was NOT removed
    expect(localStorageMock.removeItem).not.toHaveBeenCalled()
    
    // Verify no redirect happened
    expect(locationMock.href).toBe('')
  })
}) 