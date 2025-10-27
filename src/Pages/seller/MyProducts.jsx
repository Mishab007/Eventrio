import { useState, useMemo } from 'react';
import { useProducts } from '@/context/ProductContext.jsx';
import { useAuth } from '@/context/AuthContext.jsx';

function MyProducts() {
  const { user } = useAuth()
  const { products, updateProduct, deleteProduct, setDiscount, addProductImage } = useProducts()
  const mine = useMemo(() => products.filter(p => p.ownerEmail === user?.email), [products, user])
  const [edit, setEdit] = useState({})
  const [newImageUrl, setNewImageUrl] = useState({})
  const [expandedProduct, setExpandedProduct] = useState(null)

  const handleFileUpload = (productId, file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      addProductImage(productId, reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">My Products ({mine.length})</h2>
        <div className="space-y-4">
          {mine.map(product => (
            <div key={product.id} className="border rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                    <img
                      src={product.image || (product.images?.[0]) || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="Arial" font-size="10">No Image</text></svg>'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-gray-600 capitalize">{product.category}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                      product.status === 'approved' ? 'bg-green-100 text-green-700' : 
                      product.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm"
                  >
                    {expandedProduct === product.id ? 'Collapse' : 'Edit'}
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {expandedProduct === product.id && (
                <div className="border-t pt-4 space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Product Name</label>
                      <input
                        type="text"
                        value={edit[product.id]?.name ?? product.name}
                        onChange={e => setEdit(prev => ({ ...prev, [product.id]: { ...prev[product.id], name: e.target.value } }))}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <select
                        value={edit[product.id]?.category ?? product.category}
                        onChange={e => setEdit(prev => ({ ...prev, [product.id]: { ...prev[product.id], category: e.target.value } }))}
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="shirts">Shirts</option>
                        <option value="jeans">Jeans</option>
                        <option value="jackets">Jackets</option>
                        <option value="shoes">Shoes</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={edit[product.id]?.description ?? product.description}
                      onChange={e => setEdit(prev => ({ ...prev, [product.id]: { ...prev[product.id], description: e.target.value } }))}
                      className="w-full border rounded px-3 py-2 h-20"
                    />
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={edit[product.id]?.price ?? product.price}
                        onChange={e => setEdit(prev => ({ ...prev, [product.id]: { ...prev[product.id], price: Number(e.target.value) } }))}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Discount (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={product.discount}
                        onChange={e => setDiscount(product.id, e.target.value)}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Final Price</label>
                      <div className="w-full border rounded px-3 py-2 bg-gray-50">
                        ${((edit[product.id]?.price ?? product.price) * (1 - product.discount / 100)).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Image Management */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Images</label>
                    <div className="space-y-3">
                      {/* Current Images */}
                      {product.images && product.images.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                          <div className="flex flex-wrap gap-2">
                            {product.images.map((img, idx) => (
                              <div key={idx} className="relative">
                                <img src={img} alt={`${product.name} ${idx + 1}`} className="w-16 h-16 object-cover rounded border" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Add New Image */}
                      <div className="flex flex-col sm:flex-row items-start gap-4">
                        <div className="w-full sm:w-auto">
                          <label className="block text-sm text-gray-600 mb-1">Upload File</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => handleFileUpload(product.id, e.target.files?.[0])}
                            className="text-sm w-full"
                          />
                        </div>
                        <div className="flex-1 w-full">
                          <label className="block text-sm text-gray-600 mb-1">Or paste Image URL</label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="url"
                              placeholder="https://example.com/image.jpg"
                              value={newImageUrl[product.id] ?? ''}
                              onChange={e => setNewImageUrl(prev => ({ ...prev, [product.id]: e.target.value }))}
                              className="flex-1 border rounded px-3 py-2 w-full"
                            />
                            <button
                              onClick={() => {
                                if (newImageUrl[product.id]) {
                                  addProductImage(product.id, newImageUrl[product.id])
                                  setNewImageUrl(prev => ({ ...prev, [product.id]: '' }))
                                }
                              }}
                              className="px-3 py-2 bg-green-600 text-white rounded whitespace-nowrap"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        const updates = edit[product.id] || {}
                        updateProduct(product.id, updates)
                        setEdit(prev => ({ ...prev, [product.id]: undefined }))
                        setExpandedProduct(null)
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MyProducts