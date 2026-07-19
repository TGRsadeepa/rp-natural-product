import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaChevronRight, FaStar, FaLeaf, FaShieldAlt, FaPlus, FaMinus } from 'react-icons/fa';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
  const { slug } = useParams();
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, inWishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  
  // Gallery
  const [selectedImg, setSelectedImg] = useState('');
  
  // Tabs: 'description' | 'ingredients' | 'usage' | 'reviews'
  const [activeTab, setActiveTab] = useState('description');

  // Local reviews state to allow user to add a review temporarily
  const [reviews, setReviews] = useState([]);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        setProduct(res.data);
        setReviews(res.data.reviews || []);
        
        // Find primary or first image
        const primary = res.data.images?.find((img) => img.isPrimary) || res.data.images?.[0];
        setSelectedImg(primary ? `http://localhost:5000${primary.url}` : '/images/sdsd.png');

        // Fetch related products in the same category
        if (res.data.category?.slug) {
          const relRes = await api.get(`/products?category=${res.data.category.slug}`);
          setRelated(relRes.data.filter((p) => p.id !== res.data.id).slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching product details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center">
        <div className="w-12 h-12 border-4 border-dark-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 font-light">Gathering product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center max-w-md mx-auto px-6">
        <h2 className="text-3xl font-bold font-heading text-dark-text mb-4">Product Not Found</h2>
        <p className="text-sm text-gray-500 font-light mb-6">
          The product you are looking for does not exist or has been removed from our listings.
        </p>
        <Link to="/shop" className="bg-dark-green text-cream px-6 py-2.5 rounded-full text-sm font-semibold">
          Return to Shop
        </Link>
      </div>
    );
  }

  const discount = product.discount || 0;
  const originalPrice = product.price;
  const finalPrice = originalPrice - (originalPrice * (discount / 100));

  const handleAdd = () => {
    addToCart(product, qty);
    alert(`${qty} x ${product.name} added to cart!`);
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewName || !newReviewComment) return;

    const newRev = {
      id: Date.now(),
      userName: newReviewName,
      rating: newReviewRating,
      comment: newReviewComment,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews([newRev, ...reviews]);
    setNewReviewName('');
    setNewReviewComment('');
    setNewReviewRating(5);
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-cream/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8 uppercase tracking-wider font-semibold">
          <Link to="/" className="hover:text-dark-green">Home</Link>
          <FaChevronRight size={8} />
          <Link to="/shop" className="hover:text-dark-green">Shop</Link>
          <FaChevronRight size={8} />
          <span className="text-gray-600">{product.name}</span>
        </div>

        {/* Product Panel */}
        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl p-8 md:p-12 shadow-premium border border-dark-green/5 mb-16">
          
          {/* Gallery Column */}
          <div className="flex flex-col gap-4">
            <div className="h-96 rounded-2xl bg-cream/30 overflow-hidden flex items-center justify-center p-6 border border-dark-green/5 relative">
              <img
                src={selectedImg}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-gold text-cream text-xs font-bold px-3 py-1 rounded-full">
                  {discount}% Off
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4">
                {product.images.map((img) => {
                  const url = `http://localhost:5000${img.url}`;
                  return (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImg(url)}
                      className={`w-20 h-20 rounded-xl bg-cream/20 border-2 overflow-hidden p-2 transition ${
                        selectedImg === url ? 'border-dark-green shadow-md' : 'border-transparent hover:border-gray-200'
                      }`}
                    >
                      <img src={url} alt="Thumbnail" className="w-full h-full object-contain" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-xs text-gold font-semibold uppercase tracking-wider">
                {product.category?.name || 'Ceylon Wellness'}
              </span>
              <h1 className="text-4xl font-bold font-heading text-dark-text mt-2 mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-1.5 text-gold text-sm">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
                <span className="text-xs text-gray-500 font-medium ml-1">({reviews.length} Customer Reviews)</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-dark-green">
                Rs. {finalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              {discount > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  Rs. {originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              )}
            </div>

            {/* Quick Benefits Tags */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-dark-green/10 py-6 my-2 text-sm text-gray-600 font-light">
              <div className="flex items-center gap-2">
                <FaLeaf className="text-dark-green" /> 100% Organic certified
              </div>
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-dark-green" /> Antiseptic & Pure
              </div>
            </div>

            {/* Stock status indicator */}
            <div className="text-sm">
              <span className="text-gray-500">Availability: </span>
              <span className={`font-bold ${
                product.stockStatus === 'IN_STOCK' ? 'text-green-600' :
                product.stockStatus === 'LOW_STOCK' ? 'text-orange-500' : 'text-red-500'
              }`}>
                {product.stockStatus === 'IN_STOCK' ? 'In Stock' :
                 product.stockStatus === 'LOW_STOCK' ? 'Low Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Add to Cart Actions */}
            <div className="flex gap-4 items-center pt-2">
              <div className="flex border border-dark-green/20 rounded-full items-center px-2 py-1 bg-cream/40">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-9 h-9 rounded-full hover:bg-white text-dark-green flex items-center justify-center transition"
                >
                  <FaMinus size={10} />
                </button>
                <span className="w-12 text-center text-sm font-bold text-dark-text">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-9 h-9 rounded-full hover:bg-white text-dark-green flex items-center justify-center transition"
                >
                  <FaPlus size={10} />
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={product.stockStatus === 'OUT_OF_STOCK'}
                className="flex-grow bg-dark-green hover:bg-light-green text-cream py-4 rounded-full font-bold transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                <FaShoppingCart size={16} /> Add to Cart
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-full border transition flex items-center justify-center ${
                  inWishlist(product.id) ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:text-dark-green'
                }`}
              >
                <FaHeart size={18} />
              </button>
            </div>

          </div>
        </div>

        {/* Tab details section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-premium border border-dark-green/5 mb-16">
          <div className="flex border-b border-dark-green/10 mb-8 overflow-x-auto gap-8">
            {[
              { id: 'description', label: 'Product Info' },
              { id: 'ingredients', label: 'Ingredients & Warnings' },
              { id: 'usage', label: 'Health Benefits & Usage' },
              { id: 'reviews', label: `Reviews (${reviews.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-base font-bold transition relative shrink-0 ${
                  activeTab === tab.id ? 'text-dark-green font-bold' : 'text-gray-400 hover:text-dark-text'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-dark-green rounded-full"></span>
                )}
              </button>
            ))}
          </div>

          <div className="text-gray-600 font-light leading-relaxed">
            {activeTab === 'description' && (
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold font-heading text-dark-text">Product Description</h3>
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-bold font-heading text-dark-text mb-2">Ingredients</h3>
                  <p>{product.ingredients || '100% natural, single-ingredient product.'}</p>
                </div>
                {product.warnings && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                    <h3 className="text-sm font-bold text-red-800 mb-1">Safety Warnings</h3>
                    <p className="text-xs text-red-700 font-medium">{product.warnings}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-bold font-heading text-dark-text mb-2">Health Benefits</h3>
                  <p>{product.healthBenefits || 'Traditionally used to promote physical balance and boost energy.'}</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold font-heading text-dark-text mb-2">Usage Instructions</h3>
                  <p>{product.usageInstructions || 'Brew or apply as recommended on product sleeve.'}</p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="grid md:grid-cols-2 gap-10">
                
                {/* Reviews List */}
                <div className="flex flex-col gap-6">
                  <h3 className="text-xl font-bold font-heading text-dark-text">Customer Reviews</h3>
                  {reviews.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No reviews yet. Be the first to share your thoughts!</p>
                  ) : (
                    <div className="flex flex-col gap-5 divide-y divide-gray-100">
                      {reviews.map((rev) => (
                        <div key={rev.id} className="pt-5 first:pt-0">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-dark-text">{rev.userName}</span>
                            <span className="text-xs text-gray-400">{rev.date}</span>
                          </div>
                          <div className="flex text-gold text-xs mb-2">
                            {[...Array(rev.rating)].map((_, i) => <FaStar key={i} />)}
                          </div>
                          <p className="text-sm text-gray-500">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Review Form */}
                <div className="bg-cream/40 p-6 rounded-2xl border border-dark-green/5">
                  <h3 className="text-lg font-bold font-heading text-dark-text mb-4">Add a Review</h3>
                  <form onSubmit={handleAddReview} className="flex flex-col gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1">Your Name</label>
                      <input
                        type="text"
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        required
                        className="w-full bg-white border border-dark-green/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-dark-green text-dark-text"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1">Rating</label>
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(parseInt(e.target.value))}
                        className="w-full bg-white border border-dark-green/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-dark-green text-dark-text"
                      >
                        <option value="5">5 Stars (Excellent)</option>
                        <option value="4">4 Stars (Good)</option>
                        <option value="3">3 Stars (Average)</option>
                        <option value="2">2 Stars (Poor)</option>
                        <option value="1">1 Star (Very Poor)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1">Your Comments</label>
                      <textarea
                        rows="4"
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        required
                        className="w-full bg-white border border-dark-green/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-dark-green text-dark-text"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="bg-dark-green hover:bg-light-green text-cream py-3 rounded-full font-semibold text-sm transition shadow"
                    >
                      Submit Review
                    </button>
                  </form>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Related Products Grid */}
        {related.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold font-heading text-dark-text mb-8">Related Wellness Products</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
