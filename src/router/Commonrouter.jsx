/* eslint-disable no-unused-vars */
import { useState } from "react"; // Import useState
import { Route, Routes } from "react-router-dom";
import Signup from "@/Pages/Signup.jsx";
import Login from "@/Pages/Login.jsx";
import Home from "@/Pages/Home.jsx";
import Forgot from "@/Pages/Forgot.jsx";
import Profile from "@/Pages/Profile.jsx";
import AdminSetup from "@/Pages/AdminSetup.jsx";

import Checkout from "@/Pages/Checkout.jsx"; // Import Checkout
import OrderConfirmation from "@/Pages/OrderConfirmation.jsx"; // Import OrderConfirmation
import Wishlist from "@/Pages/Wishlist.jsx"; // Import Wishlist
import OrderHistory from "@/Pages/OrderHistory.jsx"; // Import OrderHistory
import ProductDetails from "@/Pages/ProductDetails.jsx"; // Import ProductDetails
import CategoryPage from "@/Pages/CategoryPage.jsx"; // Import CategoryPage
import OutfitBuilder from "@/Pages/OutfitBuilder.jsx"; // Import OutfitBuilder
import SearchResults from "@/Pages/SearchResults.jsx"; // Import SearchResults
import ProductComparison from "@/Pages/ProductComparison.jsx"; // Import ProductComparison
import NewArrivals from "@/Pages/NewArrivals.jsx"; // Import NewArrivals
import Sale from "@/Pages/Sale.jsx"; // Import Sale
import Brands from "@/Pages/Brands.jsx"; // Import Brands
import Deals from "@/Pages/Deals.jsx"; // Import Deals
import Lookbook from "@/Pages/Lookbook.jsx"; // Import Lookbook
import Header from "@/components/Header.jsx"; // Import Header
import Footer from "@/components/Footer.jsx"; // Import Footer
import Chatbot from "@/components/Chatbot.jsx"; // Import Chatbot
import CartSidebar from "@/components/CartSidebar.jsx"; // Import CartSidebar

// Admin Pages
import AdminDashboard from "@/Pages/admin/Dashboard.jsx";
import ManageProducts from "@/Pages/admin/Products.jsx";
import Approvals from "@/Pages/admin/Approvals.jsx";
import ManageOrders from "@/Pages/admin/Orders.jsx";

// Seller Pages
import MyProducts from "@/Pages/seller/MyProducts.jsx";
import AddProduct from "@/Pages/seller/NewProduct.jsx";

function Commonrouter() {
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  return (
    <div>
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} /> {/* Pass search term and setter to Header */}
      <CartSidebar />
      <Chatbot />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin-setup" element={<AdminSetup />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/outfit-builder" element={<OutfitBuilder />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/compare" element={<ProductComparison />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/lookbook" element={<Lookbook />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<ManageProducts />} />
        <Route path="/admin/approvals" element={<Approvals />} />
        <Route path="/admin/orders" element={<ManageOrders />} />

        {/* Seller Routes */}
        <Route path="/seller" element={<MyProducts />} />
        <Route path="/seller/add-product" element={<AddProduct />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default Commonrouter;