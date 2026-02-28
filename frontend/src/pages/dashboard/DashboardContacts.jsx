// frontend/src/pages/dashboard/DashboardContacts.jsx

import { useState, useEffect, useMemo } from 'react';
import contactService from '../../services/contactService';
import ContactStats from '../../components/dashboard/contacts/ContactStats';
import ContactFilters from '../../components/dashboard/contacts/ContactFilters';
import ContactList from '../../components/dashboard/contacts/ContactList';
import ContactDetail from '../../components/dashboard/contacts/ContactDetail';

const DashboardContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    document.title = 'Messages - Pavon Admin';
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAll();

      // Handle multiple response formats
      let contactsArray = [];
      if (Array.isArray(data)) {
        contactsArray = data;
      } else if (data.contacts && Array.isArray(data.contacts)) {
        contactsArray = data.contacts;
      } else if (data.data && Array.isArray(data.data)) {
        contactsArray = data.data;
      }

      setContacts(contactsArray);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search contacts
  const filteredContacts = useMemo(() => {
    let filtered = [...contacts];

    // Apply status filter
    if (filterStatus === 'unread') {
      filtered = filtered.filter(c => !c.read);
    } else if (filterStatus === 'read') {
      filtered = filtered.filter(c => c.read);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.message.toLowerCase().includes(query) ||
        (c.phone && c.phone.includes(query))
      );
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [contacts, searchQuery, filterStatus]);

  // Calculate stats
  const stats = useMemo(() => ({
    totalContacts: contacts.length,
    unreadCount: contacts.filter(c => !c.read).length,
    readCount: contacts.filter(c => c.read).length,
  }), [contacts]);

  const handleSelectContact = async (contact) => {
    setSelectedContact(contact);
    if (!contact.read) {
      try {
        await contactService.markAsRead(contact._id);
        setContacts(contacts.map(c =>
          c._id === contact._id ? { ...c, read: true } : c
        ));
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
  };

  const handleDelete = async (contactId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      return;
    }

    try {
      await contactService.deleteContact(contactId);
      setContacts(contacts.filter(c => c._id !== contactId));
      if (selectedContact?._id === contactId) {
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#5d1115] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages de contact</h1>
          <p className="text-gray-600 mt-2">
            Gérez et répondez aux messages de vos clients
          </p>
        </div>
      </div>

      {/* Stats */}
      <ContactStats
        totalContacts={stats.totalContacts}
        unreadCount={stats.unreadCount}
        readCount={stats.readCount}
      />

      {/* Filters */}
      <ContactFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Contact List */}
        <div className="lg:col-span-2">
          <ContactList
            contacts={filteredContacts}
            selectedContact={selectedContact}
            onSelectContact={handleSelectContact}
            formatDate={formatDate}
          />
        </div>

        {/* Contact Detail */}
        <div className="lg:col-span-3">
          <ContactDetail
            contact={selectedContact}
            onDelete={handleDelete}
            formatDate={formatDate}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardContacts;
