const express = require('express');
const router = express.Router();
const {
  getAllArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle
} = require('../controllers/articleController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getAllArticles);
router.get('/:slug', getArticleBySlug);
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), createArticle);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), updateArticle);
router.delete('/:id', authMiddleware, adminMiddleware, deleteArticle);

module.exports = router;
