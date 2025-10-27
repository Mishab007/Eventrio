import { useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProducts } from '@/context/ProductContext.jsx'
import { useCart } from '@/context/CartContext.jsx'
import { useWishlist } from '@/context/WishlistContext.jsx'

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, updateProduct } = useProducts()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const product = useMemo(() => products.find(p => p.id === id), [products, id])
  
  // Get related products
  const relatedProducts = useMemo(() => {
    return products
      .filter(p => p.status === 'approved' && p.category === product?.category && p.id !== product?.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
  }, [products, product]);

  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState(product?.color || '')
  const [quantity, setQuantity] = useState(1)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
    author: ''
  })
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [showShareOptions, setShowShareOptions] = useState(false)

  // Save product to recently viewed when component mounts
  useEffect(() => {
    if (product) {
      // Get existing recently viewed products from localStorage
      const viewedProducts = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      
      // Add current product to the beginning of the array
      const updatedViewed = [product.id, ...viewedProducts.filter(pid => pid !== product.id)].slice(0, 10); // Keep only last 10
      
      // Save back to localStorage
      localStorage.setItem('recentlyViewed', JSON.stringify(updatedViewed));
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-blue-600 text-white rounded">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const isInWishlistProduct = isInWishlist(product.id)
  const finalPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price

  const handleWishlistToggle = () => {
    if (isInWishlistProduct) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size')
      return
    }
    addToCart({...product, selectedSize, selectedColor, quantity})
    alert('Added to cart!')
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    if (!reviewForm.author.trim()) {
      alert('Please enter your name')
      return
    }
    if (!reviewForm.comment.trim()) {
      alert('Please enter your review')
      return
    }

    const newReview = {
      id: Date.now().toString(),
      author: reviewForm.author,
      rating: parseInt(reviewForm.rating),
      comment: reviewForm.comment,
      date: new Date().toISOString()
    }

    // Update product with new review
    const updatedProduct = {
      ...product,
      reviews: [...(product.reviews || []), newReview]
    }

    updateProduct(product.id, updatedProduct)
    setReviewForm({ rating: 5, comment: '', author: '' })
    setShowReviewForm(false)
    alert('Thank you for your review!')
  }

  // Calculate average rating
  const averageRating = product.reviews && product.reviews.length > 0 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0

  // Share product
  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this amazing product: ${product.name}`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          alert('Link copied to clipboard!');
        });
        break;
      default:
        break;
    }
    setShowShareOptions(false);
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Product Images */}
        <div className="space-y-2 sm:space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
            <img
              src={product.images?.[activeImage] || product.image || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="Arial" font-size="16">No Image</text></svg>'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discount > 0 && (
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-red-500 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded">
                {product.discount}% OFF
              </div>
            )}
          </div>
          
          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-1 sm:gap-2">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.name} ${idx + 1}`}
                  className={`aspect-square object-cover rounded border cursor-pointer ${activeImage === idx ? 'border-blue-500' : 'border-gray-300'}`}
                  onClick={() => setActiveImage(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-sm sm:text-base text-gray-600 capitalize">{product.category}</p>
            
            {/* Rating */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="flex items-center mt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-xs sm:text-sm text-gray-600">
                  {averageRating.toFixed(1)} ({product.reviews.length} reviews)
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex items-center space-x-2">
              {product.discount > 0 && (
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">${finalPrice.toFixed(2)}</span>
              )}
              <span className={`text-xl sm:text-2xl md:text-3xl font-bold ${product.discount > 0 ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                ${product.price.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <span className="bg-red-100 text-red-800 text-xs sm:text-sm font-medium px-2 py-1 rounded">
                  Save ${(product.price * product.discount / 100).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">Description</h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {product.description_long || product.description}
            </p>
          </div>

          {/* Color Selection */}
          {product.color && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">Color: {selectedColor}</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1.5 sm:py-2 border rounded hover:bg-gray-100 text-sm sm:text-base ${
                    selectedColor === product.color 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedColor(product.color)}
                >
                  {product.color}
                </button>
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base sm:text-lg font-semibold">Size</h3>
                <button 
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-800"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`px-3 py-1.5 sm:py-2 border rounded hover:bg-gray-100 text-sm sm:text-base ${
                      selectedSize === size 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'border-gray-300'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              
              {/* Size Guide Modal */}
              {showSizeGuide && (
                <div className="mt-4 p-3 sm:p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm sm:text-base font-semibold">Size Guide</h4>
                    <button 
                      onClick={() => setShowSizeGuide(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Measurements in inches</p>
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left">Size</th>
                        <th className="p-2 text-left">Chest</th>
                        <th className="p-2 text-left">Waist</th>
                        <th className="p-2 text-left">Hip</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border">S</td>
                        <td className="p-2 border">34-36</td>
                        <td className="p-2 border">28-30</td>
                        <td className="p-2 border">34-36</td>
                      </tr>
                      <tr>
                        <td className="p-2 border">M</td>
                        <td className="p-2 border">38-40</td>
                        <td className="p-2 border">32-34</td>
                        <td className="p-2 border">38-40</td>
                      </tr>
                      <tr>
                        <td className="p-2 border">L</td>
                        <td className="p-2 border">42-44</td>
                        <td className="p-2 border">36-38</td>
                        <td className="p-2 border">42-44</td>
                      </tr>
                      <tr>
                        <td className="p-2 border">XL</td>
                        <td className="p-2 border">46-48</td>
                        <td className="p-2 border">40-42</td>
                        <td className="p-2 border">46-48</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">Quantity</h3>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-300 rounded text-base sm:text-lg"
              >
                -
              </button>
              <span className="w-12 text-center text-sm sm:text-base">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-300 rounded text-base sm:text-lg"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 text-sm sm:text-base"
            >
              Add to Cart
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`p-2.5 sm:p-3 rounded-lg border transition duration-300 ${
                isInWishlistProduct
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill={isInWishlistProduct ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
            <div className="relative">
              <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="p-2.5 sm:p-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </button>
              
              {showShareOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button 
                    onClick={() => handleShare('facebook')}
                    className="block w-full text-left px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Share on Facebook
                  </button>
                  <button 
                    onClick={() => handleShare('twitter')}
                    className="block w-full text-left px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Share on Twitter
                  </button>
                  <button 
                    onClick={() => handleShare('whatsapp')}
                    className="block w-full text-left px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Share on WhatsApp
                  </button>
                  <button 
                    onClick={() => handleShare('copy')}
                    className="block w-full text-left px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Copy Link
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-8 sm:mt-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map(product => (
              <div key={product.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-48 sm:h-56 md:h-64 object-cover"
                />
                <div className="p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">{product.category}</p>
                  <div className="flex items-center justify-between mt-2 sm:mt-3">
                    <span className="text-lg sm:text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    <button 
                      className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-blue-700 transition"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-8 sm:mt-12 bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Customer Reviews</h2>
          <button 
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs sm:text-sm"
          >
            Write a Review
          </button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="mb-6 sm:mb-8 p-3 sm:p-4 border rounded-lg bg-gray-50">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Share Your Experience</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 text-sm sm:text-base">Your Name</label>
                <input
                  type="text"
                  value={reviewForm.author}
                  onChange={(e) => setReviewForm({...reviewForm, author: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 text-sm sm:text-base">Rating</label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({...reviewForm, rating: star})}
                      className="text-xl sm:text-2xl focus:outline-none"
                    >
                      <span className={star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    </button>
                  ))}
                  <span className="ml-2 text-xs sm:text-sm text-gray-600">{reviewForm.rating} Star{reviewForm.rating !== 1 ? 's' : ''}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 text-sm sm:text-base">Your Review</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base"
                  placeholder="Share your thoughts about this product..."
                  rows="4"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-xs sm:text-sm"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-3 sm:px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-xs sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Reviews List */}
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {product.reviews.map(review => (
              <div key={review.id} className="border-b pb-4 sm:pb-6 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{review.author}</h4>
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 sm:w-4 sm:h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-xs sm:text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-2 sm:mt-3 text-gray-700 text-sm sm:text-base">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <p className="text-gray-500 text-sm sm:text-base">No reviews yet. Be the first to review this product!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetails