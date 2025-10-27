const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

async function http(method, path, body) {
  try {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`)
    }
    const contentType = res.headers.get('content-type') || ''
    return contentType.includes('application/json') ? res.json() : res.text()
  } catch (error) {
    // If it's a network error (like CORS or connection refused), throw a more specific error
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Backend server not available')
    }
    throw error
  }
}

export const api = {
  // Authentication
  register: (userData) => http('POST', '/api/auth/register', userData),
  login: (credentials) => http('POST', '/api/auth/login', credentials),
  createAdmin: (adminData) => http('POST', '/api/auth/create-admin', adminData),
  
  // Products
  listProducts: () => http('GET', '/api/products'),
  getProduct: (id) => http('GET', `/api/products/${id}`),
  createProduct: (data) => http('POST', '/api/products', data),
  updateProduct: (id, data) => http('PUT', `/api/products/${id}`, data),
  deleteProduct: (id) => http('DELETE', `/api/products/${id}`),
  approveProduct: (id, approved) => http('POST', `/api/products/${id}/approve`, { approved }),
  
  // Admin
  getUsers: () => http('GET', '/api/admin/users'),
  getUserById: (id) => http('GET', `/api/admin/users/${id}`),
  updateUser: (id, data) => http('PUT', `/api/admin/users/${id}`, data),
  deleteUser: (id) => http('DELETE', `/api/admin/users/${id}`),
  getSellersToApprove: () => http('GET', '/api/admin/sellers/approve'),
  approveSeller: (id) => http('PUT', `/api/admin/sellers/approve/${id}`),
}

export default api


