-- ============================================
-- NUST Connect - MySQL Database Setup Script
-- ============================================
-- This script creates the database and user for NUST Connect
-- Run this script as MySQL root user

-- Create database for development
CREATE DATABASE IF NOT EXISTS nustconnect
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Create database for production
CREATE DATABASE IF NOT EXISTS nustconnect_prod
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Create dedicated user for the application (recommended for security)
-- Replace 'your_password_here' with a strong password
CREATE USER IF NOT EXISTS 'nustconnect_user'@'localhost'
    IDENTIFIED BY 'your_password_here';

-- Grant all privileges on development database
GRANT ALL PRIVILEGES ON nustconnect.*
    TO 'nustconnect_user'@'localhost';

-- Grant all privileges on production database
GRANT ALL PRIVILEGES ON nustconnect_prod.*
    TO 'nustconnect_user'@'localhost';

-- Apply the privileges
FLUSH PRIVILEGES;

-- Use the development database
USE nustconnect;

-- Show current database
SELECT DATABASE();

-- ============================================
-- Optional: Create a read-only user for reporting
-- ============================================
-- CREATE USER IF NOT EXISTS 'nustconnect_readonly'@'localhost'
--     IDENTIFIED BY 'readonly_password_here';
--
-- GRANT SELECT ON nustconnect.*
--     TO 'nustconnect_readonly'@'localhost';
--
-- FLUSH PRIVILEGES;

-- ============================================
-- Verification
-- ============================================
SHOW DATABASES LIKE 'nustconnect%';
SELECT User, Host FROM mysql.user WHERE User LIKE 'nustconnect%';

-- ============================================
-- Notes:
-- ============================================
-- 1. The application will auto-create tables using Hibernate DDL
-- 2. Default configuration uses 'root' user - update to 'nustconnect_user' for better security
-- 3. Update your environment variables or application.properties:
--    DB_URL=jdbc:mysql://localhost:3306/nustconnect
--    DB_USERNAME=nustconnect_user
--    DB_PASSWORD=your_password_here
-- ============================================
