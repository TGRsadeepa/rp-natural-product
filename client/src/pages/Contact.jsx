import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaCheckCircle, FaPaperPlane } from 'react-icons/fa';

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
    <div className="pt-28 pb-16 min-h-screen bg-cream/30">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Compact Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-dark-text mb-2.5">
            Connect With Our Wellness Team
          </h1>
          <p className="text-sm text-gray-500 font-light leading-relaxed">
            Have questions about our natural teas, powders, or oils? We are here to support your wellness journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          
          {/* Left Side: Consolidated Compact Contact Info Card */}
          <div className="bg-white rounded-3xl p-6 md:p-7 border border-dark-green/5 shadow-premium flex flex-col gap-5 md:col-span-1">
            <h2 className="text-lg font-bold font-heading text-dark-text border-b border-dark-green/5 pb-3">
              Contact Information
            </h2>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-dark-green/10 flex items-center justify-center text-dark-green shrink-0 mt-0.5">
                <FaPhoneAlt size={13} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-dark-text uppercase tracking-wider">Phone</h4>
                <p className="text-xs text-gray-500 font-light mt-0.5">+94 (11) 234-5678</p>
                <p className="text-xs text-gray-500 font-light">+94 (77) 123-4567</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-dark-green/10 flex items-center justify-center text-dark-green shrink-0 mt-0.5">
                <FaEnvelope size={13} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-dark-text uppercase tracking-wider">Email</h4>
                <p className="text-xs text-gray-500 font-light mt-0.5">wellness@rpnatural.com</p>
                <p className="text-xs text-gray-500 font-light">orders@rpnatural.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-dark-green/10 flex items-center justify-center text-dark-green shrink-0 mt-0.5">
                <FaMapMarkerAlt size={13} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-dark-text uppercase tracking-wider">Location</h4>
                <p className="text-xs text-gray-500 font-light mt-0.5 leading-relaxed">
                  128 Galle Road, Colombo 03, Sri Lanka
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-dark-green/10 flex items-center justify-center text-dark-green shrink-0 mt-0.5">
                <FaClock size={13} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-dark-text uppercase tracking-wider">Business Hours</h4>
                <p className="text-xs text-gray-500 font-light mt-0.5">Mon - Fri: 8:00 AM - 5:00 PM</p>
                <p className="text-xs text-gray-500 font-light">Saturday: 9:00 AM - 1:00 PM</p>
              </div>
            </div>
          </div>

          {/* Right Side: Thinner, Streamlined Form */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-premium border border-dark-green/5 md:col-span-2">
            <h2 className="text-xl font-bold font-heading text-dark-text mb-4">Send Us a Message</h2>
            
            {submitted ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-5 rounded-2xl flex items-center gap-3.5 animate-fadeIn">
                <FaCheckCircle className="text-green-600 shrink-0 text-2xl" />
                <div>
                  <h4 className="font-bold text-green-950 text-sm">Thank you!</h4>
                  <p className="text-xs mt-0.5 text-green-700 font-light">Your message has been sent. Our wellness team will get back to you soon.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-cream/40 border border-dark-green/10 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-dark-green text-dark-text"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Your Email</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-cream/40 border border-dark-green/10 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-dark-green text-dark-text"
                  />
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Subject</label>
                  <input
                    type="text"
                    placeholder="Inquiry about Herbal Teas / Orders"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-cream/40 border border-dark-green/10 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-dark-green text-dark-text"
                  />
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Message</label>
                  <textarea
                    rows="3.5"
                    required
                    placeholder="Write your message here..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-cream/40 border border-dark-green/10 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-dark-green text-dark-text"
                  ></textarea>
                </div>

                <div className="sm:col-span-2 pt-1">
                  <button
                    type="submit"
                    className="bg-dark-green hover:bg-light-green text-cream px-6 py-2.5 rounded-full font-bold text-sm transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <FaPaperPlane size={12} />
                    <span>Send Message</span>
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
