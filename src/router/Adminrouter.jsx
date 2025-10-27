/* eslint-disable no-unused-vars */
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminLayout from '@/components/admin/AdminLayout.jsx'
import Dashboard from '@/Pages/admin/Dashboard.jsx'
import Products from '@/Pages/admin/Products.jsx'
import Orders from '@/Pages/admin/Orders.jsx'
// import Users from '@/Pages/admin/Users.jsx'
import { useAuth } from '@/context/AuthContext.jsx'
import Approvals from '@/Pages/admin/Approvals.jsx'


function Adminrouter() {
  // Removed admin access restrictions - anyone can access admin features

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" Component={Dashboard}></Route>
        <Route path="/products" Component={Products}></Route>
        <Route path="/orders" Component={Orders}></Route>
        {/* <Route path="/users" Component={Users}></Route> */}
        <Route path="/approvals" Component={Approvals}></Route>
      </Routes>
    </AdminLayout>
  )
}

export default Adminrouter
