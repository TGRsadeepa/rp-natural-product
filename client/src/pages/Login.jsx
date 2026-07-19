import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaLock, FaLeaf } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || (user.role === 'ADMIN' ? '/admin' : '/profile');
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // redirect will happen via useEffect
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-cream/30 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-premium border border-dark-green/5 max-w-md w-full flex flex-col gap-6">
        
        {/* Header */}
        <div className="text-center flex flex-col gap-2">
          <div className="w-12 h-12 rounded-full bg-dark-green flex items-center justify-center text-cream mx-auto mb-2">
            <FaLeaf size={22} />
          </div>
          <h1 className="text-3xl font-bold font-heading text-dark-text">Welcome Back</h1>
          <p className="text-xs text-gray-500 font-light">Access your premium Ceylon wellness account</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-xs p-3 rounded-r-xl">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-cream/40 border border-dark-green/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-dark-green text-dark-text"
              />
              <FaUser className="absolute left-3.5 top-3 text-gray-400" size={12} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cream/40 border border-dark-green/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-dark-green text-dark-text"
              />
              <FaLock className="absolute left-3.5 top-3 text-gray-400" size={12} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-dark-green hover:bg-light-green text-cream py-2.5 rounded-full font-bold transition shadow-md disabled:bg-gray-300 disabled:text-gray-500"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Footer info */}
        <p className="text-xs text-gray-500 text-center font-light mt-2">
          New to RP Ceylon Natural?{' '}
          <Link to="/register" className="text-dark-green font-bold hover:underline">
            Create an Account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
