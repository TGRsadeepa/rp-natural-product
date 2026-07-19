import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaBookOpen, FaLeaf, FaChevronLeft, FaClock, FaUser } from 'react-icons/fa';
import api from '../services/api';

const HealthLibrary = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // List View states
  const [articles, setArticles] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [loading, setLoading] = useState(true);

  // Detail View states
  const [article, setArticle] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Categories list derived or standard
  const categories = ['Digestive Wellness', 'Gut Health', 'Immunity Boost', 'Aromatherapy'];

  // Effect for Article List
  useEffect(() => {
    if (!slug) {
      const fetchArticles = async () => {
        setLoading(true);
        try {
          const url = selectedCat ? `/articles?category=${selectedCat}` : '/articles';
          const res = await api.get(url);
          setArticles(res.data);
        } catch (error) {
          console.error('Error fetching articles', error);
        } finally {
          setLoading(false);
        }
      };
      fetchArticles();
    }
  }, [slug, selectedCat]);

  // Effect for Article Detail
  useEffect(() => {
    if (slug) {
      const fetchArticle = async () => {
        setLoadingDetail(true);
        try {
          const res = await api.get(`/articles/${slug}`);
          setArticle(res.data);
        } catch (error) {
          console.error('Error fetching article detail', error);
        } finally {
          setLoadingDetail(false);
        }
      };
      fetchArticle();
    }
  }, [slug]);

  // --- RENDERING DETAIL VIEW ---
  if (slug) {
    if (loadingDetail) {
      return (
        <div className="pt-32 pb-20 text-center">
          <div className="w-12 h-12 border-4 border-dark-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-light">Loading wellness insights...</p>
        </div>
      );
    }

    if (!article) {
      return (
        <div className="pt-32 pb-20 text-center max-w-md mx-auto px-6">
          <h2 className="text-3xl font-bold font-heading text-dark-text mb-4">Article Not Found</h2>
          <button onClick={() => navigate('/health-library')} className="bg-dark-green text-cream px-6 py-2.5 rounded-full text-sm font-semibold">
            Back to Library
          </button>
        </div>
      );
    }

    return (
      <div className="pt-28 pb-20 min-h-screen bg-cream/30">
        <div className="max-w-4xl mx-auto px-6">
          
          <button
            onClick={() => navigate('/health-library')}
            className="flex items-center gap-2 text-dark-green hover:text-light-green font-bold text-sm mb-8 transition"
          >
            <FaChevronLeft size={10} /> Back to Library
          </button>

          <article className="bg-white rounded-3xl overflow-hidden shadow-premium border border-dark-green/5">
            {/* Featured Image */}
            <div className="h-96 w-full bg-cream/30 relative">
              <img
                src={`http://localhost:5000${article.featuredImage}`}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs bg-gold text-cream px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  {article.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold font-heading mt-3 leading-tight">
                  {article.title}
                </h1>
              </div>
            </div>

            {/* Content & Metadata */}
            <div className="p-8 md:p-12">
              <div className="flex flex-wrap items-center gap-6 border-b border-dark-green/10 pb-6 mb-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <FaUser className="text-dark-green" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-dark-green" />
                  <span>{article.readTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaBookOpen className="text-dark-green" />
                  <span>Published: {new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>

              {/* Body Text */}
              <div className="prose max-w-none text-gray-600 font-light leading-relaxed text-base space-y-6">
                {article.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="whitespace-pre-line">{paragraph}</p>
                ))}
              </div>

              {/* Premium Footer Quote */}
              <div className="mt-12 bg-cream/40 border-l-4 border-gold p-6 rounded-r-2xl flex items-start gap-4">
                <FaLeaf className="text-dark-green text-3xl shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-dark-text font-heading text-lg mb-1">Ayurvedic Precept</h4>
                  <p className="text-sm italic text-gray-500 font-light leading-relaxed">
                    "When diet is wrong, medicine is of no use. When diet is correct, medicine is of no need." - Ancient Wellness Proverb.
                  </p>
                </div>
              </div>

            </div>
          </article>

        </div>
      </div>
    );
  }

  // --- RENDERING LIST VIEW ---
  return (
    <div className="pt-28 pb-20 min-h-screen bg-cream/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Banner */}
        <div className="bg-[#214324] rounded-3xl p-8 md:p-12 text-cream mb-12 flex flex-col md:flex-row justify-between items-center relative overflow-hidden shadow-lg border-b-4 border-gold">
          <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-3">Natural Health Library</h1>
            <p className="text-sm md:text-base text-cream/80 max-w-md font-light">
              Explore health benefits, herbal teas applications, Ayurvedic home remedies, and guide notes written by practitioners.
            </p>
          </div>
          <div className="w-40 h-40 bg-cream/5 rounded-full absolute right-[-50px] top-[-50px] blur-2xl"></div>
        </div>

        {/* Category filters */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2 select-none">
          <button
            onClick={() => setSelectedCat('')}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide border transition duration-300 shrink-0 ${
              selectedCat === ''
                ? 'bg-dark-green border-dark-green text-cream shadow-md'
                : 'bg-white border-dark-green/10 text-dark-text hover:border-dark-green'
            }`}
          >
            All Insights
          </button>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCat(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide border transition duration-300 shrink-0 ${
                selectedCat === cat
                  ? 'bg-dark-green border-dark-green text-cream shadow-md'
                  : 'bg-white border-dark-green/10 text-dark-text hover:border-dark-green'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles list */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl h-80 animate-pulse"></div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dark-green/5 shadow-premium">
            <h3 className="text-xl font-bold font-heading text-dark-text">No articles found</h3>
            <p className="text-sm text-gray-500 font-light mt-2">Check back later or try selecting another category.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((art) => (
              <div key={art.id} className="bg-white border border-dark-green/5 rounded-3xl overflow-hidden shadow-premium flex flex-col justify-between">
                <div className="h-48 bg-cream/20 overflow-hidden">
                  <img
                    src={`http://localhost:5000${art.featuredImage}`}
                    alt={art.title}
                    className="w-full h-full object-cover hover:scale-102 transition duration-500"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] bg-gold/10 text-gold px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                      {art.category}
                    </span>
                    <Link to={`/health-library/${art.slug}`}>
                      <h3 className="text-xl font-bold font-heading mt-4 hover:text-dark-green transition line-clamp-1">
                        {art.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-3 font-light">
                      {art.content}
                    </p>
                  </div>
                  <div className="border-t border-dark-green/5 mt-6 pt-4 flex justify-between items-center text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <FaUser size={10} className="text-dark-green" /> {art.author.split(' ')[0]}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock size={10} className="text-dark-green" /> {art.readTime}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default HealthLibrary;
