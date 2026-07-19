const prisma = require('../config/db');

const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ message: 'Server error retrieving testimonials' });
  }
};

const createTestimonial = async (req, res) => {
  try {
    const { userName, userRole, rating, comment } = req.body;
    if (!userName || !rating || !comment) {
      return res.status(400).json({ message: 'Name, rating, and comment are required' });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        userName,
        userRole: userRole || 'Verified Customer',
        rating: parseInt(rating),
        comment
      }
    });

    res.status(201).json(testimonial);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ message: 'Server error saving testimonial' });
  }
};

module.exports = {
  getAllTestimonials,
  createTestimonial
};
