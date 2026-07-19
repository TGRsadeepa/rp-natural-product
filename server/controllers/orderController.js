const prisma = require('../config/db');

// Helper to generate a unique Sri Lankan tracking number
const generateTrackingNumber = () => {
  const chars = '0123456789';
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `RP-LK-${randomPart}`;
};

const createOrder = async (req, res) => {
  try {
    const { shippingAddress, contactPhone, paymentMethod } = req.body;

    if (!shippingAddress || !contactPhone || !paymentMethod) {
      return res.status(400).json({ message: 'Shipping address, phone, and payment method are required' });
    }

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    // Validate stock and calculate total
    let totalAmount = 0;
    const itemsToCreate = [];

    for (const item of cartItems) {
      if (item.product.stockStatus === 'OUT_OF_STOCK') {
        return res.status(400).json({ message: `Product ${item.product.name} is currently out of stock.` });
      }

      const price = item.product.price;
      const discount = item.product.discount || 0;
      const finalPrice = price - (price * (discount / 100));

      totalAmount += finalPrice * item.quantity;

      itemsToCreate.push({
        productId: item.productId,
        quantity: item.quantity,
        price: finalPrice
      });
    }

    // Create tracking number
    const trackingNumber = generateTrackingNumber();

    // Determine initial order status
    const orderStatus = paymentMethod === 'CARD' ? 'PAID' : 'PENDING';

    // Database transaction to create Order, OrderItems, Payments and clear Cart
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Order
      const order = await tx.order.create({
        data: {
          userId: req.user.id,
          status: orderStatus,
          totalAmount,
          trackingNumber,
          shippingAddress,
          contactPhone,
          items: {
            create: itemsToCreate
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      // 2. Create Payment
      await tx.payment.create({
        data: {
          orderId: order.id,
          method: paymentMethod,
          status: paymentMethod === 'CARD' ? 'COMPLETED' : 'PENDING',
          amount: totalAmount,
          transactionId: paymentMethod === 'CARD' ? `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}` : null
        }
      });

      // 3. Clear Cart
      await tx.cartItem.deleteMany({
        where: { userId: req.user.id }
      });

      return order;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Server error processing your order' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true
              }
            }
          }
        },
        payments: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              include: {
                images: true
              }
            }
          }
        },
        payments: true
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Auth check: Admin or the owner
    if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error retrieving order' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: true
          }
        },
        payments: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
      include: { payments: true }
    });

    // Automatically update payment status if order status is set to PAID / completed
    if (status === 'DELIVERED' || status === 'PAID') {
      const pendingPayment = order.payments.find(p => p.status === 'PENDING');
      if (pendingPayment) {
        await prisma.payment.update({
          where: { id: pendingPayment.id },
          data: { status: 'COMPLETED' }
        });
      }
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error updating order' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalSalesSum = await prisma.order.aggregate({
      where: {
        status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] }
      },
      _sum: {
        totalAmount: true
      }
    });

    const totalOrders = await prisma.order.count();
    const totalUsers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
    const totalProducts = await prisma.product.count();

    // Orders status count
    const pendingOrders = await prisma.order.count({ where: { status: 'PENDING' } });
    const paidOrders = await prisma.order.count({ where: { status: 'PAID' } });
    const shippedOrders = await prisma.order.count({ where: { status: 'SHIPPED' } });
    const deliveredOrders = await prisma.order.count({ where: { status: 'DELIVERED' } });
    const cancelledOrders = await prisma.order.count({ where: { status: 'CANCELLED' } });

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } }
      }
    });

    // Top selling products (simple calculation: group order items by product)
    const orderItems = await prisma.orderItem.findMany({
      include: {
        product: true
      }
    });

    const productSalesMap = {};
    orderItems.forEach(item => {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = {
          id: item.productId,
          name: item.product.name,
          price: item.product.price,
          salesQuantity: 0,
          revenue: 0
        };
      }
      productSalesMap[item.productId].salesQuantity += item.quantity;
      productSalesMap[item.productId].revenue += item.price * item.quantity;
    });

    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.salesQuantity - a.salesQuantity)
      .slice(0, 5);

    res.json({
      revenue: totalSalesSum._sum.totalAmount || 0,
      ordersCount: totalOrders,
      usersCount: totalUsers,
      productsCount: totalProducts,
      statusCounts: {
        PENDING: pendingOrders,
        PAID: paidOrders,
        SHIPPED: shippedOrders,
        DELIVERED: deliveredOrders,
        CANCELLED: cancelledOrders
      },
      recentOrders,
      topProducts
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error retrieving statistics' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats
};
