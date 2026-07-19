import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaArrowRight, FaMinus, FaPlus } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      alert('Please log in or register to complete your order.');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-20 text-center max-w-md mx-auto px-6">
        <div className="w-16 h-16 rounded-full bg-cream shadow-md flex items-center justify-center text-gray-400 mx-auto mb-6">
          <FaShoppingCart size={24} />
        </div>
        <h2 className="text-3xl font-bold font-heading text-dark-text mb-4">Your Cart is Empty</h2>
        <p className="text-sm text-gray-500 font-light mb-8">
          Looks like you haven't added any products to your cart yet. Explore our Ceylon wellness infusions to get started.
        </p>
        <Link to="/shop" className="bg-dark-green hover:bg-light-green text-cream px-8 py-3.5 rounded-full text-sm font-bold transition shadow-md">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 min-h-screen bg-cream/30">
      <div className="max-w-7xl mx-auto px-6">
        
        <h1 className="text-4xl font-bold font-heading text-dark-text mb-10">Your Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Items List */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-premium border border-dark-green/5 flex flex-col gap-6">
              
              <div className="flex justify-between items-center border-b border-dark-green/5 pb-4">
                <span className="font-bold text-dark-text text-sm">Product Details</span>
                <button
                  onClick={clearCart}
                  className="text-xs text-red-500 hover:text-red-700 font-bold transition"
                >
                  Clear All
                </button>
              </div>

              <div className="flex flex-col gap-6 divide-y divide-gray-100">
                {cart.map((item) => {
                  if (!item.product) return null;
                  const discount = item.product.discount || 0;
                  const finalPrice = item.product.price - (item.product.price * (discount / 100));
                  const primaryImage = item.product.images?.find((img) => img.isPrimary) || item.product.images?.[0];
                  const imageUrl = primaryImage ? `http://localhost:5000${primaryImage.url}` : '/images/sdsd.png';

                  return (
                    <div key={item.id} className="pt-6 first:pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      
                      {/* Product details */}
                      <div className="flex gap-4 items-center">
                        <div className="w-20 h-20 bg-cream/30 border border-dark-green/5 rounded-2xl overflow-hidden p-2 shrink-0">
                          <img src={imageUrl} alt={item.product.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <Link to={`/product/${item.product.slug}`} className="font-bold text-dark-text hover:text-dark-green transition">
                            {item.product.name}
                          </Link>
                          <p className="text-xs text-gold font-semibold uppercase mt-0.5">{item.product.category?.name || item.product.category}</p>
                          <p className="text-xs text-gray-400 mt-1 font-light">Rs. {finalPrice.toLocaleString('en-US')}</p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <div className="flex border border-dark-green/20 rounded-full items-center p-1 bg-cream/40">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full hover:bg-white text-dark-green flex items-center justify-center transition"
                          >
                            <FaMinus size={8} />
                          </button>
                          <span className="w-10 text-center text-xs font-bold text-dark-text">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full hover:bg-white text-dark-green flex items-center justify-center transition"
                          >
                            <FaPlus size={8} />
                          </button>
                        </div>

                        {/* Total price */}
                        <div className="text-right min-w-[90px]">
                          <span className="font-bold text-dark-green text-sm">
                            Rs. {(finalPrice * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => removeFromCart(item.id, item.productId)}
                          className="text-gray-400 hover:text-red-500 p-2 transition"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Cart Summary */}
          <div className="bg-white rounded-3xl p-8 border border-dark-green/5 shadow-premium h-fit flex flex-col gap-6">
            <h2 className="text-xl font-bold font-heading text-dark-text border-b border-dark-green/10 pb-4">Order Summary</h2>
            
            <div className="flex flex-col gap-4 text-sm text-gray-500 font-light">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-dark-text">Rs. {cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold uppercase">Free</span>
              </div>
              <div className="border-t border-dark-green/10 pt-4 flex justify-between text-base font-bold text-dark-text">
                <span>Total Amount</span>
                <span className="text-dark-green">Rs. {cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-dark-green hover:bg-light-green text-cream py-4 rounded-full font-bold transition flex items-center justify-center gap-2 shadow-md"
            >
              Proceed to Checkout
              <FaArrowRight size={12} />
            </button>

            <Link to="/shop" className="text-center text-xs text-gray-400 font-medium hover:text-dark-green transition">
              Continue Shopping
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Cart;
