import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/context/AuthContext.jsx'
import { api } from '@/api/client.js'
import PropTypes from 'prop-types'

const ProductContext = createContext(null)

export function useProducts() {
  return useContext(ProductContext)
}

export function ProductProvider({ children }) {
  const { user, isAdmin } = useAuth()
  // Start with empty products array - all products will be added through seller/admin actions
  const [products, setProducts] = useState([])

  const loadProducts = async () => {
    try {
      const data = await api.listProducts()
      if (Array.isArray(data)) {
        setProducts(data)
        console.log('✅ Loaded products from backend:', data.length)
      }
    } catch (error) {
      console.log('⚠️ Backend not available, using local state only:', error.message)
      // Fallback: keep local initial state (empty array)
    }
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!cancelled) {
        await loadProducts()
      }
    })()
    return () => { cancelled = true }
  }, [])

  const updateProductPrice = (productId, newPrice) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, price: Number(newPrice) } : p))
    ;(async () => {
      try { 
        await api.updateProduct(productId, { price: Number(newPrice) }) 
      } catch (error) {
        console.error('Failed to update product price:', error)
      }
    })()
  }

  const addProductImage = (productId, imageUrl) => {
    if (!imageUrl) return
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p
      const images = Array.isArray(p.images) ? p.images : []
      return { ...p, images: [...images, imageUrl] }
    }))
    ;(async () => {
      try { 
        await api.updateProduct(productId, { $push: { images: imageUrl } }) 
      } catch (error) {
        console.error('Failed to add product image:', error)
      }
    })()
  }

  const createProduct = (draft) => {
    const newId = String(Date.now()) // Use timestamp for unique ID
    const newProduct = {
      id: newId,
      name: draft.name,
      description: draft.description,
      description_long: draft.description_long || draft.description,
      price: Number(draft.price || 0),
      category: draft.category || 'misc',
      image: draft.images && draft.images.length > 0 ? draft.images[0] : '', // Main image is first image
      images: draft.images || [], // All images
      sizes: draft.sizes || [],
      color: draft.color || '',
      rating: 0,
      reviews: [],
      ownerEmail: user ? user.email : null,
      status: isAdmin ? 'approved' : 'pending', // Sellers get 'pending', admins get 'approved'
      discount: Number(draft.discount || 0),
    }
    console.log('Creating product:', newProduct) // Debug log
    setProducts(prev => [newProduct, ...prev])
    ;(async () => {
      try {
        const saved = await api.createProduct(newProduct)
        if (saved && saved.id) {
          // Backend may return the final saved object, so update state
          setProducts(prev => prev.map(p => p.id === newId ? saved : p))
        }
      } catch (error) {
        console.error("Failed to save product:", error)
        // Revert the optimistic update
        setProducts(prev => prev.filter(p => p.id !== newId))
        alert("Failed to save product. Please try again.")
      }
    })()
    return newProduct
  }

  const updateProduct = (productId, updates) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updates } : p))
    ;(async () => { 
      try { 
        await api.updateProduct(productId, updates) 
      } catch (error) {
        console.error('Failed to update product:', error)
      }
    })()
  }

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId))
    ;(async () => { 
      try { 
        await api.deleteProduct(productId) 
      } catch (error) {
        console.error('Failed to delete product:', error)
      }
    })()
  }

  const setDiscount = (productId, discount) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, discount: Number(discount) } : p))
    ;(async () => { 
      try { 
        await api.updateProduct(productId, { discount: Number(discount) }) 
      } catch (error) {
        console.error('Failed to set discount:', error)
      }
    })()
  }

  const approveProduct = (productId, approved) => {
    console.log(`Approving product ${productId}: ${approved}`) // Debug log
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: approved ? 'approved' : 'rejected' } : p))
    ;(async () => { 
      try { 
        await api.approveProduct(productId, approved)
        // Refresh products after approval to ensure all clients see the update
        await loadProducts()
      } catch (error) {
        console.error('Failed to approve product:', error)
      }
    })()
  }

  // Enhanced function to get personalized recommendations based on user behavior
  const getRecommendations = (userId, limit = 8) => {
    // Get recently viewed products from localStorage
    const recentlyViewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    
    // Get wishlist items from localStorage
    const wishlistItems = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    // Get user's preferred categories from wishlist and recently viewed
    const preferredCategories = [
      ...wishlistItems.map(item => item.category),
      ...products
        .filter(p => recentlyViewedIds.includes(p.id))
        .map(p => p.category)
    ];
    
    // Get approved products
    const approvedProducts = products.filter(p => p.status === 'approved');
    
    // If we have preferred categories, prioritize products from those categories
    if (preferredCategories.length > 0) {
      // Count category preferences
      const categoryCount = {};
      preferredCategories.forEach(cat => {
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
      
      // Sort products by category preference and rating
      return approvedProducts
        .sort((a, b) => {
          const aCatScore = categoryCount[a.category] || 0;
          const bCatScore = categoryCount[b.category] || 0;
          
          // First sort by category preference
          if (aCatScore !== bCatScore) {
            return bCatScore - aCatScore;
          }
          
          // Then by rating
          return (b.rating || 0) - (a.rating || 0);
        })
        .slice(0, limit);
    }
    
    // Fallback: return products with highest ratings
    return approvedProducts
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  }

  // Enhanced function to get recently viewed products
  const getRecentlyViewed = (limit = 8) => {
    // Get recently viewed product IDs from localStorage
    const recentlyViewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    
    // Map IDs to actual products and filter approved ones
    return recentlyViewedIds
      .map(id => products.find(p => p.id === id && p.status === 'approved'))
      .filter(Boolean) // Remove undefined/null values
      .slice(0, limit);
  }

  // Enhanced function to search products with better predictive search
  const searchProducts = (query) => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    
    // Filter products that match the query
    const matchedProducts = products.filter(p => 
      p.status === 'approved' && 
      (p.name.toLowerCase().includes(lowerQuery) || 
       p.description.toLowerCase().includes(lowerQuery) ||
       p.category.toLowerCase().includes(lowerQuery) ||
       (p.color && p.color.toLowerCase().includes(lowerQuery)) ||
       (p.tags && p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))))
    );
    
    // Sort by relevance (exact matches first, then partial matches)
    return matchedProducts.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      
      // Exact name match gets highest priority
      if (aName === lowerQuery) return -1;
      if (bName === lowerQuery) return 1;
      
      // Name starts with query gets high priority
      if (aName.startsWith(lowerQuery)) return -1;
      if (bName.startsWith(lowerQuery)) return 1;
      
      // Category match gets medium priority
      const aCategory = a.category.toLowerCase();
      const bCategory = b.category.toLowerCase();
      if (aCategory === lowerQuery) return -1;
      if (bCategory === lowerQuery) return 1;
      if (aCategory.startsWith(lowerQuery)) return -1;
      if (bCategory.startsWith(lowerQuery)) return 1;
      
      // Default sorting by rating
      return (b.rating || 0) - (a.rating || 0);
    });
  }

  // Function to get trending products based on views and purchases
  const getTrendingProducts = (limit = 8) => {
    // For now, return products with highest ratings
    // In a real implementation, this would use view counts, purchase frequency, etc.
    const approvedProducts = products.filter(p => p.status === 'approved');
    return approvedProducts
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  }

  // Function to get products on sale
  const getSaleProducts = (limit = 8) => {
    const approvedProducts = products.filter(p => 
      p.status === 'approved' && p.discount > 0
    );
    return approvedProducts
      .sort((a, b) => b.discount - a.discount) // Sort by highest discount first
      .slice(0, limit);
  }

  // Function to get new arrivals
  const getNewArrivals = (limit = 8) => {
    // For now, return recently added products
    // In a real implementation, this would use creation dates
    const approvedProducts = products.filter(p => p.status === 'approved');
    return approvedProducts
      .sort((a, b) => b.id.localeCompare(a.id)) // Sort by ID (newer first)
      .slice(0, limit);
  }

  // Function to get best selling products
  const getBestSellers = (limit = 8) => {
    // For now, return products with highest ratings
    // In a real implementation, this would use actual sales data
    const approvedProducts = products.filter(p => p.status === 'approved');
    return approvedProducts
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  }

  // Function to get products by category with sorting options
  const getProductsByCategory = (category, sortBy = 'rating') => {
    const approvedProducts = products.filter(p => 
      p.status === 'approved' && p.category.toLowerCase() === category.toLowerCase()
    );
    
    switch (sortBy) {
      case 'price-asc':
        return approvedProducts.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return approvedProducts.sort((a, b) => b.price - a.price);
      case 'rating':
        return approvedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest':
        return approvedProducts.sort((a, b) => b.id.localeCompare(a.id));
      case 'discount':
        return approvedProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      default:
        return approvedProducts;
    }
  }

  const value = useMemo(() => ({
    products,
    updateProductPrice,
    addProductImage,
    createProduct,
    updateProduct,
    deleteProduct,
    setDiscount,
    approveProduct,
    loadProducts, // Expose loadProducts function
    getRecommendations, // Enhanced function for personalized recommendations
    getRecentlyViewed, // Enhanced function for recently viewed products
    searchProducts, // Enhanced function for predictive search
    getTrendingProducts, // Function for trending products
    getSaleProducts, // Function for sale products
    getNewArrivals, // Function for new arrivals
    getBestSellers, // New function for best sellers
    getProductsByCategory, // New function for category-based products
  }), [products])

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}

ProductProvider.propTypes = {
  children: PropTypes.node.isRequired
}