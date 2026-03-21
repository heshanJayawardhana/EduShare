const Order = require('../models/Order');
const Resource = require('../models/Resource');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Create order from cart checkout
const createOrder = async (req, res) => {
  try {
    const { items, totalPrice } = req.body;
    const userId = req.user.id;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in cart' });
    }

    // Verify all resources exist
    const resourceIds = items.map(item => item.resourceId);
    const resources = await Resource.find({ _id: { $in: resourceIds } });
    
    if (resources.length !== items.length) {
      return res.status(400).json({ error: 'Some resources not found' });
    }

    // Create order
    const order = new Order({
      userId,
      items: items.map(item => ({
        resourceId: item.resourceId,
        title: item.title,
        price: item.price || 0,
        currency: item.currency || 'LKR',
        isFree: item.isFree || false
      })),
      totalPrice: totalPrice || 0,
      currency: 'LKR',
      status: 'completed' // Auto-complete for demo (in real app, integrate with payment gateway)
    });

    await order.save();

    // Update resource download counts
    for (const item of items) {
      await Resource.findByIdAndUpdate(item.resourceId, {
        $inc: { downloads: 1 }
      });
    }

    // Update user stats
    const user = await User.findById(userId);
    if (user) {
      user.totalDownloads = (user.totalDownloads || 0) + items.length;
      await user.save();
    }

    // Create notification for user
    const userNotification = new Notification({
      userId,
      type: 'resource_approved',
      title: 'Order Completed',
      message: `Your order for ${items.length} resources has been completed. Resources added to your library.`,
      relatedId: order._id
    });
    await userNotification.save();

    // Notify resource uploaders
    const uploaderIds = [...new Set(resources.map(r => r.uploaderId.toString()))];
    for (const uploaderId of uploaderIds) {
      const uploaderNotification = new Notification({
        userId: uploaderId,
        type: 'resource_approved',
        title: 'Resource Downloaded',
        message: `Someone downloaded your resource(s) from the marketplace.`,
        relatedId: order._id
      });
      await uploaderNotification.save();
    }

    res.status(201).json({
      message: 'Order completed successfully',
      order,
      resourcesAdded: items.length
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const orders = await Order.find({ userId })
      .populate('items.resourceId', 'title thumbnail')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments({ userId });

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user library (downloaded resources)
const getUserLibrary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    // Get all completed orders and extract unique resource IDs
    const orders = await Order.find({ 
      userId, 
      status: 'completed' 
    }).distinct('items.resourceId');

    // Get resources details
    const resources = await Resource.find({ 
      _id: { $in: orders } 
    })
    .populate('uploaderId', 'name badge')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Resource.countDocuments({ 
      _id: { $in: orders } 
    });

    res.json({
      resources,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get user library error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all' } = req.query;
    
    let query = {};
    if (status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getUserLibrary,
  getAllOrders
};
