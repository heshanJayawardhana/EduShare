<<<<<<< HEAD
# EduShare
Monetized Academic Resource Hub
=======
# EduShare - Academic Resource Hub

A fully functional React.js frontend for an academic resource sharing platform, built with TypeScript, Tailwind CSS, and modern web technologies.

## 🚀 Features

### Core Functionality
- **Resource Discovery**: Browse and search academic resources with advanced filtering
- **User Ratings**: Interactive 5-star rating system with visual feedback
- **Comment System**: Add comments and view feedback from other users
- **Shopping Cart**: Add resources to cart for purchase/download
- **User Badges**: Bronze, Silver, and Gold contributor badges
- **Responsive Design**: Mobile-first design that works on all devices

### Pages
1. **Home Page**: Grid layout of resource cards with search and filtering
2. **Resource Detail Page**: Full resource information with ratings and comments
3. **Student Dashboard**: Personal analytics with charts and earnings overview
4. **Admin Dashboard**: Platform management with user and resource administration

### Key Components
- **Navbar**: Search, filters, notifications, cart, and profile dropdown
- **ResourceCard**: Reusable card component for resource display
- **RatingStars**: Interactive star rating component
- **CommentBox**: Comment management with positive feedback tracking
- **Charts**: Data visualization using Chart.js

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Routing**: React Router v6
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **API Client**: Axios with interceptors
- **Build Tool**: Create React App with TypeScript

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx
│   ├── ResourceCard.tsx
│   ├── RatingStars.tsx
│   └── CommentBox.tsx
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── ResourceDetailPage.tsx
│   ├── StudentDashboard.tsx
│   └── AdminDashboard.tsx
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── api.ts
├── hooks/              # Custom React hooks
├── assets/             # Static assets
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
└── index.css           # Global styles
```

## 🚦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd edushare-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### API Integration
The app is configured to work with a backend API. Update the `API_BASE_URL` in `src/utils/api.ts` to point to your backend server.

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🎨 UI Features

### Animations
- Smooth hover effects on resource cards
- Star rating animations on interaction
- Slide-up animations for new content
- Fade-in transitions

### Interactive Elements
- **Search Bar**: Real-time search with debouncing
- **Filters**: Faculty and academic year dropdowns
- **Rating System**: Click to rate, hover for preview
- **Cart Management**: Add/remove items with count updates
- **Profile Dropdown**: User menu with navigation options

### Badge System
- **Bronze**: New contributors (0-50 downloads)
- **Silver**: Active contributors (51-200 downloads)
- **Gold**: Expert contributors (200+ downloads)

## 📊 Dashboard Analytics

### Student Dashboard
- Downloads per month chart
- Earnings overview with trends
- Personal statistics and achievements
- Uploaded resources management

### Admin Dashboard
- Platform-wide statistics
- User management interface
- Resource administration
- Comment moderation tools
- Rating analytics

## 🔐 Authentication

The app includes JWT-based authentication setup:
- Token storage in localStorage
- Automatic token injection in API requests
- Redirect on token expiration
- Protected route support

## 🎯 Key Features Implemented

### Navigation Bar
- ✅ Logo and branding
- ✅ Search functionality with icon
- ✅ Faculty and academic year filters
- ✅ Notification icon with badge counter
- ✅ Shopping cart with item count
- ✅ Profile avatar with dropdown menu

### Resource Cards
- ✅ Resource title and description preview
- ✅ Uploader information with badge display
- ✅ Star rating display
- ✅ Download count
- ✅ "Add to Cart" functionality
- ✅ Hover effects and animations

### Resource Detail Page
- ✅ Full resource information
- ✅ Uploader details and badge
- ✅ Interactive 5-star rating
- ✅ Comments section with feedback summary
- ✅ Download/Purchase buttons
- ✅ Related resources sidebar

### Student Dashboard
- ✅ Chart.js integration for data visualization
- ✅ Downloads per month line chart
- ✅ Earnings overview
- ✅ Uploaded resources list
- ✅ Badge display and achievements

### Admin Dashboard
- ✅ Platform statistics overview
- ✅ Resource management table
- ✅ Comment moderation with delete functionality
- ✅ Rating analytics with bar charts
- ✅ Recent activity feed

## 🔄 API Integration

The application is ready for backend integration with:
- Configurable API base URL
- Request/response interceptors
- Error handling and user feedback
- Authentication token management
- Mock data for development

## 🎨 Customization

### Theming
Update `tailwind.config.js` to customize:
- Color palette
- Typography scales
- Animation durations
- Breakpoints

### Components
All components are built with:
- TypeScript for type safety
- Props interfaces for documentation
- Reusable design patterns
- Accessibility considerations

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Setup
Ensure the following environment variables are set in production:
- `REACT_APP_API_URL` - Backend API endpoint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

---

**Built with ❤️ for the academic community**
>>>>>>> 8755838 (Added project files)
