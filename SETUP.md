# Setup Guide for EduFlow Signup System

## Overview
This guide will help you set up the EduFlow signup system with OTP verification and SMS integration using your existing SMS API.

## Prerequisites
- Node.js 18+ installed
- MySQL database
- Existing SMS API service configured

## Database Setup

### 1. Environment Variables
Create a `.env` file in the root directory with the following variables:

```bash
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/database_name"

# SMS Configuration (Your existing SMS API)
SMS_API_KEY="your_sms_api_key_here"
SMS_SENDER_ID="your_sender_id_here"
SMS_API_URL="your_sms_api_endpoint"
SMS_API_URL_MANY="your_bulk_sms_api_endpoint"

# Owner Information
OWNER_PHONE="01303644935"
OWNER_NAME="Avilash Palace Owner"

# Support Information
SUPPORT_PHONE="01303644935"
SUPPORT_EMAIL="info@avilashpalace.com"
SUPPORT_WEBSITE="https://avilash-palace.vercel.app/"

# Payment Information
BIKASH_NUMBER="01303644935"
PAYMENT_REQUEST_URL="https://avilash-palace.vercel.app/student/payment-requests"
```

### 2. Database Migration
After setting up your environment variables, run the database migration:

```bash
npx prisma migrate dev --name add_admin_fields
```

This will create the necessary database tables with the new fields:
- `smsActivation` - Boolean flag for SMS activation (default: false)
- `smsAmount` - SMS balance amount (default: 0)
- `otp` - OTP for phone verification
- `otpExpire` - OTP expiration timestamp
- `status` - Account status (pending, active, inactive, suspended)
- `subdomain` - Optional subdomain field (not required for registration)

### 3. Generate Prisma Client
```bash
npx prisma generate
```

## SMS Integration

### 1. SMS API Configuration
The system uses your existing SMS API service. Ensure the following is configured:

1. **SMS API Endpoint**: Set your SMS API URL in environment variables
2. **API Key**: Configure your SMS service API key
3. **Sender ID**: Set your approved sender ID
4. **Message Format**: The system sends OTP messages in a specific format

### 2. SMS Testing
The system will automatically send OTP messages during signup. If SMS fails, OTPs will be logged to the console for testing purposes.

## Features

### Signup Process
1. **Form Submission**: User fills out signup form with name, phone, and password
2. **Account Creation**: Admin account is created with 'pending' status
3. **OTP Generation**: 6-digit OTP is generated and sent via your SMS API
4. **Phone Verification**: User enters OTP to verify phone number
5. **Account Activation**: Account status changes to 'active' upon successful verification

### Security Features
- **Password hashing** with bcrypt
- **OTP expiration** (15 minutes)
- **Unique phone number** validation
- **Account status management**
- **Password visibility toggle** with eye buttons

### SMS Features
- **Automatic OTP delivery** via your existing SMS API
- **OTP resend functionality**
- **SMS delivery status tracking**
- **Fallback logging** for development

### UI Features
- **Password visibility toggle** for both password fields
- **Modern responsive design** with smooth animations
- **Real-time validation** and error feedback
- **Toast notifications** for user feedback

## API Endpoints

### 1. Signup
- **POST** `/api/owner/signup`
- Creates new admin account and sends OTP via your SMS API

### 2. OTP Verification
- **POST** `/api/owner/verify-otp`
- Verifies OTP and activates account

### 3. OTP Resend
- **POST** `/api/owner/resend-otp`
- Generates and sends new OTP via your SMS API

## Development

### Running the Application
```bash
npm run dev
```

### Database Management
```bash
# View database in Prisma Studio
npx prisma studio

# Reset database (WARNING: This will delete all data)
npx prisma migrate reset

# View migration history
npx prisma migrate status
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check your DATABASE_URL in .env
   - Ensure MySQL is running
   - Verify database credentials

2. **SMS Not Sending**
   - Check SMS_API_KEY and SENDER_ID
   - Verify SMS API endpoint is correct
   - Check console logs for error messages
   - Ensure your SMS service is working

3. **OTP Not Working**
   - Verify OTP hasn't expired (15 minutes)
   - Check if account status is 'pending'
   - Ensure phone number matches exactly

### Testing Without SMS
During development, if you don't want to send actual SMS:
1. OTPs will be logged to the console
2. You can use these OTPs for testing
3. SMS integration can be disabled by commenting out the sendSMS calls

## Production Deployment

### Environment Variables
- Ensure all sensitive data is properly secured
- Use strong, unique passwords for database
- Rotate SMS API keys regularly

### Database
- Use production-grade MySQL instance
- Set up proper backups
- Configure connection pooling

### SMS Service
- Monitor SMS delivery rates
- Set up SMS delivery reports
- Implement rate limiting if needed
- Ensure your SMS service is reliable

## Support

For technical support or questions:
- Check the console logs for error messages
- Verify all environment variables are set correctly
- Ensure database migrations have been applied
- Test SMS integration with small amounts first
- Verify your SMS API service is working properly
