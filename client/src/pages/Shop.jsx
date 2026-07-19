import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaRedo } from 'react-icons/fa';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/products/categories');
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory) queryParams.append('category', selectedCategory);
        if (search) queryParams.append('search', search);
        if (sort) queryParams.append('sort', sort);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);

        const res = await api.get(`/products?${queryParams.toString()}`);
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching products', error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [selectedCategory, search, sort, minPrice, maxPrice]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSort('newest');
    setMinPrice('');
    setMaxPrice('');
  };

  // Variants for parent animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-cream/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Animated Banner */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="bg-[#214324] rounded-3xl p-8 md:p-12 text-cream mb-12 flex flex-col md:flex-row justify-between items-center relative overflow-hidden shadow-lg border-b-4 border-gold"
        >
          <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold font-heading mb-3"
            >
              Our Wellness Shop
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm md:text-base text-cream/80 max-w-md font-light"
            >
              Discover authentic, organic Sri Lankan teas, natural oils, and traditional herbs crafted for clean, balanced living.
            </motion.p>
          </div>
          <div className="w-40 h-40 bg-cream/5 rounded-full absolute right-[-50px] top-[-50px] blur-2xl"></div>
        </motion.div>

        {/* Core Layout Grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Animated Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-6 shadow-premium border border-dark-green/5 flex flex-col gap-6 h-fit"
          >
            <div className="flex justify-between items-center border-b border-dark-green/10 pb-4">
              <h2 className="text-lg font-bold font-heading flex items-center gap-2 text-dark-text">
                <FaFilter className="text-dark-green" size={14} /> Filters
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResetFilters}
                className="text-xs text-gold hover:text-dark-green font-bold flex items-center gap-1 transition"
              >
                <FaRedo size={10} /> Reset
              </motion.button>
            </div>

            {/* Search Input */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Search Product</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Lemongrass..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-cream/50 border border-dark-green/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-dark-green placeholder-gray-400"
                />
                <FaSearch className="absolute left-3.5 top-3.5 text-gray-400" size={12} />
              </div>
            </div>

            {/* Category Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Categories</label>
              <div className="flex flex-col gap-1.5 mt-1">
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => setSelectedCategory('')}
                  className={`text-left text-sm py-2 px-3 rounded-xl transition ${
                    selectedCategory === ''
                      ? 'bg-dark-green text-cream font-bold shadow-md'
                      : 'hover:bg-cream text-dark-text'
                  }`}
                >
                  All Products
                </motion.button>
                {categories.map((cat) => (
                  <motion.button
                    whileHover={{ x: 5 }}
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`text-left text-sm py-2 px-3 rounded-xl transition flex justify-between items-center ${
                      selectedCategory === cat.slug
                        ? 'bg-dark-green text-cream font-bold shadow-md'
                        : 'hover:bg-cream text-dark-text'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      selectedCategory === cat.slug ? 'bg-cream/20 text-cream' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {cat._count?.products || 0}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Price Range (Rs.)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-cream/50 border border-dark-green/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-dark-green placeholder-gray-400"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-cream/50 border border-dark-green/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-dark-green placeholder-gray-400"
                />
              </div>
            </div>

            {/* Sorting */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Sort By</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full bg-cream/50 border border-dark-green/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-dark-green text-dark-text"
              >
                <option value="newest">Newest Arrival</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>

          </motion.div>

          {/* Products Grid Pane */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-3xl h-[420px] animate-pulse"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-12 text-center shadow-premium border border-dark-green/5"
              >
                <h3 className="text-2xl font-bold font-heading text-dark-text mb-2">No Products Found</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto font-light mb-6">
                  We couldn't find any items matching your selected criteria. Try adjusting your filters or searches.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-dark-green text-cream px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-light-green transition"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {products.map((product) => (
                    <motion.div
                      layout
                      key={product.id}
                      variants={itemVariants}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Shop;
