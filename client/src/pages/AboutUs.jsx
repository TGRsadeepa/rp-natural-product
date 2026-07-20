import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaSeedling, FaMortarPestle, FaChartLine, FaCheckCircle } from 'react-icons/fa';
import aboutImage from '../assets/images/about-wellness.png';

const AboutUs = () => {
  return (
    <div className="pt-28 pb-20 min-h-screen bg-cream/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* 1. Brand Story & Growth Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            <span className="text-xs text-gold font-bold uppercase tracking-widest flex items-center gap-1.5">
              <FaSeedling className="text-dark-green" /> Our Journey
            </span>
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-dark-text leading-tight">
              Small Beginnings, <br />
              <span className="text-dark-green italic">Growing with Purpose.</span>
            </h1>
            <p className="text-gray-600 leading-relaxed font-light">
              <strong className="font-semibold text-dark-text">RP Ceylon Natural Product</strong> started as a small, passionate homegrown venture in Sri Lanka. Driven by a simple desire to share the pure, unadulterated goodness of Ceylon nature, we are continuously improving, expanding, and scaling our operations step-by-step.
            </p>
            <p className="text-gray-600 leading-relaxed font-light">
              We don't limit ourselves to a single product line. From soothing herbal tea infusions to concentrated essential oils and nutrient-rich natural powders, our goal is to bring authentic, multi-purpose natural wellness solutions straight from local gardens to your daily life.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <div className="rounded-3xl overflow-hidden shadow-sm border border-dark-green/10 p-3 bg-white max-w-[430px]">
              <img
                src={aboutImage}
                alt="Delivering Ceylon Natural Wellness with Care"
                className="w-full h-auto rounded-2xl object-cover opacity-95 hover:opacity-100 transition duration-500"
              />
              <p className="text-[11px] text-gray-400 text-center font-light pt-2.5 italic">
                Crafted with care & delivered straight from local gardens to your home.
              </p>
            </div>
          </motion.div>
        </div>

        {/* 2. Diverse Offerings (Not Frame to One Category) */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs text-gold font-bold uppercase tracking-widest block mb-2">What We Offer</span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-dark-text mb-4">Our Growing Product Lineup</h2>
            <p className="text-sm text-gray-500 font-light">
              Carefully curated items crafted to suit your daily health, tea breaks, and natural lifestyle needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Category 1: Herbal Teas & Infusions */}
            <div className="bg-white rounded-3xl p-8 shadow-premium border border-dark-green/5 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-dark-green/10 flex items-center justify-center text-dark-green mb-5">
                  <FaLeaf size={20} />
                </div>
                <h3 className="text-xl font-bold font-heading text-dark-text mb-3">Herbal Teas & Infusions</h3>
                <p className="text-xs text-gray-400 font-light mb-4">Convenient tea bags & wellness brews</p>
                <ul className="flex flex-col gap-2.5 text-sm text-gray-600 font-light">
                  {[
                    'Single-herb & botanical tea bag blends',
                    'Ayurveda-inspired wellness infusions',
                    '100% natural, caffeine-free daily options',
                    'Sealed at origin to lock in fresh aroma'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <FaCheckCircle className="text-light-green text-xs shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Category 2: Natural Powders */}
            <div className="bg-white rounded-3xl p-8 shadow-premium border border-dark-green/5 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-dark-green/10 flex items-center justify-center text-dark-green mb-5">
                  <FaMortarPestle size={20} />
                </div>
                <h3 className="text-xl font-bold font-heading text-dark-text mb-3">Pure Botanical Powders</h3>
                <p className="text-xs text-gray-400 font-light mb-4">Dehydrated superfoods & natural powders</p>
                <ul className="flex flex-col gap-2.5 text-sm text-gray-600 font-light">
                  {[
                    'Dehydrated root & leaf powders',
                    'Pure spice powders for drinks & recipes',
                    'No added sugars, fillers, or artificial colors',
                    'Finely ground for easy daily consumption'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <FaCheckCircle className="text-light-green text-xs shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Category 3: Essential Oils & Cinnamon Products */}
            <div className="bg-white rounded-3xl p-8 shadow-premium border border-dark-green/5 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-dark-green/10 flex items-center justify-center text-dark-green mb-5">
                  <FaSeedling size={20} />
                </div>
                <h3 className="text-xl font-bold font-heading text-dark-text mb-3">Essential Oils & Specialties</h3>
                <p className="text-xs text-gray-400 font-light mb-4">Concentrated extracts & handcrafted items</p>
                <ul className="flex flex-col gap-2.5 text-sm text-gray-600 font-light">
                  {[
                    '100% pure steam-distilled leaf & plant oils',
                    'Authentic Ceylon Cinnamon products',
                    'Natural aromatherapy & topical solutions',
                    'Handcrafted in small batches to preserve potency'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <FaCheckCircle className="text-light-green text-xs shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Core Values (Small Business Commitment) */}
        <div className="bg-white rounded-3xl p-10 md:p-14 border border-dark-green/5 shadow-premium">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold font-heading text-dark-text mb-3">Our Core Commitments</h2>
            <p className="text-sm text-gray-500 font-light">How we maintain quality as we scale up.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-dark-green shadow-sm">
                <FaChartLine size={18} />
              </div>
              <h4 className="font-bold text-dark-text font-heading text-lg">Constant Improvement</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                We listen to customer feedback every day, continually refining our processing, packaging, and product range.
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-dark-green shadow-sm">
                <FaLeaf size={18} />
              </div>
              <h4 className="font-bold text-dark-text font-heading text-lg">Pure & Chemical-Free</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                No synthetic preservatives, artificial colors, or harsh additives. Only 100% natural Sri Lankan ingredients.
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-dark-green shadow-sm">
                <FaSeedling size={18} />
              </div>
              <h4 className="font-bold text-dark-text font-heading text-lg">Locally Sourced</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Harvested with care from local gardens across Sri Lanka, supporting sustainable micro-farming.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
