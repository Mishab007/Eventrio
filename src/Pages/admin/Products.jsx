import { useState } from 'react'
import { useProducts } from '@/context/ProductContext.jsx'

function Products() {
  const { products, updateProductPrice, addProductImage } = useProducts()
  const [editPrice, setEditPrice] = useState({})
  const [newImageUrl, setNewImageUrl] = useState({})

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Products</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-3">ID</th>
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Price</th>
              <th className="py-2 px-3">Images</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b align-top">
                <td className="py-2 px-3">
                  <div className="max-w-[80px] truncate">{p.id}</div>
                </td>
                <td className="py-2 px-3">
                  <div className="max-w-[120px] truncate">{p.name}</div>
                </td>
                <td className="py-2 px-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <input
                      type="number"
                      value={editPrice[p.id] ?? p.price}
                      onChange={e => setEditPrice(prev => ({ ...prev, [p.id]: e.target.value }))}
                      className="border rounded px-2 py-1 w-28"
                    />
                    <button
                      className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
                      onClick={() => updateProductPrice(p.id, editPrice[p.id] ?? p.price)}
                    >
                      Save
                    </button>
                  </div>
                </td>
                <td className="py-2 px-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(p.images || []).slice(0, 3).map((img, idx) => (
                        <img key={idx} src={img} alt="product" className="w-12 h-12 object-cover rounded border" />
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="url"
                        placeholder="Image URL"
                        value={newImageUrl[p.id] ?? ''}
                        onChange={e => setNewImageUrl(prev => ({ ...prev, [p.id]: e.target.value }))}
                        className="border rounded px-2 py-1 w-full sm:w-64"
                      />
                      <button
                        className="px-2 py-1 bg-green-600 text-white rounded text-sm whitespace-nowrap"
                        onClick={() => { addProductImage(p.id, newImageUrl[p.id]); setNewImageUrl(prev => ({ ...prev, [p.id]: '' })) }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </td>
                <td className="py-2 px-3 text-gray-500">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Products