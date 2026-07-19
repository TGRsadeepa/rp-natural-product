const prisma = require('../config/db');

const getWishlist = async (req, res) => {
  try {
    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          include: {
            images: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Server error retrieving wishlist' });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const prodId = parseInt(productId);

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: prodId }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if item is already in wishlist
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: prodId
        }
      }
    });

    if (existing) {
      return res.status(400).json({ message: 'Product is already in wishlist' });
    }

    const item = await prisma.wishlistItem.create({
      data: {
        userId: req.user.id,
        productId: prodId
      },
      include: { product: { include: { images: true } } }
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Server error adding to wishlist' });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const prodId = parseInt(productId);

    await prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: prodId
        }
      }
    });

    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Server error removing from wishlist' });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
