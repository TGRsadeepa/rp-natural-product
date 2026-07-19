import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, inWishlist } = useContext(WishlistContext);

  const discount = product.discount || 0;
  const originalPrice = product.price;
  const finalPrice = originalPrice - (originalPrice * (discount / 100));

  // Determine image url: default to placeholder if not present
  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const imageUrl = primaryImage ? `http://localhost:5000${primaryImage.url}` : '/images/sdsd.png';

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-3xl overflow-hidden shadow-premium border border-dark-green/5 flex flex-col h-full group relative"
    >
      {/* Badge for discount */}
      {discount > 0 && (
        <span className="absolute top-4 left-4 bg-gold text-cream text-xs font-bold px-3 py-1 rounded-full z-10">
          -{discount}% Off
        </span>
      )}

      {/* Wishlist toggle button */}
      <button
        onClick={handleWishlist}
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-cream/90 flex items-center justify-center text-gray-400 hover:text-red-500 hover:scale-110 shadow-md transition duration-300"
      >
        <FaHeart className={inWishlist(product.id) ? 'text-red-500' : 'text-gray-400'} size={16} />
      </button>

      {/* Image link */}
      <Link to={`/product/${product.slug}`} className="block overflow-hidden h-60 bg-cream/30 relative">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-dark-green/5 group-hover:bg-transparent transition duration-500"></div>
      </Link>

      {/* Contents */}
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-xs text-gold font-semibold uppercase tracking-wider mb-2">
          {product.category?.name || product.category || 'Wellness'}
        </p>
        
        <Link to={`/product/${product.slug}`} className="hover:text-dark-green transition">
          <h3 className="text-xl font-bold font-heading line-clamp-1 mb-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg font-bold text-dark-green">
            Rs. {finalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          {discount > 0 && (
            <span className="text-xs text-gray-400 line-through">
              Rs. {originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          )}
        </div>

        {/* Add to Cart button */}
        <button
          onClick={handleAdd}
          disabled={product.stockStatus === 'OUT_OF_STOCK'}
          className={`w-full py-3.5 rounded-full font-bold flex items-center justify-center gap-2 transition duration-300 shadow-md hover:shadow-lg ${
            product.stockStatus === 'OUT_OF_STOCK'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-dark-green hover:bg-light-green text-cream'
          }`}
        >
          <FaShoppingCart size={14} />
          {product.stockStatus === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;