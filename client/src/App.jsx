import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Scroll Controller
import ScrollToTop from './components/ScrollToTop';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Layout & Navigation Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import HealthLibrary from './pages/HealthLibrary';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>

        <CartProvider>
          <WishlistProvider>
            
            <div className="flex flex-col min-h-screen bg-cream/30">
              
              {/* Premium Navigation Header */}
              <Navbar />

              {/* Main Routing Views */}
              <main className="flex-grow">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:slug" element={<ProductDetails />} />
                  <Route path="/health-library" element={<HealthLibrary />} />
                  <Route path="/health-library/:slug" element={<HealthLibrary />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  {/* Auth routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Customer Dashboard & Shopping */}
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/profile" element={<Profile />} />
                  
                  {/* Administrative Workspace */}
                  <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
              </main>

              {/* Nature inspired Footer */}
              <Footer />

            </div>

          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;