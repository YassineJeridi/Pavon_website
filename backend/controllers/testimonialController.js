// backend/controllers/testimonialController.js
const Testimonial = require('../models/Testimonial');

// @desc    Get all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const { page = 1, limit = 10, product } = req.query;

    // Filter
    const filter = { isActive: true };
    if (product) filter.product = product;

    const skip = (page - 1) * limit;

    const testimonials = await Testimonial.find(filter)
      .populate('product', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Testimonial.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: testimonials.length,
      total,
      data: testimonials,
    });
  } catch (error) {
    console.error('❌ Error fetching testimonials:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create testimonial
exports.createTestimonial = async (req, res) => {
  try {
    // 1. Map frontend fields to backend model fields
    const data = {
      name: req.body.name || req.body.customerName, // Accept either
      rating: Number(req.body.rating),              // Ensure number
      comment: req.body.comment,
      isFeatured: req.body.isFeatured || req.body.featured || false, // Accept either
      isActive: true
    };

    // 2. Handle avatar upload if present
    if (req.file) {
      data.avatar = `/uploads/testimonials/${req.file.filename}`;
    }

    // 3. Validate required fields manually to be sure
    if (!data.name) return res.status(400).json({ success: false, message: "Le nom est requis" });
    if (!data.comment) return res.status(400).json({ success: false, message: "Le commentaire est requis" });

    // 4. Create
    const testimonial = await Testimonial.create(data);

    res.status(201).json({
      success: true,
      message: 'Témoignage créé avec succès',
      data: testimonial,
    });
  } catch (error) {
    console.error('❌ Error creating testimonial:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update testimonial
exports.updateTestimonial = async (req, res) => {
  try {
    // Map fields
    const updateData = {};
    if (req.body.customerName) updateData.name = req.body.customerName;
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.comment) updateData.comment = req.body.comment;
    if (req.body.rating) updateData.rating = Number(req.body.rating);
    if (req.body.featured !== undefined) updateData.isFeatured = req.body.featured;
    if (req.body.isFeatured !== undefined) updateData.isFeatured = req.body.isFeatured;

    // Handle avatar upload if present
    if (req.file) {
      updateData.avatar = `/uploads/testimonials/${req.file.filename}`;
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Témoignage non trouvé' });
    }

    res.status(200).json({
      success: true,
      message: 'Témoignage mis à jour',
      data: testimonial,
    });
  } catch (error) {
    console.error('Error updating:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: 'Non trouvé' });

    await testimonial.deleteOne();
    res.status(200).json({ success: true, message: 'Supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle featured
exports.toggleFeatured = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: 'Non trouvé' });

    testimonial.isFeatured = !testimonial.isFeatured;
    await testimonial.save();

    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Exports needed for router
exports.getTestimonialById = async (req, res) => {
  const t = await Testimonial.findById(req.params.id);
  if (!t) return res.status(404).json({ success: false });
  res.json({ success: true, data: t });
};
exports.getFeaturedTestimonials = async (req, res) => {
  const t = await Testimonial.find({ isFeatured: true, isActive: true }).limit(10);
  res.json({ success: true, data: t });
};
