import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaCheckCircle } from 'react-icons/fa';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-cream/30">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-dark-text mb-4">Connect With Our Wellness Team</h1>
          <p className="text-gray-500 font-light leading-relaxed">
            Have questions about our Ayurvedic remedies, ingredients, or need assistance with your order? We are here to support your wellness journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 items-start">
          
          {/* Info Panels */}
          <div className="flex flex-col gap-6 md:col-span-1">
            
            <div className="bg-white rounded-2xl p-6 border border-dark-green/5 shadow-premium flex gap-4">
              <div className="w-10 h-10 rounded-full bg-dark-green/10 flex items-center justify-center text-dark-green shrink-0">
                <FaPhoneAlt size={14} />
              </div>
              <div>
                <h3 className="font-bold text-dark-text">Call Us</h3>
                <p className="text-sm text-gray-500 mt-1 font-light">+94 (11) 234-5678</p>
                <p className="text-sm text-gray-500 font-light">+94 (77) 123-4567</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-dark-green/5 shadow-premium flex gap-4">
              <div className="w-10 h-10 rounded-full bg-dark-green/10 flex items-center justify-center text-dark-green shrink-0">
                <FaEnvelope size={14} />
              </div>
              <div>
                <h3 className="font-bold text-dark-text">Email Address</h3>
                <p className="text-sm text-gray-500 mt-1 font-light">wellness@rpnatural.com</p>
                <p className="text-sm text-gray-500 font-light">orders@rpnatural.com</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-dark-green/5 shadow-premium flex gap-4">
              <div className="w-10 h-10 rounded-full bg-dark-green/10 flex items-center justify-center text-dark-green shrink-0">
                <FaMapMarkerAlt size={14} />
              </div>
              <div>
                <h3 className="font-bold text-dark-text">Wellness Office</h3>
                <p className="text-sm text-gray-500 mt-1 font-light leading-relaxed">
                  128 Galle Road, Colombo 03, Sri Lanka.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-dark-green/5 shadow-premium flex gap-4">
              <div className="w-10 h-10 rounded-full bg-dark-green/10 flex items-center justify-center text-dark-green shrink-0">
                <FaClock size={14} />
              </div>
              <div>
                <h3 className="font-bold text-dark-text">Opening Hours</h3>
                <p className="text-sm text-gray-500 mt-1 font-light">Mon - Fri: 8:00 AM - 5:00 PM</p>
                <p className="text-sm text-gray-500 font-light">Saturday: 9:00 AM - 1:00 PM</p>
              </div>
            </div>

          </div>

          {/* Form Panel */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-premium border border-dark-green/5 md:col-span-2">
            <h2 className="text-2xl font-bold font-heading text-dark-text mb-6">Send Us a Message</h2>
            
            {submitted ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-2xl flex items-center gap-4 animate-fadeIn">
                <FaCheckCircle className="text-green-600 shrink-0 text-3xl" />
                <div>
                  <h4 className="font-bold text-green-950">Thank you!</h4>
                  <p className="text-sm mt-0.5 text-green-700 font-light">Your wellness request was sent. Our team will get back to you shortly.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-cream/40 border border-dark-green/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-dark-green text-dark-text"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-cream/40 border border-dark-green/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-dark-green text-dark-text"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-cream/40 border border-dark-green/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-dark-green text-dark-text"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message</label>
                  <textarea
                    rows="6"
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-cream/40 border border-dark-green/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-dark-green text-dark-text"
                  ></textarea>
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="bg-dark-green hover:bg-light-green text-cream px-8 py-3.5 rounded-full font-bold transition shadow-md hover:shadow-lg"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
