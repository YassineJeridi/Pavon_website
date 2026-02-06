// backend/controllers/topBannerController.js
const TopBanner = require('../models/TopBanner');

// @desc    Get active top banner
// @route   GET /api/top-banner/active
// @access  Public
exports.getActiveBanner = async (req, res) => {
  try {
    const banner = await TopBanner.findOne({ isActive: true });
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Aucune bannière active trouvée',
      });
    }

    res.status(200).json({
      success: true,
      ...banner.toObject(),
    });
  } catch (error) {
    console.error('Error fetching active top banner:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la bannière',
      error: error.message,
    });
  }
};

// @desc    Get all top banners (Admin)
// @route   GET /api/top-banner
// @access  Private/Admin
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await TopBanner.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners,
    });
  } catch (error) {
    console.error('Error fetching top banners:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des bannières',
      error: error.message,
    });
  }
};

// @desc    Create top banner
// @route   POST /api/top-banner
// @access  Private/Admin
exports.createBanner = async (req, res) => {
  try {
    const banner = await TopBanner.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Bannière créée avec succès',
      data: banner,
    });
  } catch (error) {
    console.error('Error creating top banner:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création de la bannière',
      error: error.message,
    });
  }
};

// @desc    Update top banner
// @route   PUT /api/top-banner/:id
// @access  Private/Admin
exports.updateBanner = async (req, res) => {
  try {
    const banner = await TopBanner.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
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
    console.error('Error updating top banner:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la bannière',
      error: error.message,
    });
  }
};

// @desc    Delete top banner
// @route   DELETE /api/top-banner/:id
// @access  Private/Admin
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await TopBanner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Bannière non trouvée',
      });
    }

    await banner.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Bannière supprimée avec succès',
    });
  } catch (error) {
    console.error('Error deleting top banner:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la bannière',
      error: error.message,
    });
  }
};

// @desc    Toggle banner active status
// @route   PATCH /api/top-banner/:id/toggle
// @access  Private/Admin
exports.toggleActive = async (req, res) => {
  try {
    const banner = await TopBanner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Bannière non trouvée',
      });
    }

    banner.isActive = !banner.isActive;
    await banner.save();

    res.status(200).json({
      success: true,
      message: `Bannière ${banner.isActive ? 'activée' : 'désactivée'} avec succès`,
      data: banner,
    });
  } catch (error) {
    console.error('Error toggling banner status:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors du changement de statut',
      error: error.message,
    });
  }
};
