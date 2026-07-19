import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLeaf, FaArrowRight, FaStar, FaQuoteLeft } from 'react-icons/fa';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await api.get('/products');
        setProducts(prodRes.data.slice(0, 3)); // show top 3 best sellers

        const artRes = await api.get('/articles');
        setArticles(artRes.data.slice(0, 3)); // show top 3 health articles

        const testRes = await api.get('/testimonials');
        setTestimonials(testRes.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching homepage data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Framer Motion variant configurations
  const scrollFadeIn = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="pt-20">
      
      {/* 1. Hero Section (Dynamic Load Entry) */}
      <section className="bg-gradient-to-br from-cream via-[#FAF8F2] to-cream border-b border-dark-green/5 min-h-[85vh] flex items-center relative overflow-hidden py-16 px-6">
        <div className="absolute right-[-5%] top-[-5%] w-[40%] h-[40%] rounded-full bg-dark-green/5 blur-3xl"></div>
        <div className="absolute left-[-5%] bottom-[-5%] w-[40%] h-[40%] rounded-full bg-light-green/5 blur-3xl"></div>

        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-2 text-dark-green font-semibold tracking-wider text-sm uppercase">
              <FaLeaf className="animate-spin-slow text-light-green" />
              <span>Pure • Organic • Sri Lankan</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold font-heading leading-tight text-dark-text">
              Ceylon Natural Wellness, <br />
              <span className="text-dark-green italic">Crafted for Balance.</span>
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl font-light">
              Experience the healing touch of nature with our premium organic herbal infusions and steam-distilled essential oils. Sourced ethically from local farmers in Sri Lanka.
            </p>

            <div className="flex gap-4 pt-4">
              <Link
                to="/shop"
                className="bg-dark-green hover:bg-light-green text-cream px-8 py-4 rounded-full text-base font-bold transition shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Explore Shop
                <FaArrowRight size={14} />
              </Link>
              <Link
                to="/about"
                className="border-2 border-dark-green/20 hover:border-dark-green text-dark-green hover:text-dark-green px-8 py-4 rounded-full text-base font-bold transition"
              >
                Our Story
              </Link>
            </div>

            <div className="flex gap-10 mt-6 border-t border-dark-green/10 pt-6">
              <div>
                <p className="text-3xl font-bold text-dark-green font-heading">100%</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Natural Ingredients</p>
              </div>
              <div className="w-px bg-dark-green/10"></div>
              <div>
                <p className="text-3xl font-bold text-dark-green font-heading">Ceylon</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Origin Certified</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-[500px]">
              <div className="absolute inset-0 rounded-full border border-dark-green/10 animate-spin-slow"></div>
              <img
                src="http://localhost:5000/images/herbal-tea.png"
                alt="RP Ceylon Natural Tea"
                className="w-full h-auto drop-shadow-2xl z-10 relative"
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. Brand Core Values (Scroll Smooth Entry) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={scrollFadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold font-heading mb-4 text-dark-text">Why Choose RP Ceylon Natural Product?</h2>
            <p className="text-gray-500 font-light">
              We stand for purity, authentic Ayurvedic principles, and sustainability in every leaf and drop.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="grid md:grid-cols-4 gap-8"
          >
            {[
              { title: '100% Organic', desc: 'Grown without pesticides in organic certified Ceylon gardens.' },
              { title: 'Ethically Sourced', desc: 'Direct trade model providing fair wages to Sri Lankan farmers.' },
              { title: 'Ayurveda Inspired', desc: 'Formulated following centuries-old holistic healing sciences.' },
              { title: 'Freshly Packaged', desc: 'Sealed at origin to lock in maximum antioxidant benefits.' }
            ].map((val, idx) => (
              <motion.div
                key={idx}
                variants={scrollFadeIn}
                whileHover={{ y: -5, boxShadow: '0 20px 30px -10px rgba(46,125,50,0.1)' }}
                className="bg-cream/40 border border-dark-green/5 rounded-3xl p-8 shadow-premium text-center transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-dark-green/10 flex items-center justify-center text-dark-green mx-auto mb-5">
                  <FaLeaf />
                </div>
                <h3 className="text-xl font-bold font-heading mb-3">{val.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-light">{val.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. Featured Bestsellers (Scroll Smooth Entry) */}
      <section className="py-20 bg-cream/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={scrollFadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6"
          >
            <div>
              <p className="text-xs text-gold font-semibold uppercase tracking-widest mb-2">Our Curated Best Sellers</p>
              <h2 className="text-4xl font-bold font-heading text-dark-text">Popular Wellness Products</h2>
            </div>
            <Link to="/shop" className="text-dark-green font-bold text-sm hover:text-light-green transition flex items-center gap-1 group">
              View All Products
              <FaArrowRight size={12} className="group-hover:translate-x-1 transition" />
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-3xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-100px' }}
              className="grid md:grid-cols-3 gap-8"
            >
              {products.map((product) => (
                <motion.div key={product.id} variants={scrollFadeIn}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* 4. Health Library Preview (Scroll Smooth Entry) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={scrollFadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6"
          >
            <div>
              <p className="text-xs text-gold font-semibold uppercase tracking-widest mb-2">Nature's Wisdom & Education</p>
              <h2 className="text-4xl font-bold font-heading text-dark-text">Ayurvedic Health Library</h2>
            </div>
            <Link to="/health-library" className="text-dark-green font-bold text-sm hover:text-light-green transition flex items-center gap-1 group">
              Browse Articles
              <FaArrowRight size={12} className="group-hover:translate-x-1 transition" />
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-cream rounded-3xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-100px' }}
              className="grid md:grid-cols-3 gap-8"
            >
              {articles.map((article) => (
                <motion.div
                  key={article.id}
                  variants={scrollFadeIn}
                  className="bg-cream/20 border border-dark-green/5 rounded-3xl overflow-hidden shadow-premium flex flex-col justify-between"
                >
                  <div className="h-48 overflow-hidden bg-cream/30">
                    <img
                      src={`http://localhost:5000${article.featuredImage}`}
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] bg-gold/10 text-gold px-2.5 py-1 rounded-full font-bold uppercase">
                        {article.category}
                      </span>
                      <Link to={`/health-library/${article.slug}`}>
                        <h3 className="text-xl font-bold font-heading mt-4 hover:text-dark-green transition line-clamp-1">
                          {article.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-3 font-light">
                        {article.content}
                      </p>
                    </div>
                    <div className="border-t border-dark-green/5 mt-6 pt-4 flex justify-between items-center text-xs text-gray-400">
                      <span>By {article.author.split(' ')[0]}</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* 5. Customer Testimonials (Scroll Smooth Entry) */}
      <section className="py-20 bg-cream/30 border-t border-dark-green/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            variants={scrollFadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="max-w-2xl mx-auto mb-16"
          >
            <p className="text-xs text-gold font-semibold uppercase tracking-widest mb-2">Verified Customer Stories</p>
            <h2 className="text-4xl font-bold font-heading text-dark-text">What Our Community Says</h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((test) => (
              <motion.div
                key={test.id}
                variants={scrollFadeIn}
                className="bg-white rounded-3xl p-8 shadow-premium text-left relative flex flex-col justify-between"
              >
                <div>
                  <FaQuoteLeft className="text-gold/20 text-3xl mb-5" />
                  <p className="text-gray-600 font-light italic leading-relaxed mb-6">
                    "{test.comment}"
                  </p>
                </div>
                <div>
                  <div className="flex gap-1 text-gold mb-3">
                    {[...Array(test.rating)].map((_, i) => (
                      <FaStar key={i} size={12} />
                    ))}
                  </div>
                  <h4 className="font-bold text-dark-text">{test.userName}</h4>
                  <p className="text-xs text-gray-400">{test.userRole}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;