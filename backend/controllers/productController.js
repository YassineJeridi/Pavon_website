// backend/controllers/productController.js

const Product = require('../models/Product');
const Category = require('../models/Category');
const Collection = require('../models/Collection');
const { deleteImage, getPublicIdFromUrl } = require('../config/cloudinary');

// @desc Get all products
// @route GET /api/products
// @access Public
exports.getAllProducts = async (req, res) => {
  try {
    console.log('🔍 ProductController: getAllProducts called');
    const {
      page = 1,
      limit = 12,
      sort = '-createdAt',
      category,
      collection,
      minPrice,
      maxPrice,
      sizes,
      numericSizes,
      colors,
      search,
      featured,
      bestseller,
    } = req.query;

    // Build filter object
    const filter = {};

    // Handle both isActive and active fields
    // Support 'all' parameter to show all products (for dashboard)
    if (req.query.all === 'true') {
      // Don't filter by isActive - show all products
    } else if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    } else if (req.query.active !== undefined) {
      filter.active = req.query.active === 'true';
    } else {
      // Default: show active products (handles both field names)
      filter.$or = [{ isActive: true }, { active: true }];
    }

    // ✅ FIXED: categories (plural, array) - use $in with OR logic
    if (category) {
      const categoryArray = category.split(',');
      filter.categories = { $in: categoryArray };
    }

    // ✅ FIXED: productCollection (renamed from collection) - use $in with OR logic
    if (collection) {
      const collectionArray = collection.split(',');
      filter.productCollection = { $in: collectionArray };
    }

    if (featured === 'true') filter.featured = true;
    if (bestseller === 'true') filter.bestseller = true;

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Size filter
    if (sizes) {
      const sizeArray = sizes.split(',');
      filter.sizes = { $in: sizeArray };
    }

    // Numeric sizes filter
    if (numericSizes) {
      const numericSizeArray = numericSizes.split(',');
      if (!filter.sizes) {
        filter.sizes = { $in: numericSizeArray };
      } else {
        // Combine both regular and numeric sizes with OR logic
        filter.$or = [
          { sizes: { $in: sizeArray } },
          { sizes: { $in: numericSizeArray } }
        ];
      }
    }

    // Color filter
    if (colors) {
      const colorArray = colors.split(',');
      filter.colors = { $in: colorArray };
    }

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    console.log('🔍 Filter:', JSON.stringify(filter, null, 2));

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // ✅ FIXED: Execute query with correct field names
    const products = await Product.find(filter)
      .populate('categories', 'name slug')
      .populate('productCollection', 'name slug')  // ✅ Changed
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const total = await Product.countDocuments(filter);

    console.log(`✅ Found ${products.length} products out of ${total} total`);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: products,
    });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des produits',
      error: error.message,
    });
  }
};

// @desc Get single product by ID
// @route GET /api/products/:id
// @access Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categories', 'name slug')
      .populate('productCollection', 'name slug');  // ✅ Changed

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du produit',
      error: error.message,
    });
  }
};

// @desc Get product by slug
// @route GET /api/products/slug/:slug
// @access Public
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      $or: [{ isActive: true }, { active: true }]
    })
      .populate('categories', 'name slug')
      .populate('productCollection', 'name slug');  // ✅ Changed

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du produit',
      error: error.message,
    });
  }
};

// @desc Get featured products
// @route GET /api/products/featured
// @access Public
exports.getFeaturedProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;

    const products = await Product.find({
      featured: true,
      $or: [{ isActive: true }, { active: true }]
    })
      .populate('categories', 'name slug')
      .populate('productCollection', 'name slug')  // ✅ Changed
      .sort('-createdAt')
      .limit(limit);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des produits vedettes',
      error: error.message,
    });
  }
};

// @desc Get bestseller products
// @route GET /api/products/bestsellers
// @access Public
exports.getBestsellers = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;

    const products = await Product.find({
      bestseller: true,
      $or: [{ isActive: true }, { active: true }]
    })
      .populate('categories', 'name slug')
      .populate('productCollection', 'name slug')  // ✅ Changed
      .sort('-soldCount')
      .limit(limit);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching bestsellers:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des meilleures ventes',
      error: error.message,
    });
  }
};

// @desc Search products
// @route GET /api/products/search
// @access Public
exports.searchProducts = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Le terme de recherche est requis',
      });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
      ],
      $and: [{ $or: [{ isActive: true }, { active: true }] }]
    })
      .populate('categories', 'name slug')
      .populate('productCollection', 'name slug')  // ✅ Changed
      .limit(Number(limit))
      .select('name slug price images categories');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche',
      error: error.message,
    });
  }
};

// @desc Create new product
// @route POST /api/products
// @access Private/Admin
exports.createProduct = async (req, res) => {
  try {
    console.log('📦 CREATE PRODUCT - Request received');
    console.log('📦 Body keys:', Object.keys(req.body));
    console.log('📦 Files:', req.files ? req.files.length : 0);

    // Handle uploaded images
    const productData = { ...req.body };

    // Parse JSON fields if they're strings (from FormData)
    if (typeof productData.categories === 'string') {
      productData.categories = JSON.parse(productData.categories);
    }
    if (typeof productData.colors === 'string') {
      productData.colors = JSON.parse(productData.colors);
    }
    if (typeof productData.sizes === 'string') {
      productData.sizes = JSON.parse(productData.sizes);
    }
    if (typeof productData.promoTag === 'string') {
      productData.promoTag = JSON.parse(productData.promoTag);
    }
    if (typeof productData.featured === 'string') {
      productData.featured = productData.featured === 'true';
    }
    if (typeof productData.bestseller === 'string') {
      productData.bestseller = productData.bestseller === 'true';
    }

    console.log('📦 Parsed data:', {
      name: productData.name,
      categories: productData.categories,
      colors: productData.colors,
      sizes: productData.sizes,
    });

    // ✅ Validate sizes - ensure they're all letter OR all numeric
    if (productData.sizes && productData.sizes.length > 0) {
      const letterSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];
      const numericSizes = ['32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54'];
      
      const hasLetterSizes = productData.sizes.some(size => letterSizes.includes(size));
      const hasNumericSizes = productData.sizes.some(size => numericSizes.includes(size));
      
      if (hasLetterSizes && hasNumericSizes) {
        return res.status(400).json({
          success: false,
          message: 'Les tailles doivent être soit des tailles lettres (XS, S, M...) soit des tailles numériques (32, 34, 36...), pas les deux.',
        });
      }
    }

    // Add uploaded image URLs if any
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => `/uploads/products/${file.filename}`);
      console.log('📦 Image URLs:', productData.images);
    } else {
      console.log('⚠️ No files uploaded');
    }

    console.log('📦 Creating product in database...');
    const product = await Product.create(productData);
    console.log('✅ Product created:', product._id);

    const populatedProduct = await Product.findById(product._id)
      .populate('categories', 'name slug')
      .populate('productCollection', 'name slug');

    console.log('✅ Sending response');
    res.status(201).json({
      success: true,
      message: 'Produit créé avec succès',
      data: populatedProduct,
    });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création du produit',
      error: error.message,
    });
  }
};

// @desc Update product
// @route PUT /api/products/:id
// @access Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    // Parse JSON fields if they're strings (from FormData)
    if (typeof productData.categories === 'string') {
      productData.categories = JSON.parse(productData.categories);
    }
    if (typeof productData.colors === 'string') {
      productData.colors = JSON.parse(productData.colors);
    }
    if (typeof productData.sizes === 'string') {
      productData.sizes = JSON.parse(productData.sizes);
    }
    if (typeof productData.promoTag === 'string') {
      productData.promoTag = JSON.parse(productData.promoTag);
    }
    if (typeof productData.images === 'string') {
      productData.images = JSON.parse(productData.images);
    }
    if (typeof productData.featured === 'string') {
      productData.featured = productData.featured === 'true';
    }
    if (typeof productData.bestseller === 'string') {
      productData.bestseller = productData.bestseller === 'true';
    }
    // ✅ Validate sizes - ensure they're all letter OR all numeric
    if (productData.sizes && productData.sizes.length > 0) {
      const letterSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];
      const numericSizes = ['32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54'];
      
      const hasLetterSizes = productData.sizes.some(size => letterSizes.includes(size));
      const hasNumericSizes = productData.sizes.some(size => numericSizes.includes(size));
      
      if (hasLetterSizes && hasNumericSizes) {
        return res.status(400).json({
          success: false,
          message: 'Les tailles doivent être soit des tailles lettres (XS, S, M...) soit des tailles numériques (32, 34, 36...), pas les deux.',
        });
      }
    }
    // Add new uploaded images if any
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/products/${file.filename}`);
      productData.images = [...(productData.images || []), ...newImages];
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('categories', 'name slug')
      .populate('productCollection', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Produit mis à jour avec succès',
      data: product,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour du produit',
      error: error.message,
    });
  }
};

// @desc Delete product
// @route DELETE /api/products/:id
// @access Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé',
      });
    }

    // Delete images from Cloudinary (with error handling)
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        try {
          const publicId = getPublicIdFromUrl(imageUrl);
          if (publicId) {
            await deleteImage(publicId);
          }
        } catch (cloudinaryError) {
          console.warn('⚠️ Cloudinary deletion failed:', cloudinaryError.message);
        }
      }
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Produit supprimé avec succès',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du produit',
      error: error.message,
    });
  }
};

// @desc Upload product images
// @route POST /api/products/upload
// @access Private/Admin
exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucune image fournie',
      });
    }

    const imageUrls = req.files.map((file) => `/uploads/products/${file.filename}`);

    res.status(200).json({
      success: true,
      message: 'Images téléchargées avec succès',
      data: imageUrls,
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du téléchargement des images',
      error: error.message,
    });
  }
};
// @desc Toggle bestseller status
// @route PATCH /api/products/:id/bestseller
// @access Private/Admin
exports.toggleBestseller = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé',
      });
    }

    product.bestseller = !product.bestseller;
    await product.save({ validateModifiedOnly: true });

    res.status(200).json({
      success: true,
      data: product,
      message: `Produit ${product.bestseller ? 'ajouté aux' : 'retiré des'} meilleures ventes`,
    });
  } catch (error) {
    console.error('Error toggling bestseller:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      error: error.message,
    });
  }
};

// @desc Toggle active status (visibility)
// @route PATCH /api/products/:id/active
// @access Private/Admin
exports.toggleActive = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé',
      });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Produit ${product.isActive ? 'activé' : 'désactivé'}`,
      data: product,
    });
  } catch (error) {
    console.error('Error toggling active:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      error: error.message,
    });
  }
};

// @desc Toggle featured status
// @route PATCH /api/products/:id/featured
// @access Private/Admin
exports.toggleFeatured = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé',
      });
    }

    product.featured = !product.featured;
    await product.save({ validateModifiedOnly: true });

    res.status(200).json({
      success: true,
      data: product,
      message: `Produit ${product.featured ? 'ajouté aux' : 'retiré des'} produits vedettes`,
    });
  } catch (error) {
    console.error('Error toggling featured:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      error: error.message,
    });
  }
};
// @desc Get product recommendations
// @route GET /api/products/:id/recommendations
// @access Public
exports.getRecommendations = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé',
      });
    }

    // ✅ FIXED: Get recommendations based on same categories
    const recommendations = await Product.find({
      _id: { $ne: product._id },
      categories: { $in: product.categories },
      $or: [{ isActive: true }, { active: true }]
    })
      .populate('categories', 'name slug')
      .populate('productCollection', 'name slug')  // ✅ Changed
      .limit(8)
      .sort('-soldCount');

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des recommandations',
      error: error.message,
    });
  }
};
