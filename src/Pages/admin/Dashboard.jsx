import { useState, useEffect } from 'react'
import { api } from '@/api/client'

function Dashboard() {
  const [pendingSellers, setPendingSellers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPendingSellers()
  }, [])

  const loadPendingSellers = async () => {
    try {
      const sellers = await api.getSellersToApprove()
      setPendingSellers(sellers)
    } catch (error) {
      console.error('Error loading pending sellers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveSeller = async (sellerId) => {
    try {
      await api.approveSeller(sellerId)
      alert('Seller approved successfully!')
      loadPendingSellers() // Reload the list
    } catch (error) {
      console.error('Error approving seller:', error)
      alert('Failed to approve seller')
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm text-gray-500">Total Sales</h3>
          <p className="text-2xl font-semibold mt-2">$12,340</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm text-gray-500">Orders</h3>
          <p className="text-2xl font-semibold mt-2">238</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm text-gray-500">Users</h3>
          <p className="text-2xl font-semibold mt-2">1,024</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6">
          <h2 className="text-xl font-semibold mb-4">Pending Seller Approvals</h2>
          
          {loading ? (
            <p>Loading...</p>
          ) : pendingSellers.length === 0 ? (
            <p className="text-gray-500">No pending seller approvals</p>
          ) : (
            <div className="space-y-4">
              {pendingSellers.map((seller) => (
                <div key={seller._id} className="border rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="font-semibold">{seller.name}</h3>
                    <p className="text-gray-600">{seller.email}</p>
                    <p className="text-sm text-gray-500">
                      Registered: {new Date(seller.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleApproveSeller(seller._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 whitespace-nowrap"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard