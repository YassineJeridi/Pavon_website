// backend/controllers/categoryController.js
const Category = require('../models/Category');
const { deleteImage, getPublicIdFromUrl } = require('../config/cloudinary');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getAllCategories = async (req, res) => {
  try {
    console.log('🔍 CategoryController: getAllCategories called');

    // Handle both isActive and active fields
    const filter = {
      $or: [{ isActive: true }, { active: true }]
    };

    const categories = await Category.find(filter)
      .sort({ order: 1, name: 1 });

    console.log(`✅ Found ${categories.length} categories`);

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des catégories',
      error: error.message,
    });
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée',
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la catégorie',
      error: error.message,
    });
  }
};

// @desc    Get category by slug
// @route   GET /api/categories/slug/:slug
// @access  Public
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
      $or: [{ isActive: true }, { active: true }]
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée',
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la catégorie',
      error: error.message,
    });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
  try {
    const categoryData = { ...req.body };
    
    // Handle image upload
    if (req.file) {
      categoryData.image = `/uploads/categories/${req.file.filename}`;
    }

    const category = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      message: 'Catégorie créée avec succès',
      data: category,
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création de la catégorie',
      error: error.message,
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
  try {
    const existingCategory = await Category.findById(req.params.id);
    
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée',
      });
    }

    const updates = { ...req.body };
    
    // Handle new image upload
    if (req.file) {
      updates.image = `/uploads/categories/${req.file.filename}`;
      
      // Delete old image file if it exists
      if (existingCategory.image) {
        const path = require('path');
        const fs = require('fs');
        const oldImagePath = path.join(__dirname, '..', existingCategory.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Catégorie mise à jour avec succès',
      data: category,
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la catégorie',
      error: error.message,
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée',
      });
    }

    // Delete local image file if it exists
    if (category.image && !category.image.startsWith('http')) {
      const path = require('path');
      const fs = require('fs');
      const imagePath = path.join(__dirname, '..', category.image);
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
          console.log('✅ Deleted image file:', imagePath);
        } catch (err) {
          console.error('⚠️ Error deleting image file:', err);
        }
      }
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Catégorie supprimée avec succès',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la catégorie',
      error: error.message,
    });
  }
};

// @desc    Upload category image
// @route   POST /api/categories/upload
// @access  Private/Admin
exports.uploadImage = async (req, res) => {
  try {
    console.log('📤 Upload category image - file:', req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucune image fournie',
      });
    }

    // Use local storage path
    const imageUrl = `/uploads/categories/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Image téléchargée avec succès',
      url: imageUrl,
    });
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du téléchargement de l\'image',
      error: error.message,
    });
  }
};
