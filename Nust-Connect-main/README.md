# NUST Connect

A modern campus connectivity platform that helps NUST students connect, collaborate, and share information seamlessly. Built with React, Spring Boot, and MySQL.

## Features

- **User Authentication**: Secure login and registration for NUST students
- **Dashboard**: Personalized home feed with recent activities
- **Events**: Discover and register for campus events
- **Rides**: Find and share rides with other students
- **Marketplace**: Buy and sell items on campus
- **Jobs**: Browse and apply for on-campus jobs
- **Lost & Found**: Report and search for lost items
- **Complaints**: Lodge and track campus complaints
- **Posts & Discussions**: Create posts and comment with other students
- **Notifications**: Real-time updates for interactions and events

## Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **React Router** - Client-side routing

### Backend
- **Java 17+** - Programming language
- **Spring Boot 3.2.5** - Framework
- **Spring JPA/Hibernate** - ORM
- **MySQL** - Database
- **Spring Security** - Authentication & authorization
- **JWT** - Token-based authentication
- **Maven** - Build tool

## Prerequisites

### For Backend
- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.8+

### For Frontend
- Node.js 18+ 
- npm 9+

## Installation & Setup

### 1. Database Setup (MySQL)

```sql
-- Create database
CREATE DATABASE nustconnect;

-- Create user (or use existing root)
CREATE USER 'nust_user'@'localhost' IDENTIFIED BY 'nust_password';
GRANT ALL PRIVILEGES ON nustconnect.* TO 'nust_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd Backend/nustconnect
```

Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.username=nust_user
spring.datasource.password=nust_password
spring.datasource.url=jdbc:mysql://localhost:3306/nustconnect?useSSL=false&serverTimezone=UTC
```

Or set environment variables:
```powershell
# Windows PowerShell
$env:DB_USERNAME="nust_user"
$env:DB_PASSWORD="nust_password"
```

Install dependencies and start the backend:
```bash
# Windows
mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

The backend will start on **http://localhost:8081**

### 3. Frontend Setup

Navigate to the frontend directory:
```bash
cd Frontend
```

Install Node dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The frontend will start on **http://localhost:5173** (or next available port like 5174, 5175, 5176)

## Running the Full Project

### Quick Start (from root directory)

**Option 1: Using provided scripts**

Windows:
```bash
.\run_project.bat
```

Or PowerShell:
```powershell
.\run_app.ps1
```

**Option 2: Manual steps**

Terminal 1 - Start Backend:
```bash
cd Backend\nustconnect
mvnw.cmd spring-boot:run
```

Terminal 2 - Start Frontend:
```bash
cd Frontend
npm install  # First time only
npm run dev
```

Then open your browser and navigate to the URL shown in the frontend terminal output.

## Configuration

### Backend Configuration (`src/main/resources/application.properties`)

Key settings you may need to adjust:

```properties
# Server Port
server.port=8081

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/nustconnect
spring.datasource.username=root
spring.datasource.password=root

# CORS Origins (add frontend URL)
cors.allowed-origins=http://localhost:3000,http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176

# JWT Secret (change in production)
jwt.secret=mySecretKey12345678901234567890123456789012
jwt.expiration=86400000

# Email Configuration (for notifications)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

### Frontend Configuration (`vite.config.js`)

The proxy is configured to forward API calls:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8081',
    changeOrigin: true,
  },
}
```

## Building for Production

### Backend
```bash
cd Backend/nustconnect
mvnw.cmd clean package
# JAR will be in target/nustconnect-1.0.0.jar
```

### Frontend
```bash
cd Frontend
npm run build
# Build output in dist/ folder
```

## Troubleshooting

### Backend won't start
- Check MySQL is running: `mysql -u root -p`
- Verify database exists: `SHOW DATABASES;`
- Check port 8081 is not in use: `netstat -ano | findstr :8081`
- Check DB credentials in `application.properties`

### Frontend won't connect to backend
- Ensure backend is running on port 8081
- Check CORS origins in `application.properties` include your frontend URL
- Open browser DevTools → Network tab and check API requests

### Port already in use
- Backend (8081): `netstat -ano | findstr :8081` then `taskkill /PID <PID> /F`
- Frontend (5173+): Vite will auto-pick next available port, or change in `vite.config.js`

### Login not working
- Verify backend is running and accessible
- Check browser console for errors
- Test backend directly: `curl http://localhost:8081/api/auth/login` (should show 405 GET not allowed)

## API Endpoints

Base URL: `http://localhost:8081/api`

### Authentication
- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `GET /auth/verify-email` - Verify email

### Users
- `GET /users` - Get all users
- `GET /users/{id}` - Get user profile
- `PUT /users/{id}` - Update user profile

### Posts
- `GET /posts` - Get all posts (paginated)
- `POST /posts` - Create post
- `GET /posts/{id}` - Get single post
- `DELETE /posts/{id}` - Delete post

### Events
- `GET /events` - Get all events
- `POST /events` - Create event
- `POST /events/{id}/register` - Register for event

### Marketplace
- `GET /marketplace/items` - Get items
- `POST /marketplace/items` - Create listing

### Rides
- `GET /rides` - Get available rides
- `POST /rides` - Create ride offer

### Lost & Found
- `GET /lost-found/lost` - Get lost items
- `POST /lost-found/lost` - Report lost item

## Development Tips

### Hot Reload
- **Frontend**: Automatically reloads on file changes (Vite)
- **Backend**: Requires restart (configure Spring Boot DevTools for hot reload)

### Adding New Dependencies

Frontend:
```bash
cd Frontend
npm install <package-name>
```

Backend:
```bash
# Add to pom.xml, then Maven auto-updates in IDE or:
cd Backend/nustconnect
mvnw.cmd clean install
```

### Debugging
- Frontend: Use Chrome DevTools (F12)
- Backend: Check logs in terminal or use IDE debugger

## Project Structure

```
Nust-Connect-main/
├── Frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context (Auth)
│   │   ├── services/       # API calls
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx         # Main app component
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
├── Backend/
│   └── nustconnect/
│       ├── src/
│       │   ├── main/java/   # Java source code
│       │   └── main/resources/ # Configuration
│       └── pom.xml         # Maven configuration
└── README.md               # This file
```

## License

This project is part of NUST Software Engineering coursework.

## Support

For issues or questions, contact the development team or check GitHub issues.