// backend/controllers/bannerController.js

const Banner = require('../models/Banner');
const { deleteImage, getPublicIdFromUrl } = require('../config/cloudinary');

// @desc    Get all banners
// @route   GET /api/banners
// @access  Public
exports.getAllBanners = async (req, res) => {
  try {
    const { position } = req.query;

    const filter = {};
    if (position) filter.position = position;

    const banners = await Banner.find(filter)
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners,
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des bannières',
      error: error.message,
    });
  }
};

// @desc    Get active banners
// @route   GET /api/banners/active
// @access  Public
exports.getActiveBanners = async (req, res) => {
  try {
    const { position } = req.query;

    const banners = await Banner.getActiveBanners(position);

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners,
    });
  } catch (error) {
    console.error('Error fetching active banners:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des bannières actives',
      error: error.message,
    });
  }
};

// @desc    Get banner by ID
// @route   GET /api/banners/:id
// @access  Private/Admin
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Bannière non trouvée',
      });
    }

    res.status(200).json({
      success: true,
      data: banner,
    });
  } catch (error) {
    console.error('Error fetching banner:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la bannière',
      error: error.message,
    });
  }
};

// @desc    Create banner
// @route   POST /api/banners
// @access  Private/Admin
exports.createBanner = async (req, res) => {
  try {
    const bannerData = { ...req.body };

    // Handle file upload
    if (req.file) {
      bannerData.image = `/uploads/banners/${req.file.filename}`;
    }

    const banner = await Banner.create(bannerData);

    res.status(201).json({
      success: true,
      message: 'Bannière créée avec succès',
      data: banner,
    });
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création de la bannière',
      error: error.message,
    });
  }
};

// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
exports.updateBanner = async (req, res) => {
  try {
    console.log('📝 Updating banner:', req.params.id);
    console.log('📦 Update data:', req.body);

    const updateData = { ...req.body };

    // Handle file upload
    if (req.file) {
      updateData.image = `/uploads/banners/${req.file.filename}`;
    }

    // Convert FormData string values to proper types
    if (updateData.isActive === 'true') updateData.isActive = true;
    if (updateData.isActive === 'false') updateData.isActive = false;
    if (updateData.order) updateData.order = parseInt(updateData.order, 10);

    // Find and update banner
    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Bannière non trouvée',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bannière mise à jour avec succès',
      data: banner,
    });
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la bannière',
      error: error.message,
    });
  }
};

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Bannière non trouvée',
      });
    }

    // Delete local image files
    const fs = require('fs');
    const path = require('path');

    if (banner.image && banner.image.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', banner.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    if (banner.mobileImage && banner.mobileImage.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', banner.mobileImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await banner.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Bannière supprimée avec succès',
    });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la bannière',
      error: error.message,
    });
  }
};

// @desc    Upload banner image
// @route   POST /api/banners/upload
// @access  Private/Admin
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucune image fournie',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image téléchargée avec succès',
      url: req.file.path,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du téléchargement de l\'image',
      error: error.message,
    });
  }
};

// @desc    Reorder banners
// @route   PUT /api/banners/reorder
// @access  Private/Admin
exports.reorderBanners = async (req, res) => {
  try {
    const { bannerIds } = req.body;

    if (!Array.isArray(bannerIds)) {
      return res.status(400).json({
        success: false,
        message: 'IDs invalides',
      });
    }

    // Update order for each banner
    const updatePromises = bannerIds.map((id, index) =>
      Banner.findByIdAndUpdate(id, { order: index })
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Ordre des bannières mis à jour',
    });
  } catch (error) {
    console.error('Error reordering banners:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la réorganisation',
      error: error.message,
    });
  }
};

// @desc    Increment banner clicks
// @route   POST /api/banners/:id/click
// @access  Public
exports.incrementClicks = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Bannière non trouvée',
      });
    }

    await banner.incrementClicks();

    res.status(200).json({
      success: true,
      message: 'Click enregistré',
    });
  } catch (error) {
    console.error('Error incrementing clicks:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement du click',
      error: error.message,
    });
  }
};
