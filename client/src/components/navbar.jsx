import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaHeart, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import logo from '../assets/logo/rp-logo.png';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => 
    `relative transition-colors duration-300 font-medium tracking-wide ${
      isActive(path) ? 'text-dark-green' : 'text-dark-text hover:text-dark-green'
    }`;

  return (
    <header className="fixed top-0 left-0 w-full bg-cream/90 backdrop-blur-md shadow-sm z-50 border-b border-dark-green/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={logo}
            alt="RP Natural Logo"
            className="w-12 h-12 object-contain group-hover:rotate-6 transition-transform duration-300"
          />
          <div>
            <h1 className="text-xl font-bold text-dark-green leading-none">RP Ceylon Natural</h1>
            <p className="text-[10px] text-gold font-semibold tracking-widest uppercase">Ceylon Wellness</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className={linkClass('/')}>
            Home
            {isActive('/') && <span className="absolute bottom-[-6px] left-0 w-full h-[2px] bg-dark-green rounded-full"></span>}
          </Link>
          <Link to="/shop" className={linkClass('/shop')}>
            Shop
            {isActive('/shop') && <span className="absolute bottom-[-6px] left-0 w-full h-[2px] bg-dark-green rounded-full"></span>}
          </Link>
          <Link to="/health-library" className={linkClass('/health-library')}>
            Health Library
            {isActive('/health-library') && <span className="absolute bottom-[-6px] left-0 w-full h-[2px] bg-dark-green rounded-full"></span>}
          </Link>
          <Link to="/about" className={linkClass('/about')}>
            About Us
            {isActive('/about') && <span className="absolute bottom-[-6px] left-0 w-full h-[2px] bg-dark-green rounded-full"></span>}
          </Link>
          <Link to="/contact" className={linkClass('/contact')}>
            Contact
            {isActive('/contact') && <span className="absolute bottom-[-6px] left-0 w-full h-[2px] bg-dark-green rounded-full"></span>}
          </Link>
        </nav>

        {/* Action Icons */}
        <div className="hidden md:flex items-center gap-6">
          {/* Wishlist */}
          <Link to="/profile" className="relative text-dark-text hover:text-dark-green transition-transform duration-300 hover:scale-110">
            <FaHeart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-cream text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative text-dark-text hover:text-dark-green transition-transform duration-300 hover:scale-110">
            <FaShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-dark-green text-cream text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Controls */}
          {user ? (
            <div className="flex items-center gap-4 border-l border-dark-green/20 pl-4">
              <Link to={user.role === 'ADMIN' ? '/admin' : '/profile'} className="flex items-center gap-2 text-dark-text hover:text-dark-green font-medium">
                <FaUser size={16} className="text-gold" />
                <span className="text-sm max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                {user.role === 'ADMIN' && <span className="text-[9px] bg-gold text-cream px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Admin</span>}
              </Link>
              <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 transition" title="Logout">
                <FaSignOutAlt size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-dark-green hover:bg-light-green text-cream px-5 py-2 rounded-full text-sm font-semibold transition shadow-md hover:shadow-lg flex items-center gap-2">
              <FaUser size={12} />
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-dark-green text-2xl hover:scale-105 duration-300">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-cream border-t border-dark-green/10 py-6 px-4 flex flex-col gap-4 animate-fadeIn">
          <Link to="/" onClick={() => setIsOpen(false)} className={`py-2 text-lg font-medium ${isActive('/') ? 'text-dark-green' : 'text-dark-text'}`}>
            Home
          </Link>
          <Link to="/shop" onClick={() => setIsOpen(false)} className={`py-2 text-lg font-medium ${isActive('/shop') ? 'text-dark-green' : 'text-dark-text'}`}>
            Shop
          </Link>
          <Link to="/health-library" onClick={() => setIsOpen(false)} className={`py-2 text-lg font-medium ${isActive('/health-library') ? 'text-dark-green' : 'text-dark-text'}`}>
            Health Library
          </Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className={`py-2 text-lg font-medium ${isActive('/about') ? 'text-dark-green' : 'text-dark-text'}`}>
            About Us
          </Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className={`py-2 text-lg font-medium ${isActive('/contact') ? 'text-dark-green' : 'text-dark-text'}`}>
            Contact
          </Link>
          
          <div className="border-t border-dark-green/10 pt-4 flex flex-col gap-4">
            <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg text-dark-text">
              <FaShoppingCart className="text-dark-green" /> Cart ({cartCount})
            </Link>
            <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg text-dark-text">
              <FaHeart className="text-gold" /> Wishlist ({wishlist.length})
            </Link>

            {user ? (
              <div className="flex flex-col gap-3">
                <Link to={user.role === 'ADMIN' ? '/admin' : '/profile'} onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg text-dark-text font-medium">
                  <FaUser className="text-gold" /> Profile ({user.name})
                </Link>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-full font-semibold transition text-center flex items-center justify-center gap-2">
                  <FaSignOutAlt /> Log Out
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="bg-dark-green hover:bg-light-green text-cream py-3 rounded-full font-semibold transition text-center flex items-center justify-center gap-2 shadow-md">
                <FaUser /> Log In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;