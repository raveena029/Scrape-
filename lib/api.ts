// API utility functions
const API_BASE_URL = "/api"

const dbConfig = {
  connectionLimit: 10,
  queueLimit: 0
}

// Auth functions
export async function loginUser(credentials: {
  username: string,
  password: string,
  role: string
}) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
  return response.json()
}

// Products functions
export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/products`)
  if (!response.ok) throw new Error('Failed to fetch products')
  return response.json()
}

// Store layout functions
export async function getStoreLayout() {
  const response = await fetch(`${API_BASE_URL}/store/layout`)
  if (!response.ok) throw new Error('Failed to fetch store layout')
  return response.json()
}

// Inventory functions
export async function getInventory() {
  const response = await fetch(`${API_BASE_URL}/inventory`)
  if (!response.ok) throw new Error('Failed to fetch inventory')
  return response.json()
}