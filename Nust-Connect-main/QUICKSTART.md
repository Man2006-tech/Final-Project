# Quick Start Guide - NUST Connect

## Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+

## 1. Setup MySQL Database

```sql
CREATE DATABASE nustconnect;
```

If using a non-root user, update credentials in `Backend/nustconnect/src/main/resources/application.properties`:
```properties
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password
```

Or set environment variables:
```powershell
$env:DB_USERNAME="your_db_user"
$env:DB_PASSWORD="your_db_password"
```

## 2. Install Dependencies

### Frontend
```bash
cd Frontend
npm install
```

### Backend
(Maven dependencies auto-download on first run)

## 3. Run the Project

### Option A: Quick Start Scripts (Windows)

**Using batch file:**
```bash
.\run_project.bat
```

**Using PowerShell:**
```powershell
.\run_app.ps1
```

### Option B: Manual Start (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd Backend\nustconnect
mvnw.cmd spring-boot:run
```
Backend starts on **http://localhost:8081**

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```
Frontend starts on **http://localhost:5173+** (Vite picks next available port)

## 4. Access the Application

Open your browser and navigate to the URL shown in your frontend terminal (e.g., `http://localhost:5174`)

**Test Login:**
- Email: `testuser@example.com`
- Password: `password123`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **MySQL Connection Error** | Ensure MySQL is running and credentials are correct in `application.properties` |
| **Port 8081 in use** | Stop other apps using port 8081 or change backend port in `application.properties` |
| **Frontend can't reach API** | Check backend is running on 8081 and CORS is configured for your frontend port |
| **npm command not found** | Install Node.js from nodejs.org |
| **Maven build fails** | Delete `Backend/nustconnect/target` folder and try again |

## Key URLs

- **Frontend**: http://localhost:5173+ 
- **Backend API**: http://localhost:8081/api
- **API Docs**: Check `README.md` for endpoint list

## For Full Details

See `README.md` for:
- Complete feature list
- All API endpoints
- Configuration options
- Production build instructions
- Development tips
