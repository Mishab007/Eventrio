import { useState } from 'react';
import { useProducts } from '@/context/ProductContext.jsx';
import { useAuth } from '@/context/AuthContext.jsx';

function NewProduct() {
  const { createProduct } = useProducts();
  const { user } = useAuth();
  const [form, setForm] = useState({ 
    name: '', 
    description: '', 
    category: 'shirts', 
    price: '', 
    images: [],
    // New fields for seller customization
    brand: '',
    sku: '',
    stock: '',
    sizes: [],
    colors: [],
    material: '',
    tags: [],
    // Offer/Discount fields
    discount: 0,
    discountType: 'percentage', // percentage or fixed
    offerStartDate: '',
    offerEndDate: '',
    isOnSale: false,
    isFeatured: false,
    // Additional details
    warranty: '',
    returnPolicy: '30 days',
    shippingInfo: 'Free shipping on orders over $50',
    customFields: []
  });

  const [currentTag, setCurrentTag] = useState('');
  const [customFieldKey, setCustomFieldKey] = useState('');
  const [customFieldValue, setCustomFieldValue] = useState('');

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Gray', 'Navy', 'Brown'];

  const handleMultipleFiles = (files) => {
    if (!files || files.length === 0) return
    
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        setForm(prev => ({ 
          ...prev, 
          images: [...prev.images, String(reader.result || '')] 
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate final price if discount is applied
    const finalPrice = form.isOnSale && form.discount > 0
      ? form.discountType === 'percentage'
        ? parseFloat(form.price) * (1 - form.discount / 100)
        : parseFloat(form.price) - form.discount
      : parseFloat(form.price);

    const productData = {
      ...form,
      finalPrice,
      partnerId: user?.id || user?._id,
      partnerName: user?.name,
      createdAt: new Date().toISOString(),
      status: 'pending' // Requires admin approval
    };

    const product = createProduct(productData);
    console.log('Product created:', product);
    
    alert(`Product "${form.name}" submitted for admin approval!\n${form.isOnSale ? `Discount: ${form.discount}${form.discountType === 'percentage' ? '%' : '$'}` : 'No discount applied'}`);
    
    // Reset form
    setForm({ 
      name: '', 
      description: '', 
      category: 'shirts', 
      price: '', 
      images: [],
      brand: '',
      sku: '',
      stock: '',
      sizes: [],
      colors: [],
      material: '',
      tags: [],
      discount: 0,
      discountType: 'percentage',
      offerStartDate: '',
      offerEndDate: '',
      isOnSale: false,
      isFeatured: false,
      warranty: '',
      returnPolicy: '30 days',
      shippingInfo: 'Free shipping on orders over $50',
      customFields: []
    });
  };

  const toggleSize = (size) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const toggleColor = (color) => {
    setForm(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !form.tags.includes(currentTag.trim())) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addCustomField = () => {
    if (customFieldKey.trim() && customFieldValue.trim()) {
      setForm(prev => ({
        ...prev,
        customFields: [...prev.customFields, { key: customFieldKey, value: customFieldValue }]
      }));
      setCustomFieldKey('');
      setCustomFieldValue('');
    }
  };

  const removeCustomField = (index) => {
    setForm(prev => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
        <p className="text-sm text-gray-600 mt-1">Fill in the details below to list your product. All products require admin approval before going live.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Multiple Image Upload Section */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Product Images</h3>
          <div className="border rounded-lg p-4 bg-gray-50">
            {/* Image previews */}
            {form.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {form.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={image} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-32 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Upload controls */}
            <div className="flex flex-col gap-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Upload Images</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={e => handleMultipleFiles(e.target.files)} 
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                <p className="text-xs text-gray-500 mt-1">Select multiple images at once</p>
              </div>
            </div>
            
            {form.images.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No images selected. Upload images using the button above.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Basic Information */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Product Name *</label>
              <input 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                placeholder="e.g., Premium Cotton T-Shirt"
                className="w-full border rounded px-3 py-2" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <input 
                name="brand" 
                value={form.brand} 
                onChange={handleChange} 
                placeholder="e.g., Nike, Adidas"
                className="w-full border rounded px-3 py-2" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">SKU (Stock Keeping Unit)</label>
              <input 
                name="sku" 
                value={form.sku} 
                onChange={handleChange} 
                placeholder="e.g., TS-001-BLK-M"
                className="w-full border rounded px-3 py-2" 
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                rows="4"
                placeholder="Describe your product in detail..."
                className="w-full border rounded px-3 py-2" 
                required 
              />
            </div>
          </div>
        </div>
        
        {/* Pricing & Stock */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Pricing & Inventory</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select 
                name="category" 
                value={form.category} 
                onChange={handleChange} 
                className="w-full border rounded px-3 py-2"
              >
                <option value="shirts">Shirts</option>
                <option value="jeans">Jeans</option>
                <option value="jackets">Jackets</option>
                <option value="shoes">Shoes</option>
                <option value="dresses">Dresses</option>
                <option value="accessories">Accessories</option>
                <option value="watches">Watches</option>
                <option value="bags">Bags</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Price ($) *</label>
              <input 
                type="number" 
                step="0.01" 
                name="price" 
                value={form.price} 
                onChange={handleChange} 
                placeholder="0.00"
                className="w-full border rounded px-3 py-2" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
              <input 
                type="number" 
                name="stock" 
                value={form.stock} 
                onChange={handleChange} 
                placeholder="0"
                className="w-full border rounded px-3 py-2" 
                required 
              />
            </div>
          </div>
        </div>
        
        {/* Variants */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Product Variants</h3>
          
          {/* Sizes */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Available Sizes</label>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-4 py-2 rounded border font-medium transition ${
                    form.sizes.includes(size)
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Colors */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Available Colors</label>
            <div className="flex flex-wrap gap-2">
              {availableColors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => toggleColor(color)}
                  className={`px-4 py-2 rounded border font-medium transition ${
                    form.colors.includes(color)
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
          
          {/* Material */}
          <div>
            <label className="block text-sm font-medium mb-1">Material</label>
            <input 
              name="material" 
              value={form.material} 
              onChange={handleChange} 
              placeholder="e.g., 100% Cotton, Polyester, Leather"
              className="w-full border rounded px-3 py-2" 
            />
          </div>
        </div>
        
        {/* Offers & Discounts */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Offers & Discounts</h3>
          
          {/* Sale Toggle */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="isOnSale"
              checked={form.isOnSale}
              onChange={(e) => setForm(prev => ({ ...prev, isOnSale: e.target.checked }))}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="isOnSale" className="ml-2 block text-sm font-medium text-gray-700">
              Put this product on sale
            </label>
          </div>
          
          {form.isOnSale && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-purple-50 p-4 rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-1">Discount Type</label>
                <select 
                  name="discountType" 
                  value={form.discountType} 
                  onChange={handleChange} 
                  className="w-full border rounded px-3 py-2 bg-white"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Discount Value</label>
                <input 
                  type="number" 
                  step="0.01" 
                  name="discount" 
                  value={form.discount} 
                  onChange={handleChange} 
                  placeholder={form.discountType === 'percentage' ? '0-100' : '0.00'}
                  className="w-full border rounded px-3 py-2 bg-white" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Offer Start Date</label>
                <input 
                  type="date" 
                  name="offerStartDate" 
                  value={form.offerStartDate} 
                  onChange={handleChange} 
                  className="w-full border rounded px-3 py-2 bg-white" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Offer End Date</label>
                <input 
                  type="date" 
                  name="offerEndDate" 
                  value={form.offerEndDate} 
                  onChange={handleChange} 
                  className="w-full border rounded px-3 py-2 bg-white" 
                />
              </div>
              
              {form.price && form.discount > 0 && (
                <div className="md:col-span-2 bg-white p-3 rounded border border-purple-200">
                  <p className="text-sm text-gray-600">Final Price Preview:</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-lg font-bold text-purple-600">
                      ${(
                        form.discountType === 'percentage'
                          ? parseFloat(form.price) * (1 - form.discount / 100)
                          : parseFloat(form.price) - form.discount
                      ).toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">${parseFloat(form.price).toFixed(2)}</span>
                    <span className="text-sm font-medium text-green-600">
                      Save {form.discountType === 'percentage' ? `${form.discount}%` : `$${form.discount}`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Featured Product */}
          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="isFeatured"
              checked={form.isFeatured}
              onChange={(e) => setForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="isFeatured" className="ml-2 block text-sm font-medium text-gray-700">
              Mark as Featured Product (appears on homepage)
            </label>
          </div>
        </div>
        
        {/* Tags */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Tags & Keywords</h3>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Add Tags (for better search visibility)</label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="e.g., summer, casual, trending"
                className="flex-1 border rounded px-3 py-2" 
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Add Tag
              </button>
            </div>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {form.tags.map((tag, index) => (
                <span key={index} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-purple-900 hover:text-purple-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Additional Information */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Warranty</label>
              <input 
                name="warranty" 
                value={form.warranty} 
                onChange={handleChange} 
                placeholder="e.g., 1 Year Manufacturer Warranty"
                className="w-full border rounded px-3 py-2" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Return Policy</label>
              <select 
                name="returnPolicy" 
                value={form.returnPolicy} 
                onChange={handleChange} 
                className="w-full border rounded px-3 py-2"
              >
                <option value="7 days">7 Days</option>
                <option value="15 days">15 Days</option>
                <option value="30 days">30 Days</option>
                <option value="No returns">No Returns</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Shipping Information</label>
              <textarea 
                name="shippingInfo" 
                value={form.shippingInfo} 
                onChange={handleChange} 
                rows="2"
                placeholder="Shipping details..."
                className="w-full border rounded px-3 py-2" 
              />
            </div>
          </div>
        </div>
        
        {/* Custom Fields */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Custom Product Details</h3>
          <p className="text-sm text-gray-600 mb-3">Add any additional product specifications</p>
          
          <div className="flex gap-2 mb-3">
            <input 
              type="text"
              value={customFieldKey}
              onChange={(e) => setCustomFieldKey(e.target.value)}
              placeholder="Field name (e.g., Weight, Dimensions)"
              className="flex-1 border rounded px-3 py-2" 
            />
            <input 
              type="text"
              value={customFieldValue}
              onChange={(e) => setCustomFieldValue(e.target.value)}
              placeholder="Value"
              className="flex-1 border rounded px-3 py-2" 
            />
            <button
              type="button"
              onClick={addCustomField}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Add
            </button>
          </div>
          
          {form.customFields.length > 0 && (
            <div className="bg-gray-50 rounded p-3 space-y-2">
              {form.customFields.map((field, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                  <div>
                    <span className="font-medium text-gray-700">{field.key}:</span>
                    <span className="ml-2 text-gray-600">{field.value}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCustomField(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-between items-center pt-4">
          <p className="text-sm text-gray-500">* Required fields</p>
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={form.images.length === 0 || !form.stock}
              className={`px-6 py-2 rounded font-medium ${
                form.images.length === 0 || !form.stock
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              Submit for Approval
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default NewProduct