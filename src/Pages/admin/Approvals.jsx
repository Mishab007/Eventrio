import { useMemo } from 'react'
import { useProducts } from '@/context/ProductContext.jsx'

function Approvals() {
  // Removed admin access restrictions
  const { products, approveProduct, deleteProduct } = useProducts()
  const pending = useMemo(() => products.filter(p => p.status === 'pending'), [products])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Pending Product Approvals ({pending.length})</h2>
        {pending.length === 0 ? (
          <p className="text-gray-600 text-sm">No pending products.</p>
        ) : (
          <div className="space-y-3">
            {pending.map(p => (
              <div key={p.id} className="border rounded p-3 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-gray-600">{p.description}</p>
                  <p className="text-sm text-gray-500">By: {p.ownerEmail || 'unknown'}</p>
                  <p className="text-xs text-gray-400">Status: {p.status}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1 bg-green-600 text-white rounded text-sm" onClick={() => approveProduct(p.id, true)}>Approve</button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded text-sm" onClick={() => approveProduct(p.id, false)}>Reject</button>
                  <button className="px-3 py-1 bg-gray-700 text-white rounded text-sm" onClick={() => deleteProduct(p.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Debug: Show all products */}
      <div className="bg-gray-50 rounded-lg shadow p-4">
        <h3 className="text-md font-semibold mb-2">Debug: All Products ({products.length})</h3>
        <div className="text-xs space-y-1">
          {products.map(p => (
            <div key={p.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span className="truncate">{p.name} (ID: {p.id})</span>
              <span className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                p.status === 'approved' ? 'bg-green-100 text-green-700' : 
                p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                'bg-red-100 text-red-700'
              }`}>
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Approvals