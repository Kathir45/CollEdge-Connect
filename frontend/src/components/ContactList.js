import React, { useState } from 'react';
import './ContactList.css';

const ContactList = ({ contacts, onDelete, onEdit, onToggleFavorite, onView, searchTerm }) => {
  const [sortBy, setSortBy] = useState('newest');

  const getSortedContacts = () => {
    const sorted = [...contacts];
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sortedContacts = getSortedContacts();

  return (
    <div className="contact-list-container">
      <div className="list-header">
        <h2>Contacts ({contacts.length})</h2>
        <div className="sort-controls">
          <label htmlFor="sort">Sort by:</label>
          <select 
            id="sort"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {sortedContacts.length === 0 ? (
        <div className="empty-state">
          <p>📭 No contacts yet</p>
          <p className="empty-subtext">Add your first contact using the form</p>
        </div>
      ) : (
        <div className="contacts-grid">
          {sortedContacts.map((contact) => (
            <div key={contact._id} className={`contact-card ${contact.isFavorite ? 'favorite' : ''}`}>
              <button 
                className={`favorite-icon ${contact.isFavorite ? 'active' : ''}`}
                onClick={() => onToggleFavorite(contact._id)}
                title={contact.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {contact.isFavorite ? '⭐' : '☆'}
              </button>
              
              <div className="contact-header">
                <div className="contact-avatar">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div className="contact-info">
                  <h3>{contact.name}</h3>
                  {contact.category && (
                    <span className={`category-badge ${contact.category.toLowerCase()}`}>
                      {contact.category}
                    </span>
                  )}
                  <span className="contact-date">{formatDate(contact.createdAt)}</span>
                </div>
              </div>
              
              <div className="contact-details">
                <div className="detail-item">
                  <span className="detail-icon">📧</span>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📱</span>
                  <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                </div>
                {contact.message && (
                  <div className="detail-item message">
                    <span className="detail-icon">💬</span>
                    <p>{contact.message}</p>
                  </div>
                )}
              </div>

              <div className="card-actions">
                <button 
                  className="view-btn"
                  onClick={() => onView(contact)}
                  title="View details"
                >
                  👁️ View
                </button>
                <button 
                  className="edit-btn"
                  onClick={() => onEdit(contact)}
                  title="Edit contact"
                >
                  ✏️ Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => {
                    if (window.confirm(`Delete contact "${contact.name}"?`)) {
                      onDelete(contact._id);
                    }
                  }}
                  title="Delete contact"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactList;
