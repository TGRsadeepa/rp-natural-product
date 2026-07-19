import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartBar, FaBoxes, FaBook, FaList, FaShoppingCart, FaPlus, FaTrash, FaEdit, FaUpload } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const AdminDashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Navigation: 'stats' | 'products' | 'articles' | 'categories' | 'orders'
  const [activeTab, setActiveTab] = useState('stats');

  // States
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form States
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDiscount, setProductDiscount] = useState('');
  const [productStock, setProductStock] = useState('IN_STOCK');
  const [productIngredients, setProductIngredients] = useState('');
  const [productBenefits, setProductBenefits] = useState('');
  const [productUsage, setProductUsage] = useState('');
  const [productWarnings, setProductWarnings] = useState('');
  const [productCatId, setProductCatId] = useState('');
  const [productFiles, setProductFiles] = useState([]);

  // Category Form
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');

  // Article Form
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleCat, setArticleCat] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleAuthor, setArticleAuthor] = useState('');
  const [articleReadTime, setArticleReadTime] = useState('');
  const [articleFile, setArticleFile] = useState(null);

  // Redirect if not Admin
  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'ADMIN') {
        navigate('/');
      }
    }
  }, [user, authLoading, navigate]);

  // Load Dashboard Data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get('/orders/admin/stats');
      setStats(statsRes.data);

      const prodRes = await api.get('/products');
      setProducts(prodRes.data);

      const catRes = await api.get('/products/categories');
      setCategories(catRes.data);

      const artRes = await api.get('/articles');
      setArticles(artRes.data);

      const orderRes = await api.get('/orders/admin/all');
      setOrders(orderRes.data);
    } catch (error) {
      console.error('Error fetching admin dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      loadDashboardData();
    }
  }, [user]);

  if (authLoading || !user || user.role !== 'ADMIN') {
    return (
      <div className="pt-32 pb-20 text-center">
        <div className="w-12 h-12 border-4 border-dark-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 font-light">Loading administrator workspace...</p>
      </div>
    );
  }

  // --- HANDLERS ---

  // Order Status Update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      loadDashboardData();
      alert('Order status updated successfully.');
    } catch (error) {
      console.error('Error updating status', error);
      alert('Failed to update status.');
    }
  };

  // Product Actions
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productName || !productPrice || !productCatId) return alert('Please fill in required fields.');

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('description', productDesc);
    formData.append('price', productPrice);
    if (productDiscount) formData.append('discount', productDiscount);
    formData.append('stockStatus', productStock);
    formData.append('ingredients', productIngredients);
    formData.append('healthBenefits', productBenefits);
    formData.append('usageInstructions', productUsage);
    formData.append('warnings', productWarnings);
    formData.append('categoryId', productCatId);

    for (let i = 0; i < productFiles.length; i++) {
      formData.append('images', productFiles[i]);
    }

    try {
      if (editingProduct) {
        // Carry over old image IDs if we were editing and not overriding
        const keepIds = editingProduct.images?.map((img) => img.id).join(',') || '';
        formData.append('keepExistingImages', keepIds);

        await api.put(`/products/${editingProduct.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Product updated successfully!');
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Product created successfully!');
      }
      resetProductForm();
      loadDashboardData();
    } catch (error) {
      console.error('Error saving product', error);
      alert('Error saving product.');
    }
  };

  const handleEditProductClick = (prod) => {
    setEditingProduct(prod);
    setProductName(prod.name);
    setProductDesc(prod.description);
    setProductPrice(prod.price);
    setProductDiscount(prod.discount || '');
    setProductStock(prod.stockStatus);
    setProductIngredients(prod.ingredients || '');
    setProductBenefits(prod.healthBenefits || '');
    setProductUsage(prod.usageInstructions || '');
    setProductWarnings(prod.warnings || '');
    setProductCatId(prod.categoryId.toString());
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      loadDashboardData();
      alert('Product deleted successfully.');
    } catch (error) {
      console.error(error);
      alert('Failed to delete product.');
    }
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductName('');
    setProductDesc('');
    setProductPrice('');
    setProductDiscount('');
    setProductStock('IN_STOCK');
    setProductIngredients('');
    setProductBenefits('');
    setProductUsage('');
    setProductWarnings('');
    setProductCatId('');
    setProductFiles([]);
    setShowProductForm(false);
  };

  // Category Actions
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryName) return;

    try {
      if (editingCategory) {
        await api.put(`/products/categories/${editingCategory.id}`, { name: categoryName, description: categoryDesc });
      } else {
        await api.post('/products/categories', { name: categoryName, description: categoryDesc });
      }
      setCategoryName('');
      setCategoryDesc('');
      setEditingCategory(null);
      setShowCategoryForm(false);
      loadDashboardData();
      alert('Category saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Error saving category.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete category?')) return;
    try {
      await api.delete(`/products/categories/${id}`);
      loadDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting category.');
    }
  };

  // Article Actions
  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    if (!articleTitle || !articleContent) return;

    const formData = new FormData();
    formData.append('title', articleTitle);
    formData.append('category', articleCat || 'Wellness');
    formData.append('content', articleContent);
    formData.append('author', articleAuthor || 'RP Wellness Team');
    formData.append('readTime', articleReadTime || '5 min read');
    if (articleFile) {
      formData.append('image', articleFile);
    }

    try {
      if (editingArticle) {
        await api.put(`/articles/${editingArticle.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/articles', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      resetArticleForm();
      loadDashboardData();
      alert('Article saved successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  const resetArticleForm = () => {
    setEditingArticle(null);
    setArticleTitle('');
    setArticleCat('');
    setArticleContent('');
    setArticleAuthor('');
    setArticleReadTime('');
    setArticleFile(null);
    setShowArticleForm(false);
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await api.delete(`/articles/${id}`);
      loadDashboardData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-cream/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold font-heading text-dark-text">Admin Workspace</h1>
            <p className="text-sm text-gray-500 font-light mt-1">Manage inventories, articles, categories and orders.</p>
          </div>
          <button
            onClick={loadDashboardData}
            className="border-2 border-dark-green/20 hover:border-dark-green text-dark-green px-5 py-2 rounded-full font-bold text-xs transition"
          >
            Sync Data
          </button>
        </div>

        {/* Workspace Layout */}
        <div className="grid lg:grid-cols-5 gap-8">
          
          {/* Navigation Sidebar */}
          <div className="bg-white rounded-3xl p-6 border border-dark-green/5 shadow-premium flex flex-col gap-2 h-fit">
            {[
              { id: 'stats', label: 'Dashboard Stats', icon: <FaChartBar /> },
              { id: 'products', label: 'Products Manager', icon: <FaBoxes /> },
              { id: 'articles', label: 'Health Library CRUD', icon: <FaBook /> },
              { id: 'categories', label: 'Categories CRUD', icon: <FaList /> },
              { id: 'orders', label: 'Orders Tracker', icon: <FaShoppingCart /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left text-sm py-3.5 px-4 rounded-xl transition flex items-center gap-3 ${
                  activeTab === tab.id
                    ? 'bg-dark-green text-cream font-bold'
                    : 'hover:bg-cream text-dark-text'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Core Panel */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {loading ? (
              <div className="bg-white rounded-3xl h-96 animate-pulse p-10 text-center">Synchronizing database tables...</div>
            ) : (
              <>
                
                {/* 1. STATS TAB */}
                {activeTab === 'stats' && stats && (
                  <div className="flex flex-col gap-8">
                    
                    {/* Key Cards */}
                    <div className="grid sm:grid-cols-4 gap-6">
                      <div className="bg-white p-6 rounded-2xl border border-dark-green/5 shadow-premium">
                        <span className="text-xs text-gray-400 font-bold uppercase">Total Revenue</span>
                        <p className="text-2xl font-bold text-dark-green font-heading mt-2">Rs. {stats.revenue?.toLocaleString()}</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-dark-green/5 shadow-premium">
                        <span className="text-xs text-gray-400 font-bold uppercase">Total Orders</span>
                        <p className="text-2xl font-bold text-dark-text font-heading mt-2">{stats.ordersCount}</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-dark-green/5 shadow-premium">
                        <span className="text-xs text-gray-400 font-bold uppercase">Registered Users</span>
                        <p className="text-2xl font-bold text-dark-text font-heading mt-2">{stats.usersCount}</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-dark-green/5 shadow-premium">
                        <span className="text-xs text-gray-400 font-bold uppercase">Active Products</span>
                        <p className="text-2xl font-bold text-dark-text font-heading mt-2">{stats.productsCount}</p>
                      </div>
                    </div>

                    {/* Top Selling & Status counts */}
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="bg-white p-6 rounded-3xl border border-dark-green/5 shadow-premium">
                        <h3 className="text-lg font-bold font-heading text-dark-text border-b pb-3 mb-4">Top Selling Products</h3>
                        <div className="flex flex-col gap-4 text-sm font-light">
                          {stats.topProducts?.map((p, idx) => (
                            <div key={idx} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                              <span>{p.name} (x{p.salesQuantity})</span>
                              <span className="font-bold text-dark-green">Rs. {p.revenue.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-3xl border border-dark-green/5 shadow-premium">
                        <h3 className="text-lg font-bold font-heading text-dark-text border-b pb-3 mb-4">Orders Distribution</h3>
                        <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                          <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl text-orange-700">Pending: {stats.statusCounts?.PENDING}</div>
                          <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-green-700">Paid: {stats.statusCounts?.PAID}</div>
                          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-700">Shipped: {stats.statusCounts?.SHIPPED}</div>
                          <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl text-purple-700">Delivered: {stats.statusCounts?.DELIVERED}</div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* 2. PRODUCTS TAB */}
                {activeTab === 'products' && (
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold font-heading text-dark-text">Product Management</h2>
                      <button
                        onClick={() => { resetProductForm(); setShowProductForm(true); }}
                        className="bg-dark-green hover:bg-light-green text-cream px-5 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow"
                      >
                        <FaPlus size={10} /> Add Product
                      </button>
                    </div>

                    {showProductForm && (
                      <form onSubmit={handleProductSubmit} className="bg-white border rounded-3xl p-6 shadow-premium flex flex-col gap-4">
                        <h3 className="text-lg font-bold text-dark-text font-heading">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500">Product Name *</label>
                            <input type="text" required value={productName} onChange={(e) => setProductName(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-dark-green text-dark-text" />
                          </div>
                          
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500">Category *</label>
                            <select required value={productCatId} onChange={(e) => setProductCatId(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-dark-green text-dark-text">
                              <option value="">Select Category</option>
                              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500">Price (Rs.) *</label>
                            <input type="number" required value={productPrice} onChange={(e) => setProductPrice(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-dark-green text-dark-text" />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500">Discount (%)</label>
                            <input type="number" value={productDiscount} onChange={(e) => setProductDiscount(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-dark-green text-dark-text" />
                          </div>

                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="text-xs font-bold text-gray-500">Description *</label>
                            <textarea rows="3" required value={productDesc} onChange={(e) => setProductDesc(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-dark-green text-dark-text"></textarea>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500">Stock Status</label>
                            <select value={productStock} onChange={(e) => setProductStock(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-dark-green text-dark-text">
                              <option value="IN_STOCK">In Stock</option>
                              <option value="LOW_STOCK">Low Stock</option>
                              <option value="OUT_OF_STOCK">Out of Stock</option>
                            </select>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500">Ingredients</label>
                            <input type="text" value={productIngredients} onChange={(e) => setProductIngredients(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-dark-green text-dark-text" />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500">Health Benefits</label>
                            <input type="text" value={productBenefits} onChange={(e) => setProductBenefits(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-dark-green text-dark-text" />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500">Usage Instructions</label>
                            <input type="text" value={productUsage} onChange={(e) => setProductUsage(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-dark-green text-dark-text" />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500">Warnings</label>
                            <input type="text" value={productWarnings} onChange={(e) => setProductWarnings(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-dark-green text-dark-text" />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500">Upload Product Images</label>
                            <input type="file" multiple onChange={(e) => setProductFiles(e.target.files)} className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-cream file:text-dark-green hover:file:bg-cream/80" />
                          </div>
                        </div>

                        <div className="flex gap-3 justify-end mt-4">
                          <button type="button" onClick={resetProductForm} className="border px-5 py-2.5 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-50 transition">Cancel</button>
                          <button type="submit" className="bg-dark-green hover:bg-light-green text-cream px-5 py-2.5 rounded-full text-xs font-bold transition">Save Product</button>
                        </div>
                      </form>
                    )}

                    {/* Products list table */}
                    <div className="bg-white border rounded-3xl overflow-hidden shadow-premium">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-cream/40 border-b border-dark-green/5 text-xs uppercase font-bold text-gray-500">
                            <th className="p-4">Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-light text-gray-600">
                          {products.map((prod) => (
                            <tr key={prod.id} className="hover:bg-cream/10 transition">
                              <td className="p-4 font-bold text-dark-text">{prod.name}</td>
                              <td className="p-4">{prod.category?.name || 'Unassigned'}</td>
                              <td className="p-4">Rs. {prod.price}</td>
                              <td className="p-4">
                                <span className={`font-bold ${
                                  prod.stockStatus === 'IN_STOCK' ? 'text-green-600' : 'text-red-500'
                                }`}>{prod.stockStatus}</span>
                              </td>
                              <td className="p-4 flex gap-3 text-gray-400">
                                <button onClick={() => handleEditProductClick(prod)} className="hover:text-dark-green transition"><FaEdit size={14} /></button>
                                <button onClick={() => handleDeleteProduct(prod.id)} className="hover:text-red-500 transition"><FaTrash size={14} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </div>
                )}

                {/* 3. ARTICLES TAB */}
                {activeTab === 'articles' && (
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold font-heading text-dark-text">Ayurvedic Health Library Manager</h2>
                      <button
                        onClick={() => { resetArticleForm(); setShowArticleForm(true); }}
                        className="bg-dark-green hover:bg-light-green text-cream px-5 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow"
                      >
                        <FaPlus size={10} /> Publish Article
                      </button>
                    </div>

                    {showArticleForm && (
                      <form onSubmit={handleArticleSubmit} className="bg-white border rounded-3xl p-6 shadow-premium flex flex-col gap-4">
                        <h3 className="text-lg font-bold text-dark-text font-heading">Publish Article</h3>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500">Article Title *</label>
                            <input type="text" required value={articleTitle} onChange={(e) => setArticleTitle(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-dark-green text-dark-text" />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500">Category Tag (e.g. Immunity Boost) *</label>
                            <input type="text" required value={articleCat} onChange={(e) => setArticleCat(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-dark-green text-dark-text" />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500">Author Name *</label>
                            <input type="text" required value={articleAuthor} onChange={(e) => setArticleAuthor(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-dark-green text-dark-text" />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500">Reading Time (e.g. 5 min read) *</label>
                            <input type="text" required value={articleReadTime} onChange={(e) => setArticleReadTime(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-dark-green text-dark-text" />
                          </div>

                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="text-xs font-bold text-gray-500">Full Content *</label>
                            <textarea rows="8" required value={articleContent} onChange={(e) => setArticleContent(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-dark-green text-dark-text"></textarea>
                          </div>

                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="text-xs font-bold text-gray-500">Featured Image File</label>
                            <input type="file" onChange={(e) => setArticleFile(e.target.files[0])} className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-cream file:text-dark-green hover:file:bg-cream/80" />
                          </div>
                        </div>

                        <div className="flex gap-3 justify-end mt-4">
                          <button type="button" onClick={resetArticleForm} className="border px-5 py-2.5 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-50 transition">Cancel</button>
                          <button type="submit" className="bg-dark-green hover:bg-light-green text-cream px-5 py-2.5 rounded-full text-xs font-bold transition">Publish</button>
                        </div>
                      </form>
                    )}

                    {/* Articles list */}
                    <div className="bg-white border rounded-3xl overflow-hidden shadow-premium">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-cream/40 border-b border-dark-green/5 text-xs uppercase font-bold text-gray-500">
                            <th className="p-4">Title</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Author</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-light text-gray-600">
                          {articles.map((art) => (
                            <tr key={art.id} className="hover:bg-cream/10 transition">
                              <td className="p-4 font-bold text-dark-text line-clamp-1 max-w-[200px]">{art.title}</td>
                              <td className="p-4">{art.category}</td>
                              <td className="p-4">{art.author}</td>
                              <td className="p-4">{new Date(art.publishedAt).toLocaleDateString()}</td>
                              <td className="p-4 flex gap-3 text-gray-400">
                                <button onClick={() => handleDeleteArticle(art.id)} className="hover:text-red-500 transition"><FaTrash size={14} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </div>
                )}

                {/* 4. CATEGORIES TAB */}
                {activeTab === 'categories' && (
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold font-heading text-dark-text">Product Categories Manager</h2>
                      <button
                        onClick={() => { setEditingCategory(null); setCategoryName(''); setCategoryDesc(''); setShowCategoryForm(true); }}
                        className="bg-dark-green hover:bg-light-green text-cream px-5 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow"
                      >
                        <FaPlus size={10} /> Add Category
                      </button>
                    </div>

                    {showCategoryForm && (
                      <form onSubmit={handleCategorySubmit} className="bg-white border rounded-3xl p-6 shadow-premium flex flex-col gap-4 max-w-md">
                        <h3 className="text-lg font-bold text-dark-text font-heading">Add Category</h3>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-500">Category Name *</label>
                          <input type="text" required value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-dark-green text-dark-text" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-500">Description</label>
                          <textarea value={categoryDesc} onChange={(e) => setCategoryDesc(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-dark-green text-dark-text"></textarea>
                        </div>
                        <div className="flex gap-3 justify-end mt-2">
                          <button type="button" onClick={() => setShowCategoryForm(false)} className="border px-5 py-2 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-50 transition">Cancel</button>
                          <button type="submit" className="bg-dark-green hover:bg-light-green text-cream px-5 py-2 rounded-full text-xs font-bold transition">Save</button>
                        </div>
                      </form>
                    )}

                    {/* Categories list */}
                    <div className="bg-white border rounded-3xl overflow-hidden shadow-premium">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-cream/40 border-b border-dark-green/5 text-xs uppercase font-bold text-gray-500">
                            <th className="p-4">Name</th>
                            <th className="p-4">Products count</th>
                            <th className="p-4">Description</th>
                            <th className="p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-light text-gray-600">
                          {categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-cream/10 transition">
                              <td className="p-4 font-bold text-dark-text">{cat.name}</td>
                              <td className="p-4">{cat._count?.products || 0} Products</td>
                              <td className="p-4 max-w-[200px] truncate">{cat.description || 'N/A'}</td>
                              <td className="p-4 flex gap-3 text-gray-400">
                                <button onClick={() => handleDeleteCategory(cat.id)} className="hover:text-red-500 transition"><FaTrash size={14} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </div>
                )}

                {/* 5. ORDERS TAB */}
                {activeTab === 'orders' && (
                  <div className="flex flex-col gap-6">
                    <h2 className="text-2xl font-bold font-heading text-dark-text border-b border-dark-green/10 pb-3">Client Orders Tracker</h2>
                    
                    <div className="bg-white border rounded-3xl overflow-hidden shadow-premium">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-cream/40 border-b border-dark-green/5 text-xs uppercase font-bold text-gray-500">
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Client</th>
                            <th className="p-4">Tracking Number</th>
                            <th className="p-4">Total Amount</th>
                            <th className="p-4">Current Status</th>
                            <th className="p-4">Modify Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-light text-gray-600">
                          {orders.map((ord) => (
                            <tr key={ord.id} className="hover:bg-cream/10 transition">
                              <td className="p-4 font-bold text-dark-text">#{ord.id}</td>
                              <td className="p-4">
                                <p className="font-medium text-dark-text">{ord.user?.name}</p>
                                <p className="text-[10px] text-gray-400">{ord.user?.email}</p>
                              </td>
                              <td className="p-4 font-semibold text-dark-green">{ord.trackingNumber || 'N/A'}</td>
                              <td className="p-4">Rs. {ord.totalAmount.toLocaleString()}</td>
                              <td className="p-4">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                  ord.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                  ord.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                                  ord.status === 'PAID' ? 'bg-green-50 text-green-600 border border-green-200' :
                                  ord.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                }`}>
                                  {ord.status}
                                </span>
                              </td>
                              <td className="p-4">
                                <select
                                  value={ord.status}
                                  onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                  className="bg-cream/50 border border-dark-green/15 text-xs font-bold rounded-lg px-2 py-1 text-dark-text focus:outline-none"
                                >
                                  <option value="PENDING">PENDING</option>
                                  <option value="PAID">PAID</option>
                                  <option value="SHIPPED">SHIPPED</option>
                                  <option value="DELIVERED">DELIVERED</option>
                                  <option value="CANCELLED">CANCELLED</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </div>
                )}

              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
