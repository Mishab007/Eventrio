/* eslint-disable no-unused-vars */
import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext.jsx'
import SellerLayout from '@/components/seller/SellerLayout.jsx'
import NewProduct from '@/Pages/seller/NewProduct.jsx'
import MyProducts from '@/Pages/seller/MyProducts.jsx'

function Sellerrouter() {
  // Removed seller access restrictions - anyone can access seller features

  return (
    <SellerLayout>
      <Routes>
        <Route path="/" Component={MyProducts}></Route>
        <Route path="/new" Component={NewProduct}></Route>
      </Routes>
    </SellerLayout>
  )
}

export default Sellerrouter


