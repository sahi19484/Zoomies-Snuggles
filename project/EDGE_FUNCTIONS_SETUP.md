# Supabase Edge Functions Setup Guide

This guide explains how to deploy all 4 edge functions for the Zoomies & Snuggles pet adoption platform.

## Edge Functions Overview

### 1. **Send Adoption Notification** (`send-adoption-notification`)
Sends automated emails to adopters about their application status.

**Features:**
- Adoption confirmation emails
- Status update notifications (pending, approved, rejected)
- HTML email templates
- CC organization email

**Payload Example:**
```json
{
  "adopterId": "uuid",
  "adopterEmail": "user@example.com",
  "adopterName": "John Doe",
  "petName": "Buddy",
  "petId": "pet-uuid",
  "organizationEmail": "admin@zoomies.com",
  "notificationType": "approved"
}
```

---

### 2. **Advanced Pet Search** (`advanced-pet-search`)
Fast, filtered pet search with multiple filter options.

**Features:**
- Search by name, breed, description
- Filter by species, size, location
- Vaccination & neutering filters
- Sorting options (newest, name, urgent)
- Pagination support
- 5-minute caching

**Query Parameters:**
```
GET /advanced-pet-search?
  query=golden&
  species=Dog&
  size=Large&
  location=Rajkot&
  vaccinated=true&
  sortBy=urgent&
  limit=20&
  offset=0
```

**Response Example:**
```json
{
  "total": 8,
  "results": [
    {
      "id": "1",
      "name": "Buddy",
      "species": "Dog",
      "breed": "Golden Retriever",
      "image": "https://...",
      "urgent": false
    }
  ]
}
```

---

### 3. **Payment Processing** (`payment-processing`)
Handles donations and adoption fees securely.

**Features:**
- Support for multiple payment methods (card, UPI, netbanking)
- Multiple donation types (general, pet-care, foster-support, adoption-assistance)
- Transaction logging
- Suggested amount recommendations
- Idempotency support

**Payload Example:**
```json
{
  "amount": 10000,
  "currency": "INR",
  "paymentMethod": "upi",
  "donorName": "Priya Patel",
  "donorEmail": "priya@example.com",
  "donationType": "pet-care",
  "description": "Supporting pet medical care"
}
```

**Supported Payment Gateways:**
- Stripe (international)
- Razorpay (India, recommended)
- PayPal

---

### 4. **Image Optimization** (`image-optimization`)
Automatically optimizes and stores pet images.

**Features:**
- Multiple image types (profile, gallery, thumbnail)
- WebP format conversion
- Automatic resizing
- Quality optimization
- Image validation

**Image Optimization Specs:**
```
Profile: 400x400 (quality: 85)
Gallery: 800x600 (quality: 80)
Thumbnail: 200x200 (quality: 75)
```

**Payload Example:**
```json
{
  "fileName": "buddy.jpg",
  "petId": "pet-uuid",
  "imageType": "profile",
  "base64Image": "data:image/jpeg;base64,..."
}
```

---

## Deployment Steps

### Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

### Step 2: Initialize Supabase Project

```bash
supabase init
supabase login
```

### Step 3: Deploy Edge Functions

Navigate to your project directory and run:

```bash
# Deploy all functions
supabase functions deploy send-adoption-notification
supabase functions deploy advanced-pet-search
supabase functions deploy payment-processing
supabase functions deploy image-optimization
```

### Step 4: Set Environment Variables

Add these secrets to Supabase:

```bash
# Email Service
supabase secrets set RESEND_API_KEY=your_resend_api_key

# Payment Processing
supabase secrets set STRIPE_API_KEY=your_stripe_api_key
supabase secrets set RAZORPAY_KEY_ID=your_razorpay_key_id
supabase secrets set RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Image Storage
supabase secrets set BUCKET_NAME=your_storage_bucket_name
```

---

## Integration with Frontend

### 1. Adoption Notification Example

```typescript
import { supabase } from '../supabaseClient';

async function sendAdoptionNotification(data) {
  const { data: response, error } = await supabase.functions.invoke(
    'send-adoption-notification',
    { body: data }
  );
  
  if (error) {
    console.error('Error sending notification:', error);
  } else {
    console.log('Notification sent:', response);
  }
}
```

### 2. Pet Search Example

```typescript
async function searchPets(filters) {
  const queryString = new URLSearchParams(filters).toString();
  const { data, error } = await supabase.functions.invoke(
    'advanced-pet-search',
    { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
  );
  
  return data;
}
```

### 3. Payment Processing Example

```typescript
async function processDonation(donationData) {
  const { data, error } = await supabase.functions.invoke(
    'payment-processing',
    { body: donationData }
  );
  
  if (data.success) {
    console.log('Payment successful:', data.transactionId);
  }
}
```

### 4. Image Optimization Example

```typescript
async function optimizeImage(imageData) {
  const { data, error } = await supabase.functions.invoke(
    'image-optimization',
    { body: imageData }
  );
  
  if (data.success) {
    console.log('Optimized image URL:', data.data.optimized.path);
  }
}
```

---

## Testing Edge Functions Locally

```bash
# Start Supabase locally
supabase start

# Run a function locally
supabase functions serve

# Test with curl
curl -i --location --request POST 'http://localhost:54321/functions/v1/send-adoption-notification' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  --header 'Content-Type: application/json' \
  --data '{"adopterId":"123","adopterEmail":"test@example.com",...}'
```

---

## Next Steps

1. **Email Integration:** Set up Resend or SendGrid for actual email delivery
2. **Payment Integration:** Connect Razorpay or Stripe for real payments
3. **Image Storage:** Set up Supabase Storage or Cloudinary for image hosting
4. **Database Triggers:** Create triggers to call these functions automatically
5. **Error Handling:** Implement retry logic and error notifications

---

## Troubleshooting

### Function Not Deploying
```bash
# Check logs
supabase functions list
supabase functions download send-adoption-notification
```

### CORS Issues
Ensure headers include `'Access-Control-Allow-Origin': '*'`

### Environment Variables Not Working
```bash
supabase secrets list
supabase secrets unset SECRET_NAME
supabase secrets set SECRET_NAME=value
```

---

## Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Runtime](https://deno.land)
- [Supabase Functions Examples](https://github.com/supabase/supabase/tree/master/examples/edge-functions)

---

## Support

For issues or questions:
- Check Supabase logs: Dashboard → Functions → Logs
- Visit Supabase Discord: https://discord.supabase.com
