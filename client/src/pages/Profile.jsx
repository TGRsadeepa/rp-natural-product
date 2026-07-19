import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaHeart, FaHistory, FaLeaf, FaTruck, FaFileInvoiceDollar, FaCheckCircle, FaChevronRight } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Profile = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { wishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  // Active Tab: 'profile' | 'wishlist' | 'orders'
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Load Order History
  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
          const res = await api.get('/orders/my-orders');
          setOrders(res.data);
        } catch (error) {
          console.error('Error fetching orders', error);
        } finally {
          setOrdersLoading(false);
        }
      };
      fetchOrders();
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="pt-32 pb-20 text-center">
        <div className="w-12 h-12 border-4 border-dark-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 font-light">Loading account dashboard...</p>
      </div>
    );
  }

  // Helper to determine status steps progress
  const getStatusStepClass = (orderStatus, currentStep) => {
    const statuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED'];
    const orderIndex = statuses.indexOf(orderStatus);
    const stepIndex = statuses.indexOf(currentStep);

    if (orderStatus === 'CANCELLED') {
      return 'bg-red-200 text-red-700';
    }

    if (orderIndex >= stepIndex) {
      return 'bg-dark-green text-cream';
    } else {
      return 'bg-gray-200 text-gray-400';
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-cream/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* User Greeting Card */}
        <div className="bg-white rounded-3xl p-8 border border-dark-green/5 shadow-premium mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-dark-green flex items-center justify-center text-cream">
              <FaUser size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-heading text-dark-text">{user.name}</h1>
              <p className="text-sm text-gray-500 font-light">{user.email}</p>
            </div>
          </div>
          {user.role === 'ADMIN' && (
            <Link to="/admin" className="bg-gold text-cream px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow">
              Access Admin Panel
            </Link>
          )}
        </div>

        {/* Core Layout Grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Menu Sidebar */}
          <div className="bg-white rounded-3xl p-6 border border-dark-green/5 shadow-premium flex flex-col gap-2 h-fit">
            {[
              { id: 'orders', label: 'Order History', icon: <FaHistory /> },
              { id: 'wishlist', label: `My Wishlist (${wishlist.length})`, icon: <FaHeart /> },
              { id: 'profile', label: 'Profile Details', icon: <FaUser /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left text-sm py-3 px-4 rounded-xl transition flex items-center gap-3 ${
                  activeTab === tab.id
                    ? 'bg-dark-green text-cream font-bold'
                    : 'hover:bg-cream text-dark-text'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Contents Panel */}
          <div className="lg:col-span-3">
            
            {/* 1. Orders Tab */}
            {activeTab === 'orders' && (
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold font-heading text-dark-text">Your Order History</h2>
                
                {ordersLoading ? (
                  <div className="bg-white rounded-3xl p-8 text-center animate-pulse h-48"></div>
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-dark-green/5 shadow-premium">
                    <h3 className="text-lg font-bold font-heading text-dark-text mb-2">No Orders Found</h3>
                    <p className="text-sm text-gray-500 font-light mb-6">You haven't placed any orders yet.</p>
                    <Link to="/shop" className="bg-dark-green text-cream px-6 py-2.5 rounded-full text-sm font-semibold">Explore Products</Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-8">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-premium border border-dark-green/5">
                        
                        {/* Order Header */}
                        <div className="flex flex-wrap justify-between items-start border-b border-dark-green/5 pb-4 mb-6 gap-4">
                          <div>
                            <span className="text-xs text-gray-400">Order ID:</span>
                            <h3 className="font-bold text-dark-text text-sm">#{order.id}</h3>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400">Tracking Number:</span>
                            <p className="font-bold text-dark-green text-sm">{order.trackingNumber || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400">Placed Date:</span>
                            <p className="text-sm text-gray-500 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400">Total Price:</span>
                            <p className="font-bold text-dark-text text-sm">Rs. {order.totalAmount.toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="flex flex-col gap-4 mb-8">
                          {order.items?.map((item) => {
                            const primaryImage = item.product?.images?.find((img) => img.isPrimary) || item.product?.images?.[0];
                            const imageUrl = primaryImage ? `http://localhost:5000${primaryImage.url}` : '/images/sdsd.png';
                            return (
                              <div key={item.id} className="flex justify-between items-center text-sm text-gray-600 font-light border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-cream/30 border rounded-lg p-1 overflow-hidden shrink-0">
                                    <img src={imageUrl} alt={item.product?.name} className="w-full h-full object-contain" />
                                  </div>
                                  <div>
                                    <span className="font-bold text-dark-text">{item.product?.name}</span>
                                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                                <span className="font-semibold text-dark-text">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* ORDER TRACKING PROGRESS STEPS */}
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-1.5">
                            <FaTruck /> Order Status Tracking
                          </p>
                          
                          {order.status === 'CANCELLED' ? (
                            <div className="bg-red-50 border border-red-200 text-red-800 text-xs px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider">
                              Order Cancelled
                            </div>
                          ) : (
                            <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs">
                              {[
                                { step: 'PENDING', label: 'Order Placed' },
                                { step: 'PAID', label: 'Payment Confirmed' },
                                { step: 'SHIPPED', label: 'In Transit' },
                                { step: 'DELIVERED', label: 'Delivered' }
                              ].map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-2">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm transition ${getStatusStepClass(order.status, item.step)}`}>
                                    {idx + 1}
                                  </div>
                                  <span className="font-bold text-gray-500 uppercase tracking-wide text-[9px] md:text-[10px]">{item.label}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold font-heading text-dark-text">Your Wishlist favorites</h2>
                
                {wishlist.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-dark-green/5 shadow-premium">
                    <h3 className="text-lg font-bold font-heading text-dark-text mb-2">No Favorites Saved</h3>
                    <p className="text-sm text-gray-500 font-light mb-6">Click the heart icon on any product to save it here.</p>
                    <Link to="/shop" className="bg-dark-green text-cream px-6 py-2.5 rounded-full text-sm font-semibold">Explore Products</Link>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((item) => (
                      <ProductCard key={item.id} product={item.product} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-8 border border-dark-green/5 shadow-premium flex flex-col gap-6">
                <h2 className="text-2xl font-bold font-heading text-dark-text border-b border-dark-green/10 pb-3">Account Details</h2>
                
                <div className="grid sm:grid-cols-2 gap-6 text-sm text-gray-500 font-light">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-bold text-gray-400 uppercase text-xs tracking-wider">Full Name</span>
                    <p className="font-semibold text-dark-text text-base">{user.name}</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-bold text-gray-400 uppercase text-xs tracking-wider">Email Address</span>
                    <p className="font-semibold text-dark-text text-base">{user.email}</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-bold text-gray-400 uppercase text-xs tracking-wider">Registered Role</span>
                    <p className="font-semibold text-dark-green uppercase text-xs tracking-wider font-bold bg-dark-green/10 px-3 py-1.5 rounded-full w-fit">
                      {user.role}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-bold text-gray-400 uppercase text-xs tracking-wider">Registered Date</span>
                    <p className="font-semibold text-dark-text text-base">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
