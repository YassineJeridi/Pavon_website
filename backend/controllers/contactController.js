// backend/controllers/contactController.js

const Contact = require('../models/Contact');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Message envoyé avec succès',
      data: contact,
    });
  } catch (error) {
    console.error('Error submitting contact:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message',
      error: error.message,
    });
  }
};

// @desc    Get all contacts
// @route   GET /api/contact
// @access  Private/Admin
exports.getAllContacts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      read,
      priority,
    } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (read !== undefined) filter.read = read === 'true';
    if (priority) filter.priority = priority;

    const skip = (page - 1) * limit;

    const contacts = await Contact.find(filter)
      .populate('repliedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Contact.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: contacts,
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des messages',
      error: error.message,
    });
  }
};

// @desc    Get contact by ID
// @route   GET /api/contact/:id
// @access  Private/Admin
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('repliedBy', 'firstName lastName email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé',
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du message',
      error: error.message,
    });
  }
};

// @desc    Mark contact as read
// @route   PATCH /api/contact/:id/read
// @access  Private/Admin
exports.markAsRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message marqué comme lu',
      data: contact,
    });
  } catch (error) {
    console.error('Error marking as read:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      error: error.message,
    });
  }
};

// @desc    Reply to contact
// @route   POST /api/contact/:id/reply
// @access  Private/Admin
exports.replyToContact = async (req, res) => {
  try {
    const { replyMessage } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé',
      });
    }

    contact.replied = true;
    contact.replyMessage = replyMessage;
    contact.repliedBy = req.admin._id; // Assuming admin is attached by auth middleware
    contact.status = 'resolved';

    await contact.save();

    // TODO: Send email reply to customer

    res.status(200).json({
      success: true,
      message: 'Réponse envoyée avec succès',
      data: contact,
    });
  } catch (error) {
    console.error('Error replying to contact:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de l\'envoi de la réponse',
      error: error.message,
    });
  }
};

// @desc    Update contact
// @route   PUT /api/contact/:id
// @access  Private/Admin
exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message mis à jour avec succès',
      data: contact,
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      error: error.message,
    });
  }
};

// @desc    Delete contact
// @route   DELETE /api/contact/:id
// @access  Private/Admin
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé',
      });
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message supprimé avec succès',
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message,
    });
  }
};
