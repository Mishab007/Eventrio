import Commonrouter from "@/router/Commonrouter.jsx"
import { BrowserRouter } from "react-router-dom"
import { Route, Routes } from 'react-router-dom'
import { CartProvider } from '@/context/CartContext.jsx'; // Import CartProvider
import { AuthProvider } from '@/context/AuthContext.jsx'; // Import AuthProvider
import { WishlistProvider } from '@/context/WishlistContext.jsx'; // Import WishlistProvider
import { ThemeProvider } from '@/context/ThemeContext.jsx'; // Import ThemeProvider
import { ProductProvider } from '@/context/ProductContext.jsx'
import Adminrouter from '@/router/Adminrouter.jsx'
import Sellerrouter from '@/router/Sellerrouter.jsx'

function App() {
  return (
    <ThemeProvider> {/* Wrap with ThemeProvider */}
      <WishlistProvider> {/* Wrap with WishlistProvider */}
        <AuthProvider> {/* Wrap with AuthProvider */}
          <CartProvider> {/* Wrap with CartProvider */}
            <ProductProvider>
            <BrowserRouter>
              <Routes>
                  <Route path='/*' Component={Commonrouter}></Route>
                  <Route path='/admin/*' Component={Adminrouter}></Route>
                  <Route path='/seller/*' Component={Sellerrouter}></Route>
                </Routes>
            </BrowserRouter>
            </ProductProvider>
          </CartProvider>
        </AuthProvider>
      </WishlistProvider>
    </ThemeProvider>
  )
}
export default App