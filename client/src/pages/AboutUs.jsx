import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaUsers, FaHandsHelping, FaAward } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="pt-28 pb-20 min-h-screen bg-cream/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            <span className="text-xs text-gold font-bold uppercase tracking-widest flex items-center gap-1">
              <FaLeaf className="text-dark-green" /> Our Roots
            </span>
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-dark-text leading-tight">
              Honoring Ayurveda, <br />
              <span className="text-dark-green italic">Preserving Purity.</span>
            </h1>
            <p className="text-gray-600 leading-relaxed font-light">
              RP Ceylon Natural Product was founded in the heart of Sri Lanka, a land blessed with rich soil and centuries of wellness heritage. Inspired by standard Ceylon Ayurvedic medical scrolls, we started with a simple mission: to make authentic, organic wellness recipes accessible to the modern world while supporting the rural community of farmers who grow them.
            </p>
            <p className="text-gray-600 leading-relaxed font-light">
              We work directly with smallholders across Matale, Nuwara Eliya, and Galle, encouraging chemical-free polyculture farming. Our products are harvested by hand and sealed at origin to bring you uncontaminated, active therapeutic properties in every bag of herbal tea and bottle of essential oil.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <div className="rounded-3xl overflow-hidden shadow-premium border border-dark-green/10 p-4 bg-white max-w-[450px]">
              <img
                src="http://localhost:5000/images/herbal-tea.png"
                alt="Ayurveda Herbs Sourcing"
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </motion.div>
        </div>

        {/* Pillars Section */}
        <div className="bg-white rounded-3xl p-10 md:p-16 border border-dark-green/5 shadow-premium mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold font-heading text-dark-text mb-4">Our Foundations</h2>
            <p className="text-sm text-gray-500 font-light">The principles that guide our sourcing, creation, and operations.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4 text-center items-center">
              <div className="w-14 h-14 bg-dark-green/10 rounded-full flex items-center justify-center text-dark-green">
                <FaHandsHelping size={24} />
              </div>
              <h3 className="text-xl font-bold font-heading">Direct Fair Trade</h3>
              <p className="text-sm text-gray-500 font-light leading-relaxed">
                We eliminate middlemen. By working directly with farmers, we ensure they receive up to 40% higher pay than local market averages.
              </p>
            </div>

            <div className="flex flex-col gap-4 text-center items-center">
              <div className="w-14 h-14 bg-dark-green/10 rounded-full flex items-center justify-center text-dark-green">
                <FaLeaf size={24} />
              </div>
              <h3 className="text-xl font-bold font-heading">Biodiverse Cultivation</h3>
              <p className="text-sm text-gray-500 font-light leading-relaxed">
                We do not support deforested single-crop farming. All our herbs are grown in diverse forest gardens that preserve native Sri Lankan wildlife.
              </p>
            </div>

            <div className="flex flex-col gap-4 text-center items-center">
              <div className="w-14 h-14 bg-dark-green/10 rounded-full flex items-center justify-center text-dark-green">
                <FaAward size={24} />
              </div>
              <h3 className="text-xl font-bold font-heading">Uncompromised Quality</h3>
              <p className="text-sm text-gray-500 font-light leading-relaxed">
                From steam-distillation to low-temperature dehydrating, we use methods that preserve original biological values without any artificial additives.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
