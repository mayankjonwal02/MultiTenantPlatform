# Email Sending Implementation Guide

## Overview
Email sending has been successfully implemented throughout the application with support for:
- Password reset emails
- Email verification emails  
- Invitation emails

## Library Used
**No additional library installation needed!** 

The implementation uses:
1. **Django's built-in `django.core.mail`** - For SMTP email sending
2. **Celery** (already in requirements.txt) - For asynchronous email delivery
3. **Django's token generator** (`django.contrib.auth.tokens`) - For secure token generation

## Environment Configuration (.env)

The following variables have been added/configured:

```env
# SMTP Configuration (Gmail)
SMTP_EMAIL=boomboomagent2002@gmail.com
SMTP_PASSWORD=uqrp pcsq vdxb rqvb

# Frontend URL for email links
FRONTEND_URL=http://localhost:3000

# Celery Configuration
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

## Files Created/Modified

### New Files Created:

1. **`users/services/email_service.py`**
   - Core email sending functions
   - `send_password_reset_email()` - Send password reset emails
   - `send_verification_email()` - Send email verification
   - `send_invitation_email()` - Send invitation emails
   - All functions support HTML and plain text versions

2. **`users/tasks.py`**
   - Celery async tasks for email sending
   - Tasks can be called with `.delay()` for async execution
   - Available tasks:
     - `send_password_reset_email_task`
     - `send_verification_email_task`
     - `send_invitation_email_task`

3. **`config/celery.py`**
   - Celery app initialization
   - Auto-discovers tasks from all Django apps
   - Configured to use Redis as message broker

### Modified Files:

1. **`config/settings.py`**
   - Added email backend configuration
   - Added Celery configuration
   - Imports `dotenv` for environment variables

2. **`config/__init__.py`**
   - Initializes Celery on Django startup

3. **`users/api/views/password_views.py`**
   - `ForgotPasswordApiView`: Now generates token and sends reset email
   - `ResetPasswordApiView`: Validates token and updates password
   - Uses async email sending

4. **`users/api/views/auth_views.py`**
   - `SignupView`: Now sends verification email after signup
   - Includes message in response about email verification

5. **`users/api/views/email_verification_views.py`**
   - `VerifyEmailApiView`: Validates token and marks user as verified
   - Returns success/error messages

6. **`tenants/api/views/invitation_views.py`**
   - `InvitationApiView`: Generates invitation token and sends email
   - Requires organization_id in request body
   - Requires authentication (inviter information)

7. **`.env`**
   - Added FRONTEND_URL, CELERY_BROKER_URL, CELERY_RESULT_BACKEND

## How It Works

### Email Sending Flow

1. **User triggers action** (signup, forgot password, send invite)
2. **View validates input** using serializers
3. **View generates secure token** using Django's token generator
4. **View queues async task** using Celery
5. **Celery worker picks up task** and sends email
6. **Email delivery** via Gmail SMTP

### Security Features

- **Tokens**: Secure, time-limited tokens for password reset and verification
- **Safe error messages**: Doesn't reveal if email exists (password reset)
- **HTML + Plain text**: Emails include both formats for compatibility

## API Endpoints

### Password Reset
```bash
# 1. Request password reset
POST /api/users/forgot-password/
{
  "email": "user@example.com"
}

# 2. Reset password with token
POST /api/users/reset-password/
{
  "email": "user@example.com",
  "token": "reset-token-from-email",
  "password": "newpassword123"
}
```

### Email Verification
```bash
# Verify email with token received in signup email
POST /api/users/verify-email/
{
  "user_id": "user-uuid",
  "token": "verification-token-from-email"
}
```

### Send Invitation
```bash
# Send invitation to organization
POST /api/tenants/invitations/
{
  "email": "invitee@example.com",
  "role_id": "role-uuid",
  "organization_id": "org-uuid"
}
```

## Running the Application

### Required Services

1. **PostgreSQL** - Database
   ```bash
   # Already configured in settings
   ```

2. **Redis** - Message broker for Celery
   ```bash
   # Windows: Download and run Redis from https://github.com/microsoftarchive/redis/releases
   # Or use WSL: redis-server
   ```

3. **Celery Worker** - Process async tasks
   ```bash
   # Run in a separate terminal
   cd backend
   celery -A config worker -l info
   ```

4. **Django Development Server**
   ```bash
   cd backend
   python manage.py runserver
   ```

## Testing Email Sending

### Option 1: Using Gmail
The application is already configured to use Gmail SMTP. The credentials in `.env` are ready to use.

### Option 2: Testing with Console Backend (Development)
Temporarily modify `settings.py`:
```python
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```
Emails will print to console instead of sending.

### Option 3: Using Mailhog (Local Testing)
```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'localhost'
EMAIL_PORT = 1025
```

## Customization

### Email Templates
Email templates are currently defined in `email_service.py`. To use Django templates:

```python
from django.template.loader import render_to_string

html_message = render_to_string('email/password_reset.html', {
    'user_name': user_name,
    'reset_link': reset_link
})
```

Create template files in:
- `users/templates/email/password_reset.html`
- `users/templates/email/verification.html`
- `tenants/templates/email/invitation.html`

### Frontend URL
Update `FRONTEND_URL` in `.env` to match your frontend deployment URL.

## Troubleshooting

### Emails not sending
1. Check Redis is running: `redis-cli ping` (should return PONG)
2. Check Celery worker is running: `celery -A config worker -l info`
3. Check Gmail credentials in `.env`
4. For Gmail: Enable "Less secure app access" or use App Password

### Celery tasks not executing
1. Ensure Redis is running
2. Check Celery worker console for errors
3. Verify CELERY_BROKER_URL is correct

### Gmail Authentication Issues
1. Use 16-character Google App Password (not regular password)
2. Enable 2FA on Gmail account
3. Create app-specific password: https://myaccount.google.com/apppasswords

## Next Steps

1. Create proper email templates in Django's template system
2. Implement invitation model to store invitations in database
3. Add email logging to track sent emails
4. Set up email retry logic for failed sends
5. Add rate limiting to prevent email abuse
6. Implement email unsubscribe functionality
