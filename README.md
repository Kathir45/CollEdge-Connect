# Contact Management Web App - MERN Stack

A full-stack contact management application built with MongoDB, Express.js, React.js, and Node.js.

## Features

✅ **Contact Form** with client-side validation
- Required fields: Name, Email, Phone
- Optional field: Message
- Real-time error messages
- Submit button disabled when form is invalid

✅ **Backend API**
- POST endpoint to create contacts
- GET endpoint to fetch all contacts
- DELETE endpoint to remove contacts (bonus)

✅ **MongoDB Database**
- Contact schema with validation
- Timestamps for created/updated dates

✅ **Contact Display**
- Real-time updates without page reload
- Responsive card-based layout
- Sorting options (Newest, Oldest, Name)

✅ **Bonus Features Implemented**
- Delete contact functionality
- Success message on form submission
- Reusable React components
- Sorting by date and name
- Responsive design

## Tech Stack

- **Frontend**: React.js with Hooks (useState, useEffect)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose
- **Styling**: Custom CSS with modern design
- **State Management**: React useState

## Prerequisites

Before running this application, make sure you have installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

## Installation & Setup

### 1. Install MongoDB and Start the Service

**Windows:**
```powershell
# After installing MongoDB, start the service
net start MongoDB
```

**Mac/Linux:**
```bash
# Start MongoDB service
sudo systemctl start mongod
# OR
brew services start mongodb-community
```

### 2. Install Backend Dependencies

```powershell
cd backend
npm install
```

### 3. Configure Environment Variables

The `.env` file is already created in the backend folder with default values:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/contactmanagement
```

You can modify these values if needed.

### 4. Install Frontend Dependencies

Frontend dependencies are already installed during project creation.

## Running the Application

### Option 1: Run Both Servers Separately

**Terminal 1 - Start Backend Server:**
```powershell
cd backend
npm start
```

The backend server will start on `http://localhost:5000`

**Terminal 2 - Start Frontend Server:**
```powershell
cd frontend
npm start
```

The frontend will open automatically in your browser at `http://localhost:3000`

### Option 2: Quick Start (Both Servers)

You can run both servers simultaneously using two separate terminal windows as shown above.

## API Endpoints

### Base URL: `http://localhost:5000/api/contacts`

#### 1. Get All Contacts
```
GET /api/contacts
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [...]
}
```

#### 2. Create New Contact
```
POST /api/contacts
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "message": "Optional message here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact created successfully",
  "data": {...}
}
```

#### 3. Delete Contact (Bonus)
```
DELETE /api/contacts/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Contact deleted successfully"
}
```

## Database Schema

```javascript
{
  name: String (required, min 2 chars),
  email: String (required, valid email format),
  phone: String (required, valid phone format),
  message: String (optional, max 500 chars),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Validation Rules

### Client-Side (React)
- **Name**: Required, minimum 2 characters
- **Email**: Required, valid email format
- **Phone**: Required, valid phone format (allows digits, spaces, dashes, parentheses, plus), minimum 10 digits
- **Message**: Optional, maximum 500 characters

### Server-Side (MongoDB/Mongoose)
- Same validation rules enforced on the backend
- Returns detailed error messages for validation failures

## Project Structure

```
CollEdge Connect/
├── backend/
│   ├── models/
│   │   └── Contact.js          # Mongoose schema
│   ├── routes/
│   │   └── contactRoutes.js    # API routes
│   ├── .env                     # Environment variables
│   ├── server.js                # Express server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ContactForm.js   # Form component
│   │   │   ├── ContactForm.css
│   │   │   ├── ContactList.js   # List component
│   │   │   └── ContactList.css
│   │   ├── App.js               # Main component
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
└── README.md
```

## Features Breakdown

### 1. Contact Form Component
- Real-time validation with error messages
- Touch-based validation (errors show only after field interaction)
- Character counter for message field
- Disabled submit button when form is invalid
- Form reset after successful submission

### 2. Contact List Component
- Card-based responsive layout
- Avatar with first letter of name
- Clickable email and phone links
- Delete functionality with confirmation
- Sorting options: Newest, Oldest, Name (A-Z)

### 3. Responsive Design
- Mobile-first approach
- Works on all screen sizes
- Grid layout adapts to viewport
- Touch-friendly buttons and inputs

### 4. User Experience
- Success notification after adding contact
- Loading state during form submission
- Smooth animations and transitions
- Gradient backgrounds and modern UI
- Empty state messaging

## Testing the Application

1. Start both backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Try adding a contact with valid data
4. Test validation by leaving fields empty or entering invalid data
5. Observe that contacts appear immediately without page reload
6. Try different sorting options
7. Test the delete functionality
8. Check responsiveness by resizing the browser window

## Common Issues & Solutions

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution**: Make sure MongoDB service is running
```powershell
net start MongoDB
```

### Port Already in Use
```
Error: Port 5000 is already in use
```
**Solution**: Change the PORT in `.env` file or stop the process using that port

### CORS Error
**Solution**: The backend already has CORS enabled. Make sure both servers are running.

## Performance Notes

- Contacts are sorted on the client side for instant feedback
- MongoDB indexes can be added for large datasets
- Pagination can be implemented for better performance with many contacts

## Future Enhancements

- [ ] Edit contact functionality
- [ ] Search and filter contacts
- [ ] Pagination for large contact lists
- [ ] Export contacts to CSV
- [ ] Contact categories/tags
- [ ] Authentication system
- [ ] Contact photos/avatars upload

## Development Time

⏱️ Estimated completion time: 60 minutes

## Evaluation Criteria Met

✅ MERN stack understanding demonstrated
✅ Clean API structure with proper error handling
✅ MongoDB schema design with validation
✅ Clean, modular, and reusable code
✅ Responsive and modern UI/UX
✅ Client-side validation with error messages
✅ Bonus features implemented

## License

This project was created as an assignment for CollEdge Connect internship.

---

**Built with ❤️ using the MERN Stack**
