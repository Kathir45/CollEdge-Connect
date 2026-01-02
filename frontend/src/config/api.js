const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = {
  // Contacts
  getAllContacts: () => fetch(`${API_URL}/contacts`).then(res => res.json()),
  
  createContact: (data) => fetch(`${API_URL}/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  
  updateContact: (id, data) => fetch(`${API_URL}/contacts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  
  deleteContact: (id) => fetch(`${API_URL}/contacts/${id}`, {
    method: 'DELETE'
  }).then(res => res.json()),
  
  toggleFavorite: (id) => fetch(`${API_URL}/contacts/${id}/favorite`, {
    method: 'PATCH'
  }).then(res => res.json())
};

export default API_URL;
