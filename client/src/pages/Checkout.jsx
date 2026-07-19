import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaLock, FaCreditCard, FaTruck, FaUniversity, FaCheckCircle, FaChevronLeft } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CARD'); // CARD | COD | BANK_TRANSFER

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  // Redirect if cart is empty or user is not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else if (cart.length === 0 && !successOrder) {
      navigate('/cart');
    }
  }, [user, cart, navigate, successOrder]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address || !phone) {
      return alert('Please fill in shipping address and contact phone.');
    }

    setLoading(true);
    try {
      const payload = {
        shippingAddress: address,
        contactPhone: phone,
        paymentMethod
      };

      const res = await api.post('/orders', payload);
      setSuccessOrder(res.data);
      clearCart();
    } catch (error) {
      console.error('Error placing order', error);
      alert(error.response?.data?.message || 'Error processing your checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (successOrder) {
    return (
      <div className="pt-32 pb-20 text-center max-w-lg mx-auto px-6">
        <div className="w-20 h-20 rounded-full bg-green-50 shadow-md flex items-center justify-center text-green-600 mx-auto mb-6">
          <FaCheckCircle size={32} />
        </div>
        <h1 className="text-4xl font-bold font-heading text-dark-text mb-4">Order Placed Successfully!</h1>
        <p className="text-sm text-gray-500 font-light mb-6">
          Thank you for choosing RP Ceylon Natural wellness collections. Your order was successfully processed.
        </p>

        {/* Receipt Box */}
        <div className="bg-white border border-dark-green/10 rounded-3xl p-6 text-left shadow-premium mb-8 flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Order ID:</span>
            <span className="font-bold text-dark-text">#{successOrder.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Sri Lankan Tracking ID:</span>
            <span className="font-bold text-dark-green">{successOrder.trackingNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Paid:</span>
            <span className="font-bold text-dark-text">Rs. {successOrder.totalAmount?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Shipping To:</span>
            <span className="font-medium text-dark-text text-right max-w-[200px] truncate" title={successOrder.shippingAddress}>
              {successOrder.shippingAddress}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/profile" className="bg-dark-green hover:bg-light-green text-cream px-8 py-3.5 rounded-full font-bold transition shadow">
            Track My Order
          </Link>
          <Link to="/shop" className="border-2 border-dark-green/20 hover:border-dark-green text-dark-green px-8 py-3.5 rounded-full font-bold transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 min-h-screen bg-cream/30">
      <div className="max-w-7xl mx-auto px-6">
        
        <Link to="/cart" className="flex items-center gap-2 text-dark-green hover:text-light-green font-bold text-sm mb-8 transition">
          <FaChevronLeft size={10} /> Back to Cart
        </Link>

        <h1 className="text-4xl font-bold font-heading text-dark-text mb-10">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Form Side */}
          <form onSubmit={handlePlaceOrder} className="lg:col-span-2 flex flex-col gap-6">
            
            {/* 1. Shipping Info */}
            <div className="bg-white rounded-3xl p-8 shadow-premium border border-dark-green/5 flex flex-col gap-5">
              <h2 className="text-xl font-bold font-heading text-dark-text border-b border-dark-green/10 pb-3 flex items-center gap-2">
                <FaTruck className="text-dark-green" size={16} /> 1. Shipping Details
              </h2>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Phone</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +94 77 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-cream/40 border border-dark-green/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-dark-green text-dark-text"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Delivery Address</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Street name, City, Postal Code"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-cream/40 border border-dark-green/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-dark-green text-dark-text"
                ></textarea>
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="bg-white rounded-3xl p-8 shadow-premium border border-dark-green/5 flex flex-col gap-6">
              <h2 className="text-xl font-bold font-heading text-dark-text border-b border-dark-green/10 pb-3 flex items-center gap-2">
                <FaLock className="text-dark-green" size={14} /> 2. Payment Method
              </h2>

              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { id: 'CARD', label: 'Credit Card', icon: <FaCreditCard /> },
                  { id: 'COD', label: 'Cash on Delivery', icon: <FaTruck /> },
                  { id: 'BANK_TRANSFER', label: 'Bank Transfer', icon: <FaUniversity /> }
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`flex flex-col items-center justify-center p-4 border rounded-2xl transition gap-2 ${
                      paymentMethod === pm.id ? 'border-dark-green bg-cream/30 text-dark-green font-bold' : 'border-gray-200 text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-lg">{pm.icon}</span>
                    <span className="text-xs">{pm.label}</span>
                  </button>
                ))}
              </div>

              {/* CARD DETAILS FORM (CONDITIONAL) */}
              {paymentMethod === 'CARD' && (
                <div className="bg-cream/20 p-6 rounded-2xl border border-dark-green/5 grid sm:grid-cols-3 gap-4 animate-fadeIn">
                  <div className="flex flex-col gap-1.5 sm:col-span-3">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white border border-dark-green/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-dark-green text-dark-text"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Expiry Date</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full bg-white border border-dark-green/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-dark-green text-dark-text"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">CVV</label>
                    <input
                      type="password"
                      required
                      placeholder="XXX"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full bg-white border border-dark-green/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-dark-green text-dark-text"
                    />
                  </div>
                </div>
              )}

              {/* COD / BANK TRANSFER INFO */}
              {paymentMethod === 'COD' && (
                <p className="text-xs text-gray-400 italic">
                  Pay with cash upon delivery of your products. Please ensure exact change is prepared.
                </p>
              )}

              {paymentMethod === 'BANK_TRANSFER' && (
                <div className="bg-cream/20 p-4 rounded-xl border border-dark-green/5 text-xs text-gray-500 flex flex-col gap-2">
                  <p className="font-bold text-dark-text">Bank Transfer Instructions:</p>
                  <p>Bank Name: Commercial Bank of Ceylon PLC</p>
                  <p>Account Name: RP Ceylon Natural Product (Pvt) Ltd</p>
                  <p>Account Number: 1200054321</p>
                  <p className="italic">Please write your Order ID as the transfer reference and email the deposit receipt to bank@rpnatural.com.</p>
                </div>
              )}

            </div>

          </form>

          {/* Checkout Summary */}
          <div className="bg-white rounded-3xl p-8 border border-dark-green/5 shadow-premium h-fit flex flex-col gap-6">
            <h2 className="text-xl font-bold font-heading text-dark-text border-b border-dark-green/10 pb-4">Checkout Summary</h2>
            
            <div className="flex flex-col gap-4 max-h-56 overflow-y-auto divide-y divide-gray-50 pb-2">
              {cart.map((item) => {
                if (!item.product) return null;
                const discount = item.product.discount || 0;
                const finalPrice = item.product.price - (item.product.price * (discount / 100));
                
                return (
                  <div key={item.id} className="pt-3 first:pt-0 flex justify-between text-xs text-gray-500">
                    <span>{item.product.name} (x{item.quantity})</span>
                    <span className="font-bold text-dark-text">Rs. {(finalPrice * item.quantity).toLocaleString()}</span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-dark-green/10 pt-4 flex flex-col gap-3 text-sm text-gray-500 font-light">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-dark-text">Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fees</span>
                <span className="text-green-600 font-bold uppercase">Free</span>
              </div>
              <div className="border-t border-dark-green/10 pt-4 flex justify-between text-base font-bold text-dark-text">
                <span>Grand Total</span>
                <span className="text-dark-green">Rs. {cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-dark-green hover:bg-light-green text-cream py-4 rounded-full font-bold transition shadow-md flex items-center justify-center gap-2"
            >
              <FaLock size={12} />
              {loading ? 'Processing Order...' : 'Place Secure Order'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Checkout;
