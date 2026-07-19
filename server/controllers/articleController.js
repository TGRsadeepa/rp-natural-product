const prisma = require('../config/db');

const getAllArticles = async (req, res) => {
  try {
    const { category } = req.query;
    const where = {};
    if (category) {
      where.category = category;
    }

    const articles = await prisma.article.findMany({
      where,
      orderBy: { publishedAt: 'desc' }
    });
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Server error retrieving articles' });
  }
};

const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await prisma.article.findUnique({
      where: { slug }
    });

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ message: 'Server error retrieving article' });
  }
};

const createArticle = async (req, res) => {
  try {
    const { title, category, content, author, readTime } = req.body;

    if (!title || !category || !content || !author || !readTime) {
      return res.status(400).json({ message: 'All article fields are required' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();

    // Use default placeholder or uploaded image
    let featuredImage = '/uploads/default-article.jpg';
    if (req.file) {
      featuredImage = `/uploads/${req.file.filename}`;
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        category,
        content,
        featuredImage,
        author,
        readTime,
        publishedAt: new Date()
      }
    });

    res.status(201).json(article);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ message: 'Server error creating article' });
  }
};

const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, content, author, readTime } = req.body;
    const parsedId = parseInt(id);

    const data = {};
    if (title) {
      data.title = title;
      data.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    }
    if (category) data.category = category;
    if (content) data.content = content;
    if (author) data.author = author;
    if (readTime) data.readTime = readTime;

    if (req.file) {
      data.featuredImage = `/uploads/${req.file.filename}`;
    }

    const article = await prisma.article.update({
      where: { id: parsedId },
      data
    });

    res.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ message: 'Server error updating article' });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.article.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ message: 'Server error deleting article' });
  }
};

module.exports = {
  getAllArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle
};
