# WhatsApp Integration Setup Guide

## Overview
This guide explains how to set up WhatsApp Business API integration for automatic appointment confirmation messages.

## What's Implemented

The system now:
1. **Captures appointment data** when users book appointments
2. **Sends automatic WhatsApp messages** to users' phone numbers from your clinic WhatsApp number (8956788907)
3. **Requires no manual interaction** - messages are sent directly from the backend
4. **Stores appointment data** for admin review

## Prerequisites

You need:
1. **WhatsApp Business Account** - Create at https://www.whatsapp.com/business/
2. **Meta/Facebook Developer Account** - Register at https://developers.facebook.com/
3. **WhatsApp Business API Access** - Apply for Business API access
4. **Django Backend** - Already set up in your project

## Setup Steps

### Step 1: Create WhatsApp Business Account
1. Go to https://www.whatsapp.com/business/
2. Sign up with your clinic details
3. Verify your phone number (8956788907)
4. Wait for approval (24-48 hours)

### Step 2: Set Up Meta/Facebook Developer Account
1. Go to https://developers.facebook.com/
2. Create a new app for WhatsApp Business API
3. Add WhatsApp product to your app
4. Configure your phone number

### Step 3: Get API Credentials
After Meta approval, you'll receive:
- **Business Account ID** (WHATSAPP_BUSINESS_ACCOUNT_ID)
- **Phone Number ID** (WHATSAPP_PHONE_NUMBER_ID)
- **Access Token** (WHATSAPP_ACCESS_TOKEN)

### Step 4: Configure Your Django Backend

1. **Install requests library** (if not already installed):
```bash
pip install requests
```

2. **Update `core/whatsapp_service.py`** with your credentials:
```python
WHATSAPP_BUSINESS_ACCOUNT_ID = "YOUR_ACTUAL_BUSINESS_ACCOUNT_ID"
WHATSAPP_PHONE_NUMBER_ID = "YOUR_ACTUAL_PHONE_NUMBER_ID"
WHATSAPP_ACCESS_TOKEN = "YOUR_ACTUAL_ACCESS_TOKEN"
```

3. **Update `juhieye/urls.py`** to include WhatsApp URLs:
```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/whatsapp/', include('core.whatsapp_urls')),
]
```

### Step 5: Create WhatsApp Message Templates

In Meta Business Manager, create these templates:

**Template 1: appointment_confirmation**
```
Welcome to Juhi Eye Care! 👋

Dear {{1}},

We have successfully registered your appointment request:

📅 Date: {{2}}
⏰ Time: {{3}}
🏥 Treatment: {{4}}

Once Dr. Juhi Dhokne approves your appointment, we will notify you on WhatsApp.

Thank you for choosing Juhi Eye Care!
```

**Template 2: appointment_approved** (for admin to send later)
```
Great news, {{1}}! 🎉

Your appointment has been approved!

📅 Date: {{2}}
⏰ Time: {{3}}
📍 Location: {{4}}

Please arrive 10 minutes early. For any queries, contact us.

See you soon!
```

### Step 6: Test the Integration

1. Fill out appointment form on your website
2. Check Django logs for API response
3. User should receive WhatsApp message within seconds

## API Endpoints

### Send Appointment Confirmation
**POST** `/api/whatsapp/send-confirmation/`

Request body:
```json
{
  "full_name": "John Doe",
  "phone": "9876543210",
  "treatment": "Cataract Surgery",
  "appointment_date": "21/05/2026",
  "appointment_time": "10:00 AM",
  "email": "john@example.com"
}
```

### Send Appointment Approval
**POST** `/api/whatsapp/send-approval/`

Request body:
```json
{
  "phone": "9876543210",
  "patient_name": "John Doe",
  "appointment_date": "21/05/2026",
  "appointment_time": "10:00 AM",
  "clinic_address": "Ahmedabad"
}
```

## Features

✅ **Automatic messaging** - No manual WhatsApp sending needed
✅ **Direct from clinic number** - Messages come from 8956788907
✅ **Professional templates** - Pre-formatted message layouts
✅ **Error handling** - Graceful failures if API is down
✅ **Backup storage** - Appointments saved to localStorage
✅ **User notifications** - On-screen confirmation messages

## Troubleshooting

### Messages not being sent?
- Check if credentials are correctly configured
- Verify phone number is in correct format (+91 country code)
- Check Django logs for API errors
- Ensure WhatsApp account is approved

### Phone number format issues?
- System automatically adds +91 country code if missing
- Should work with both 10-digit and full numbers

### Template errors?
- Verify template name matches exactly in Meta Business Manager
- Ensure variable count matches template placeholders
- Check template is approved in WhatsApp Business Manager

## Security Notes

- **CSRF Protection**: Django CSRF tokens are required for POST requests
- **Access Control**: Use Django permission system for admin endpoints
- **Token Storage**: Store ACCESS_TOKEN in environment variables (not in code)
- **Phone Number Validation**: Validate phone numbers before sending

## Next Steps

1. Configure credentials in `core/whatsapp_service.py`
2. Update `juhieye/urls.py` with WhatsApp routes
3. Create message templates in Meta Business Manager
4. Test with a sample appointment
5. Monitor Django logs for any issues
