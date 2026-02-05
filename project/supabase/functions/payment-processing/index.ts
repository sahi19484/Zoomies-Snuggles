import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface PaymentPayload {
  amount: number; // Amount in smallest currency unit (cents for USD)
  currency: string; // e.g., 'USD', 'INR'
  paymentMethod: 'card' | 'upi' | 'netbanking';
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  donationType: 'general' | 'pet-care' | 'foster-support' | 'adoption-assistance';
  description?: string;
  idempotencyKey?: string;
}

interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  message: string;
  timestamp: string;
}

console.info('Payment processing service started');

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: { 'Access-Control-Allow-Origin': '*' } 
    });
  }

  try {
    const payload: PaymentPayload = await req.json();
    const {
      amount,
      currency,
      paymentMethod,
      donorName,
      donorEmail,
      donorPhone,
      donationType,
      description,
      idempotencyKey
    } = payload;

    // Validate input
    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({
          success: false,
          status: 'failed',
          message: 'Invalid amount'
        } as PaymentResponse),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Generate transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Log payment attempt
    console.info(`Payment initiated:`, {
      transactionId,
      amount,
      currency,
      donorEmail,
      paymentMethod,
      donationType
    });

    // TODO: Integrate with actual payment gateway
    // Examples:
    // - Stripe: https://stripe.com
    // - Razorpay: https://razorpay.com (Great for INR)
    // - PayPal: https://paypal.com

    // Mock payment processing logic
    // In production, you would call your payment provider's API here

    const paymentGatewayConfig = {
      'stripe': {
        apiKey: Deno.env.get('STRIPE_API_KEY'),
        endpoint: 'https://api.stripe.com/v1/payment_intents'
      },
      'razorpay': {
        keyId: Deno.env.get('RAZORPAY_KEY_ID'),
        keySecret: Deno.env.get('RAZORPAY_KEY_SECRET'),
        endpoint: 'https://api.razorpay.com/v1/payments'
      }
    };

    // Simulate successful payment (replace with actual payment API call)
    const paymentData = {
      transactionId,
      amount,
      currency,
      payerName: donorName,
      payerEmail: donorEmail,
      paymentMethod,
      donationType,
      status: 'completed',
      timestamp: new Date().toISOString(),
      receiptUrl: `/receipts/${transactionId}`
    };

    // Log successful payment
    console.info(`Payment successful:`, paymentData);

    // TODO: Send receipt email to donor
    // TODO: Update donation records in database
    // TODO: Send thank you notification

    const response: PaymentResponse = {
      success: true,
      transactionId,
      amount,
      currency,
      status: 'completed',
      message: `Thank you for your donation of ${(amount / 100).toFixed(2)} ${currency}!`,
      timestamp: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(response),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        status: 200
      }
    );

  } catch (error) {
    console.error('Payment processing error:', error);

    const errorResponse: PaymentResponse = {
      success: false,
      amount: 0,
      currency: 'USD',
      status: 'failed',
      message: error instanceof Error ? error.message : 'Payment processing failed',
      timestamp: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(errorResponse),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

// Donation types and suggested amounts
export const DONATION_TYPES = {
  general: {
    name: 'General Support',
    description: 'Support our overall mission',
    suggestedAmounts: [500, 1000, 2500, 5000]
  },
  petCare: {
    name: 'Pet Care',
    description: 'Help with medical care and nutrition',
    suggestedAmounts: [1000, 2500, 5000, 10000]
  },
  fosterSupport: {
    name: 'Foster Support',
    description: 'Support foster families',
    suggestedAmounts: [1500, 3000, 7500, 15000]
  },
  adoptionAssistance: {
    name: 'Adoption Assistance',
    description: 'Help families afford adoption fees',
    suggestedAmounts: [2000, 5000, 10000, 25000]
  }
};
