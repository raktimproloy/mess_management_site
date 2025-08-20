# Super Admin System Setup Guide

This guide explains how to set up and use the Super Admin system for the EduFlow application.

## Overview

The Super Admin system provides the highest level of administrative access to manage the entire EduFlow platform, including:
- Managing all owner accounts
- Viewing system-wide statistics
- Monitoring payments and activities
- System configuration and maintenance

## Prerequisites

1. Node.js and npm/yarn installed
2. Database (MySQL) running
3. Prisma configured and migrated
4. All required dependencies installed

## Setup Steps

### 1. Database Migration

First, run the Prisma migration to create the SuperAdmin table:

```bash
npx prisma migrate dev --name add_super_admin
```

### 2. Create Initial Super Admin User

Run the setup script to create the default super admin account:

```bash
node create-super-admin.js
```

This will create a super admin with the following credentials:
- **Username**: `superadmin`
- **Password**: `superadmin123`
- **Email**: `superadmin@eduflow.com`

**⚠️ Important**: Change these default credentials after first login!

### 3. Environment Variables

Make sure you have the following environment variables set in your `.env` file:

```env
JWT_SECRET=your-secure-jwt-secret-key-here
DATABASE_URL=your-database-connection-string
```

## API Endpoints

### Authentication

- **POST** `/api/super-admin/login` - Super admin login
- **POST** `/api/super-admin/signup` - Create new super admin (API only)
- **GET** `/api/super-admin/me` - Get current super admin info
- **POST** `/api/super-admin/logout` - Logout (client-side handled)

### Request Format

#### Login
```json
{
  "username": "superadmin",
  "password": "superadmin123"
}
```

#### Signup
```json
{
  "username": "newadmin",
  "email": "admin@example.com",
  "password": "securepassword",
  "name": "Admin Name"
}
```

### Response Format

#### Successful Login
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "username": "superadmin",
    "email": "superadmin@eduflow.com",
    "name": "Super Administrator",
    "role": "super_admin"
  }
}
```

## Frontend Routes

- **Login Page**: `/super-admin/login`
- **Dashboard**: `/super-admin/dashboard`

## Authentication Flow

1. **Login**: User submits credentials to `/api/super-admin/login`
2. **Token Storage**: JWT token is stored in `localStorage` as `superAdminToken`
3. **Protected Routes**: All super admin routes check for valid token
4. **Token Validation**: Server validates token using `requireSuperAdminAuth` middleware
5. **Logout**: Token is removed from `localStorage` and user redirected to login

## Security Features

- **JWT Tokens**: Secure, time-limited authentication tokens
- **Password Hashing**: Bcrypt with salt rounds for secure password storage
- **Role-based Access**: Super admin role validation
- **Account Status**: Active/inactive account status checking
- **Token Expiration**: 24-hour token validity

## Usage Examples

### Making Authenticated Requests

```javascript
const token = localStorage.getItem('superAdminToken');

const response = await fetch('/api/super-admin/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Checking Authentication Status

```javascript
const checkAuth = async () => {
  const token = localStorage.getItem('superAdminToken');
  if (!token) {
    router.push('/super-admin/login');
    return;
  }
  
  // Validate token with server
  const response = await fetch('/api/super-admin/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) {
    localStorage.removeItem('superAdminToken');
    router.push('/super-admin/login');
  }
};
```

## Customization

### Adding New Super Admin Features

1. Create new API endpoints in `/api/super-admin/`
2. Use `requireSuperAdminAuth` middleware for protection
3. Add corresponding frontend components
4. Update the dashboard with new functionality

### Modifying Authentication

1. Update JWT secret in environment variables
2. Modify token expiration in login API
3. Add additional validation rules in `superAdminAuth.js`

## Troubleshooting

### Common Issues

1. **"Invalid credentials" error**: Check username/password and ensure account is active
2. **"Token expired" error**: Re-login to get a new token
3. **"Authorization header required"**: Ensure token is sent in Authorization header
4. **Database connection errors**: Check DATABASE_URL and database status

### Debug Mode

Enable debug logging by setting environment variable:
```env
DEBUG=true
```

## Security Best Practices

1. **Change Default Credentials**: Immediately change default super admin password
2. **Strong JWT Secret**: Use a strong, unique JWT secret
3. **HTTPS Only**: Use HTTPS in production for secure token transmission
4. **Regular Token Rotation**: Consider implementing token refresh mechanism
5. **Audit Logging**: Log all super admin actions for security monitoring

## Support

For issues or questions about the Super Admin system, check:
1. Application logs for error details
2. Database connection and migration status
3. Environment variable configuration
4. JWT token validity and expiration
