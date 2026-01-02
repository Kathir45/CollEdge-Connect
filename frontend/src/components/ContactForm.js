import React, { useState, useEffect } from 'react';
import './ContactForm.css';

const ContactForm = ({ onSubmit, editingContact, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    category: 'Other'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load editing contact data
  useEffect(() => {
    if (editingContact) {
      setFormData({
        name: editingContact.name,
        email: editingContact.email,
        phone: editingContact.phone,
        message: editingContact.message || '',
        category: editingContact.category || 'Other'
      });
      setTouched({});
      setErrors({});
    }
  }, [editingContact]);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Phone validation regex (allows digits, spaces, dashes, parentheses, plus)
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!emailRegex.test(value)) return 'Please enter a valid email';
        return '';
      
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!phoneRegex.test(value)) return 'Please enter a valid phone number';
        if (value.replace(/\D/g, '').length < 10) return 'Phone must be at least 10 digits';
        return '';
      
      case 'message':
        if (value.length > 500) return 'Message cannot exceed 500 characters';
        return '';
      
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'message') { // message is optional
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });
    return newErrors;
  };

  const isFormValid = () => {
    const formErrors = validateForm();
    return Object.keys(formErrors).length === 0 && 
           formData.name.trim() && 
           formData.email.trim() && 
           formData.phone.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      phone: true,
      message: true
    });

    // Validate all fields
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      const result = await onSubmit(formData);
      setIsSubmitting(false);

      if (result.success) {
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        setErrors({});
        setTouched({});
      } else {
        // Show server errors
        if (result.errors) {
          const serverErrors = {};
          result.errors.forEach(err => {
            // Try to map error to field
            if (err.toLowerCase().includes('name')) serverErrors.name = err;
            else if (err.toLowerCase().includes('email')) serverErrors.email = err;
            else if (err.toLowerCase().includes('phone')) serverErrors.phone = err;
            else serverErrors.general = err;
          });
          setErrors(serverErrors);
        }
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
      category: 'Other'
    });
    setErrors({});
    setTouched({});
    onCancel();
  };

  return (
    <div className="contact-form-container">
      <div className="form-header">
        <h2>{editingContact ? '✏️ Edit Contact' : '➕ Add New Contact'}</h2>
        {editingContact && (
          <button className="cancel-edit-btn" onClick={handleCancel} type="button">
            ✕ Cancel
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="contact-form" noValidate>
        {errors.general && (
          <div className="error-message general-error">{errors.general}</div>
        )}

        <div className="form-group">
          <label htmlFor="name">
            Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.name && touched.name ? 'error' : ''}
            placeholder="Enter full name"
          />
          {errors.name && touched.name && (
            <span className="error-text">{errors.name}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.email && touched.email ? 'error' : ''}
            placeholder="example@email.com"
          />
          {errors.email && touched.email && (
            <span className="error-text">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone">
            Phone <span className="required">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.phone && touched.phone ? 'error' : ''}
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone && touched.phone && (
            <span className="error-text">{errors.phone}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="category">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="category-select"
          >
            <option value="Work">💼 Work</option>
            <option value="Personal">👤 Personal</option>
            <option value="Family">👨‍👩‍👧 Family</option>
            <option value="Friend">👥 Friend</option>
            <option value="Business">🤝 Business</option>
            <option value="Other">📌 Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="message">
            Message <span className="optional">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.message && touched.message ? 'error' : ''}
            placeholder="Enter your message here..."
            rows="4"
          />
          <div className="char-count">
            {formData.message.length}/500
          </div>
          {errors.message && touched.message && (
            <span className="error-text">{errors.message}</span>
          )}
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={!isFormValid() || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="btn-spinner"></span>
              {editingContact ? 'Updating...' : 'Submitting...'}
            </>
          ) : (
            editingContact ? '💾 Update Contact' : '➕ Add Contact'
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
