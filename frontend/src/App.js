import React, { useState, useEffect } from 'react';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import Toast from './components/Toast';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [viewingContact, setViewingContact] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  // Fetch contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/contacts`);
      const result = await response.json();
      if (result.success) {
        setContacts(result.data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      showToast('Failed to load contacts', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleContactSubmit = async (contactData) => {
    try {
      const isEditing = editingContact !== null;
      const url = isEditing 
        ? `${API_URL}/contacts/${editingContact._id}`
        : `${API_URL}/contacts`;
      
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      const result = await response.json();

      if (result.success) {
        if (isEditing) {
          setContacts(contacts.map(c => 
            c._id === editingContact._id ? result.data : c
          ));
          showToast('Contact updated successfully! 🎉', 'success');
          setEditingContact(null);
        } else {
          setContacts([result.data, ...contacts]);
          showToast('Contact added successfully! ✨', 'success');
        }
        return { success: true };
      } else {
        return { success: false, errors: result.errors || [result.message] };
      }
    } catch (error) {
      console.error('Error submitting contact:', error);
      showToast('Failed to submit contact', 'error');
      return { success: false, errors: ['Failed to submit contact. Please try again.'] };
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      const response = await fetch(`${API_URL}/contacts/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setContacts(contacts.filter(contact => contact._id !== id));
        showToast('Contact deleted successfully! 🗑️', 'success');
        if (editingContact && editingContact._id === id) {
          setEditingContact(null);
        }
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      showToast('Failed to delete contact', 'error');
    }
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingContact(null);
  };

  const handleToggleFavorite = async (id) => {
    try {
      const response = await fetch(`${API_URL}/contacts/${id}/favorite`, {
        method: 'PATCH',
      });

      const result = await response.json();

      if (result.success) {
        setContacts(contacts.map(c => 
          c._id === id ? result.data : c
        ));
        showToast(result.data.isFavorite ? 'Added to favorites! ⭐' : 'Removed from favorites', 'success');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showToast('Failed to update favorite', 'error');
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(contacts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contacts_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Contacts exported successfully! 📥', 'success');
  };

  const handleViewContact = (contact) => {
    setViewingContact(contact);
  };

  const handleCloseModal = () => {
    setViewingContact(null);
  };

  const handleCopyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      showToast(`${field} copied to clipboard! 📋`, 'success');
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  const getStatistics = () => {
    const total = contacts.length;
    const favorites = contacts.filter(c => c.isFavorite).length;
    const withMessages = contacts.filter(c => c.message).length;
    const today = new Date().toDateString();
    const addedToday = contacts.filter(c => 
      new Date(c.createdAt).toDateString() === today
    ).length;
    
    return { total, favorites, withMessages, addedToday };
  };

  const filteredContacts = contacts.filter(contact => {
    // Filter by favorites
    if (showFavoritesOnly && !contact.isFavorite) return false;
    
    // Filter by search term
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      contact.name.toLowerCase().includes(search) ||
      contact.email.toLowerCase().includes(search) ||
      contact.phone.toLowerCase().includes(search)
    );
  });

  const stats = getStatistics();

  return (
    <div className="App">
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
      />
      
      {viewingContact && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>✕</button>
            <div className="modal-header">
              <div className="modal-avatar">
                {viewingContact.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2>{viewingContact.name}</h2>
                {viewingContact.category && (
                  <span className={`category-badge ${viewingContact.category.toLowerCase()}`}>
                    {viewingContact.category}
                  </span>
                )}
              </div>
            </div>
            <div className="modal-body">
              <div className="modal-field">
                <label>📧 Email</label>
                <div className="field-value">
                  <a href={`mailto:${viewingContact.email}`}>{viewingContact.email}</a>
                  <button 
                    className="copy-btn"
                    onClick={() => handleCopyToClipboard(viewingContact.email, 'Email')}
                  >
                    {copiedField === 'Email' ? '✓' : '📋'}
                  </button>
                </div>
              </div>
              <div className="modal-field">
                <label>📱 Phone</label>
                <div className="field-value">
                  <a href={`tel:${viewingContact.phone}`}>{viewingContact.phone}</a>
                  <button 
                    className="copy-btn"
                    onClick={() => handleCopyToClipboard(viewingContact.phone, 'Phone')}
                  >
                    {copiedField === 'Phone' ? '✓' : '📋'}
                  </button>
                </div>
              </div>
              {viewingContact.message && (
                <div className="modal-field">
                  <label>💬 Message</label>
                  <div className="field-value">
                    <p>{viewingContact.message}</p>
                  </div>
                </div>
              )}
              <div className="modal-field">
                <label>📅 Added</label>
                <div className="field-value">
                  <span>{new Date(viewingContact.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn edit" onClick={() => {
                handleEditContact(viewingContact);
                handleCloseModal();
              }}>
                ✏️ Edit Contact
              </button>
              <button className="modal-btn delete" onClick={() => {
                if (window.confirm(`Delete contact "${viewingContact.name}"?`)) {
                  handleDeleteContact(viewingContact._id);
                  handleCloseModal();
                }
              }}>
                🗑️ Delete Contact
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="container">
        <header className="app-header">
          <div className="header-content">
            <div className="header-title">
              <h1>📇 Contact Management System</h1>
              <p>Add and manage your contacts efficiently</p>
            </div>
            <div className="header-actions">
              <button className="stats-toggle" onClick={() => setShowStats(!showStats)}>
                📊 {showStats ? 'Hide' : 'Show'} Stats
              </button>
              <div className="stats-badge" onClick={() => setShowStats(!showStats)}>
                <span className="stat-number">{contacts.length}</span>
                <span className="stat-label">Total</span>
              </div>
            </div>
          </div>
          
          {showStats && (
            <div className="stats-panel">
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.favorites}</div>
                  <div className="stat-title">Favorites</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💬</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.withMessages}</div>
                  <div className="stat-title">With Messages</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🆕</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.addedToday}</div>
                  <div className="stat-title">Added Today</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.total}</div>
                  <div className="stat-title">Total Contacts</div>
                </div>
              </div>
            </div>
          )}
        </header>

        <div className="content">
          <div className="form-section">
            <ContactForm 
              onSubmit={handleContactSubmit}
              editingContact={editingContact}
              onCancel={handleCancelEdit}
            />
          </div>

          <div className="list-section">
            <div className="list-controls">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="🔍 Search contacts by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button 
                    className="clear-search"
                    onClick={() => setSearchTerm('')}
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="action-buttons">
                <button 
                  className={`filter-btn ${showFavoritesOnly ? 'active' : ''}`}
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  title="Show favorites only"
                >
                  ⭐ {showFavoritesOnly ? 'All' : 'Favorites'}
                </button>
                <button 
                  className="export-btn"
                  onClick={handleExport}
                  disabled={contacts.length === 0}
                  title="Export contacts"
                >
                  📥 Export
                </button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading contacts...</p>
              </div>
            ) : (
              <ContactList 
                contacts={filteredContacts} 
                onDelete={handleDeleteContact}
                onEdit={handleEditContact}
                onToggleFavorite={handleToggleFavorite}
                onView={handleViewContact}
                searchTerm={searchTerm}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
