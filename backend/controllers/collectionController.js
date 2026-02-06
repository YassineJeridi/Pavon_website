// backend/controllers/collectionController.js
const Collection = require('../models/Collection');
const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');
const { deleteFile } = require('../config/multer');

// @desc Get all collections (admin)
exports.getAdminCollections = async (req, res) => {
  try {
    const collections = await Collection.find().sort({ order: 1, createdAt: -1 });
    const collectionsWithCount = await Promise.all(
      collections.map(async (collection) => {
        const productCount = await Product.countDocuments({ productCollection: collection._id });
        return { ...collection.toObject(), productCount };
      })
    );
    res.json({ success: true, data: collectionsWithCount });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// @desc Get collection products
exports.getCollectionProducts = async (req, res) => {
  try {
    const products = await Product.find({ productCollection: req.params.id })
      .populate('categories', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// @desc Create collection
exports.createCollection = async (req, res) => {
  try {
    const collectionData = { ...req.body };
    if (req.file) {
      collectionData.image = `/uploads/collections/${req.file.filename}`;
    }
    const collection = await Collection.create(collectionData);
    res.status(201).json({ success: true, data: collection });
  } catch (error) {
    if (req.file) deleteFile(req.file.path);
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc Update collection
exports.updateCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      if (req.file) deleteFile(req.file.path);
      return res.status(404).json({ success: false, error: 'Collection non trouvée' });
    }

    const updates = { ...req.body };
    if (req.file) {
      // Delete old image
      if (collection.image) {
        const oldPath = path.join(__dirname, '..', collection.image);
        deleteFile(oldPath);
      }
      updates.image = `/uploads/collections/${req.file.filename}`;
    }

    const updated = await Collection.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    if (req.file) deleteFile(req.file.path);
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc Delete collection
exports.deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).json({ success: false, error: 'Collection non trouvée' });

    const productCount = await Product.countDocuments({ productCollection: req.params.id });
    if (productCount > 0) {
      return res.status(400).json({ 
        success: false, 
        error: `${productCount} produit(s) associés. Dissociez-les d'abord.` 
      });
    }

    if (collection.image) {
      const imagePath = path.join(__dirname, '..', collection.image);
      deleteFile(imagePath);
    }

    await collection.deleteOne();
    res.json({ success: true, message: 'Collection supprimée' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// @desc Dissociate product from collection
exports.dissociateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      { productCollection: null },
      { new: true }
    );
    if (!product) return res.status(404).json({ success: false, error: 'Produit non trouvé' });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// Other exports (getFeaturedCollections, etc.) - keep existing code
exports.getAllCollections = async (req, res) => {
  try {
    const { limit } = req.query;
    
    // If limit is provided, return featured collections
    if (limit) {
      const featuredCollections = await Collection.find({ 
        isActive: true, 
        isFeatured: true 
      })
        .sort({ order: 1, createdAt: -1 })
        .limit(parseInt(limit));
      return res.json({ success: true, data: featuredCollections });
    }
    
    // Otherwise, return all active collections
    const collections = await Collection.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: collections });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

exports.toggleFeatured = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).json({ success: false, error: 'Collection non trouvée' });
    collection.isFeatured = !collection.isFeatured;
    await collection.save();
    res.json({ success: true, data: collection });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.toggleActive = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).json({ success: false, error: 'Collection non trouvée' });
    collection.isActive = !collection.isActive;
    await collection.save();
    res.json({ success: true, data: collection });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
