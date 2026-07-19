import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaLeaf, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#214324] text-cream pt-16 pb-8 border-t-4 border-gold">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        
        {/* Brand Info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-light-green flex items-center justify-center text-cream">
              <FaLeaf size={16} />
            </div>
            <h2 className="text-xl font-bold font-heading text-cream">RP Ceylon Natural Product</h2>
          </div>
          <p className="text-sm text-cream/80 leading-relaxed font-light">
            Bringing you the finest organic wellness infusions and natural oils crafted with love from the lush gardens of Sri Lanka. 100% natural, Ayurveda-inspired Ceylon recipes.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="w-8 h-8 rounded-full bg-cream/10 flex items-center justify-center text-cream hover:bg-gold hover:text-dark-text transition duration-300">
              <FaFacebookF size={14} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-cream/10 flex items-center justify-center text-cream hover:bg-gold hover:text-dark-text transition duration-300">
              <FaInstagram size={14} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-cream/10 flex items-center justify-center text-cream hover:bg-gold hover:text-dark-text transition duration-300">
              <FaTwitter size={14} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold font-heading mb-5 text-gold">Shop & Discover</h3>
          <ul className="flex flex-col gap-3 text-sm text-cream/80 font-light">
            <li><Link to="/shop" className="hover:text-gold transition">Our Wellness Shop</Link></li>
            <li><Link to="/health-library" className="hover:text-gold transition">Health & Ayurveda Library</Link></li>
            <li><Link to="/about" className="hover:text-gold transition">Our Organic Story</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition">Wellness Support & Contact</Link></li>
            <li><Link to="/profile" className="hover:text-gold transition">My Order History</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-bold font-heading mb-5 text-gold">Get in Touch</h3>
          <ul className="flex flex-col gap-4 text-sm text-cream/80 font-light">
            <li className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-light-green shrink-0" />
              <span>128 Galle Road, Colombo 03, Sri Lanka</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-light-green shrink-0" />
              <span>+94 (11) 234-5678</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-light-green shrink-0" />
              <span>wellness@rpnatural.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h3 className="text-lg font-bold font-heading mb-5 text-gold">Join Our Wellness Circle</h3>
          <p className="text-sm text-cream/80 leading-relaxed font-light mb-4">
            Receive exclusive updates, wellness articles, and organic recipes directly to your inbox.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-cream/10 border border-cream/20 text-cream rounded-full px-5 py-3 text-sm focus:outline-none focus:border-gold placeholder-cream/50"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bg-gold hover:bg-light-green text-dark-text hover:text-cream px-4 py-2 rounded-full text-xs font-bold transition duration-300"
              >
                Join
              </button>
            </div>
            {subscribed && (
              <p className="text-xs text-light-green font-semibold animate-pulse">
                Welcome! Check your inbox for a special welcome offer.
              </p>
            )}
          </form>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-cream/10 mt-12 pt-8 text-center text-xs text-cream/60">
        <p>© {new Date().getFullYear()} RP Ceylon Natural Product Pvt Ltd. All Rights Reserved. Crafted with care in Sri Lanka.</p>
      </div>
    </footer>
  );
};

export default Footer;
