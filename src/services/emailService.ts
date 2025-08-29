import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export interface QuoteRequestData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  projectDescription: string;
  quantity: number;
  deadline?: string;
  requirements: string[];
  attachments: Array<{
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
  // Database metadata (added when sending emails with saved data)
  quoteId?: string;
  submittedAt?: string;
  status?: string;
}

export const sendQuoteNotificationEmail = async (quoteData: QuoteRequestData) => {
  try {
    // Email to yourself (business owner)
    const { data, error } = await resend.emails.send({
      from: 'AlphaPrint <noreply@silverbacktreatment.se>',
      to: ['silverbacktreatment@gmail.com'], // Your email
      subject: `🎨 New AlphaPrint Quote Request from ${quoteData.name}${quoteData.quoteId ? ` - #${quoteData.quoteId.slice(-8)}` : ''}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">🎨 New AlphaPrint Quote Request</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">A new custom printing quote request has been submitted</p>
            ${quoteData.quoteId ? `<p style="margin: 5px 0 0 0; opacity: 0.8; font-size: 14px;">Quote ID: #${quoteData.quoteId}</p>` : ''}
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef;">
            ${quoteData.quoteId || quoteData.submittedAt ? `
            <div style="background: #e1f5fe; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #0288d1;">
              <h3 style="margin-top: 0; color: #01579b;">📊 Database Record</h3>
              ${quoteData.quoteId ? `<p><strong>Quote ID:</strong> ${quoteData.quoteId}</p>` : ''}
              ${quoteData.submittedAt ? `<p><strong>Submitted:</strong> ${new Date(quoteData.submittedAt).toLocaleString()}</p>` : ''}
              ${quoteData.status ? `<p><strong>Status:</strong> <span style="background: #4caf50; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${quoteData.status.toUpperCase()}</span></p>` : ''}
            </div>
            ` : ''}
            <h2 style="color: #333; margin-top: 0;">Customer Information</h2>
            <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
              <p><strong>Name:</strong> ${quoteData.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${quoteData.email}">${quoteData.email}</a></p>
              ${quoteData.company ? `<p><strong>Company:</strong> ${quoteData.company}</p>` : ''}
              ${quoteData.phone ? `<p><strong>Phone:</strong> <a href="tel:${quoteData.phone}">${quoteData.phone}</a></p>` : ''}
            </div>

            <h2 style="color: #333;">Project Details</h2>
            <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
              <p><strong>Project Description:</strong></p>
              <div style="background: #f8f9fa; padding: 10px; border-radius: 4px; margin: 10px 0;">
                ${quoteData.projectDescription}
              </div>
              <p><strong>Quantity:</strong> ${quoteData.quantity}</p>
              ${quoteData.deadline ? `<p><strong>Deadline:</strong> ${new Date(quoteData.deadline).toLocaleDateString()}</p>` : ''}
            </div>

            ${quoteData.requirements.length > 0 ? `
            <h2 style="color: #333;">Special Requirements</h2>
            <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
              <ul style="margin: 0; padding-left: 20px;">
                ${quoteData.requirements.map(req => `<li>${req}</li>`).join('')}
              </ul>
            </div>
            ` : ''}

            ${quoteData.attachments.length > 0 ? `
            <h2 style="color: #333;">Attachments (${quoteData.attachments.length})</h2>
            <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
              ${quoteData.attachments.map(file => `
                <div style="border: 1px solid #e9ecef; padding: 10px; margin: 5px 0; border-radius: 4px;">
                  <p style="margin: 0;"><strong>📎 ${file.name}</strong></p>
                  <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">
                    Size: ${(file.size / 1024 / 1024).toFixed(2)} MB | Type: ${file.type}
                  </p>
                  <a href="${file.url}" style="color: #667eea; text-decoration: none;">📥 Download File</a>
                </div>
              `).join('')}
            </div>
            ` : ''}

            <div style="background: #667eea; color: white; padding: 15px; border-radius: 6px; text-align: center;">
              <p style="margin: 0; font-weight: bold;">⏰ Action Required</p>
              <p style="margin: 10px 0 0 0;">Please respond to this quote request within 24 hours to maintain customer satisfaction.</p>
            </div>
          </div>

          <div style="background: #343a40; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="margin: 0; font-size: 14px;">
              AlphaPrint by Silverback Treatment<br>
              <a href="mailto:silverbacktreatment@gmail.com" style="color: #adb5bd;">silverbacktreatment@gmail.com</a>
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Email sending failed:', error);
      return { success: false, error };
    }

    console.log('Quote notification email sent successfully:', data);
    return { success: true, data };

  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error };
  }
};

// Send confirmation email to the customer
export const sendCustomerConfirmationEmail = async (customerEmail: string, customerName: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'AlphaPrint <noreply@silverbacktreatment.se>',
      to: [customerEmail],
      subject: '✅ Quote Request Received - AlphaPrint by Silverback Treatment',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0;">✅ Quote Request Received!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for choosing AlphaPrint</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border: 1px solid #e9ecef;">
            <p>Hi ${customerName},</p>
            
            <p>Thank you for submitting your custom printing quote request! We've received all your details and our team is already reviewing your project.</p>
            
            <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="margin-top: 0; color: #333;">What happens next?</h3>
              <ul style="color: #555;">
                <li><strong>Review:</strong> Our team will carefully review your requirements</li>
                <li><strong>Quote:</strong> You'll receive a detailed quote within 24 hours</li>
                <li><strong>Discussion:</strong> We'll contact you to discuss any questions or modifications</li>
                <li><strong>Production:</strong> Once approved, we'll start production immediately</li>
              </ul>
            </div>
            
            <p>If you have any questions or need to add additional information, please don't hesitate to contact us:</p>
            
            <div style="background: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>📧 Email:</strong> <a href="mailto:silverbacktreatment@gmail.com">silverbacktreatment@gmail.com</a></p>
              <p style="margin: 5px 0;"><strong>📞 Phone:</strong> <a href="tel:+34600013960">+34 600 013 960</a></p>
              <p style="margin: 5px 0;"><strong>🕒 Hours:</strong> Mon-Fri 9AM-6PM CET</p>
            </div>
            
            <p>We're excited to help bring your creative vision to life!</p>
            
            <p>Best regards,<br>
            <strong>The AlphaPrint Team</strong><br>
            Silverback Treatment</p>
          </div>

          <div style="background: #343a40; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="margin: 0; font-size: 14px;">
              AlphaPrint by Silverback Treatment<br>
              Premium Custom Merchandise Solutions
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Customer confirmation email failed:', error);
      return { success: false, error };
    }

    return { success: true, data };

  } catch (error) {
    console.error('Customer email service error:', error);
    return { success: false, error };
  }
};

// Send welcome email to new users from CEO Shaze Sanches
export const sendWelcomeEmail = async (userEmail: string, userName: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Shaze Sanches <noreply@silverbacktreatment.se>',
      to: [userEmail],
      subject: '🎉 Welcome to Silverback Treatment & AlphaPrint - A Personal Message from Our CEO',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <!-- Header with CEO Photo and Branding -->
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 30px 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <div style="background: white; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 32px; color: #1a1a2e; font-weight: bold;">
              S
            </div>
            <h1 style="margin: 0; font-size: 28px;">🎉 Welcome to the Family!</h1>
            <p style="margin: 15px 0 0 0; opacity: 0.9; font-size: 18px;">A personal message from our CEO</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border: 1px solid #e9ecef;">
            <p style="font-size: 18px; color: #333; margin-bottom: 20px;">Hi ${userName},</p>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">I'm Shaze Sanches, CEO and founder of Silverback Treatment. I wanted to personally welcome you to our community!</p>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">When I started Silverback Treatment, my vision was simple: <strong>create premium streetwear that tells your story</strong>. Now, with our AlphaPrint custom printing service, we're helping you bring your own creative vision to life.</p>
            
            <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
              <h3 style="margin-top: 0; color: #333; font-size: 20px;">🚀 What you can do now:</h3>
              <ul style="color: #555; line-height: 1.8; padding-left: 20px;">
                <li><strong>Shop Premium Streetwear:</strong> Browse our curated collection of high-quality apparel</li>
                <li><strong>Design Custom Merchandise:</strong> Use AlphaPrint to create personalized products</li>
                <li><strong>Get Expert Support:</strong> Our team is here to help with any questions</li>
                <li><strong>Join the Community:</strong> Follow us for style inspiration and exclusive drops</li>
              </ul>
            </div>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <h3 style="color: white; margin-top: 0; font-size: 18px;">🎁 Welcome Bonus</h3>
              <p style="color: white; margin: 10px 0; opacity: 0.9;">Use code <strong>WELCOME10</strong> for 10% off your first order</p>
              <p style="color: white; margin: 0; font-size: 14px; opacity: 0.8;">*Valid for 30 days on orders over $50</p>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">Our journey is just beginning, and I'm excited to have you as part of the Silverback family. Whether you're here for our premium streetwear or looking to create something unique with AlphaPrint, we're committed to delivering exceptional quality and service.</p>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">If you ever have questions, suggestions, or just want to share your story, don't hesitate to reach out. I personally read every message.</p>
            
            <div style="border-top: 2px solid #e9ecef; padding-top: 20px; margin-top: 30px;">
              <p style="color: #555; margin-bottom: 5px;">Welcome to the family,</p>
              <div style="display: flex; align-items: center; gap: 15px;">
                <div style="background: #667eea; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px;">
                  S
                </div>
                <div>
                  <p style="margin: 0; font-size: 18px; font-weight: bold; color: #333;">Shaze Sanches</p>
                  <p style="margin: 0; color: #666; font-size: 14px;">CEO & Founder, Silverback Treatment</p>
                </div>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://silverback-shop-connect-4x2qxbqof-senior-sanches-projects.vercel.app" style="background: #667eea; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; display: inline-block;">Start Shopping</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #343a40; color: white; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
            <div style="margin-bottom: 15px;">
              <strong>Silverback Treatment</strong><br>
              <span style="font-size: 14px; opacity: 0.8;">Premium Streetwear & Custom Printing</span>
            </div>
            <div style="font-size: 14px; opacity: 0.7;">
              <p style="margin: 5px 0;">📧 silverbacktreatment@gmail.com</p>
              <p style="margin: 5px 0;">📞 +34 600 013 960</p>
              <p style="margin: 5px 0;">🕒 Mon-Fri 9AM-6PM CET</p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Welcome email sending failed:', error);
      return { success: false, error };
    }

    console.log('Welcome email sent successfully to:', userEmail);
    return { success: true, data };

  } catch (error) {
    console.error('Welcome email service error:', error);
    return { success: false, error };
  }
};

// Order confirmation email interfaces and functions
export interface OrderDetails {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  shippingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    postal_code: string;
    country: string;
  };
  paymentStatus: string;
  orderDate: string;
  designDetails?: {
    designFiles: any[];
    designPosition?: { x: number; y: number };
    designSize?: number;
    isCustomDesign: boolean;
    productVariants?: any;
    actualQuantity?: number;
  };
}

// Send confirmation email to customer
export const sendCustomerOrderConfirmation = async (orderDetails: OrderDetails) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Silverback Treatment <noreply@silverbacktreatment.se>',
      to: [orderDetails.customerEmail], // Send to actual customer email
      subject: `Order Confirmation - #${orderDetails.orderId.substring(3, 10).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; font-size: 28px; margin-bottom: 10px;">Order Confirmed! 🎉</h1>
            <p style="color: #666; font-size: 16px;">Thank you for your order, ${orderDetails.customerName}!</p>
          </div>

          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #333; font-size: 20px; margin-bottom: 15px;">Order Details</h2>
            <p style="margin: 5px 0;"><strong>Order ID:</strong> #${orderDetails.orderId.substring(3, 10).toUpperCase()}</p>
            <p style="margin: 5px 0;"><strong>Order Date:</strong> ${orderDetails.orderDate}</p>
            <p style="margin: 5px 0;"><strong>Payment Status:</strong> <span style="color: green; font-weight: bold;">${orderDetails.paymentStatus}</span></p>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="color: #333; font-size: 18px; margin-bottom: 15px;">Items Ordered</h3>
            ${orderDetails.items.map(item => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
                <div>
                  <strong>${item.name}</strong><br>
                  <span style="color: #666;">Quantity: ${item.quantity}</span>
                </div>
                <div style="font-weight: bold;">€${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            `).join('')}
            
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0; font-size: 18px; font-weight: bold; color: #333;">
              <span>Total:</span>
              <span>€${orderDetails.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          ${orderDetails.shippingAddress ? `
            <div style="margin-bottom: 30px;">
              <h3 style="color: #333; font-size: 18px; margin-bottom: 15px;">Shipping Address</h3>
              <p style="color: #666; line-height: 1.5;">
                ${orderDetails.customerName}<br>
                ${orderDetails.shippingAddress.line1}${orderDetails.shippingAddress.line2 ? `<br>${orderDetails.shippingAddress.line2}` : ''}<br>
                ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.postal_code}<br>
                ${orderDetails.shippingAddress.country}
              </p>
            </div>
          ` : ''}

          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #333; font-size: 18px; margin-bottom: 10px;">What's Next?</h3>
            <p style="color: #666; line-height: 1.6;">
              • We'll process your order within 1-2 business days<br>
              • You'll receive a shipping confirmation with tracking information<br>
              • Expected delivery: 3-5 business days<br>
              • For custom designs: Allow 3-5 additional days for production
            </p>
          </div>

          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>Questions about your order? Contact us at <a href="mailto:silverbacktreatment@gmail.com" style="color: #0066cc;">silverbacktreatment@gmail.com</a></p>
            <p style="margin-top: 20px;">Thank you for choosing Silverback Treatment!</p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Failed to send customer email:', error);
      return { success: false, error };
    }

    console.log('✅ Customer confirmation email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending customer email:', error);
    return { success: false, error };
  }
};

// Send notification email to admin
export const sendAdminOrderNotification = async (orderDetails: OrderDetails) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Silverback Store <noreply@silverbacktreatment.se>',
      to: ['silverbacktreatment@gmail.com'], // Send to business email
      subject: `New Order Received - #${orderDetails.orderId.substring(3, 10).toUpperCase()} - €${orderDetails.totalAmount.toFixed(2)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 25px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">New Order Received</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Order Processing Required</p>
          </div>

          <!-- Order Summary -->
          <div style="background: white; padding: 25px; border-left: 4px solid #dc2626; margin-bottom: 20px;">
            <h2 style="color: #dc2626; margin-top: 0; font-size: 22px;">Order Details</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
              <div>
                <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderDetails.orderId}</p>
                <p style="margin: 5px 0;"><strong>Order Date:</strong> ${orderDetails.orderDate}</p>
                <p style="margin: 5px 0;"><strong>Payment Status:</strong> <span style="color: green; font-weight: bold;">${orderDetails.paymentStatus}</span></p>
              </div>
              <div>
                <p style="margin: 5px 0; font-size: 20px; color: #dc2626;"><strong>TOTAL: €${orderDetails.totalAmount.toFixed(2)}</strong></p>
                <p style="margin: 5px 0;"><strong>Payment Method:</strong> Credit Card</p>
              </div>
            </div>
          </div>

          <!-- Customer Information -->
          <div style="background: white; padding: 25px; margin-bottom: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin-top: 0; font-size: 22px;">Customer Information</h2>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
              <p style="margin: 5px 0; font-size: 16px;"><strong>Name:</strong> ${orderDetails.customerName}</p>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Email:</strong> <a href="mailto:${orderDetails.customerEmail}">${orderDetails.customerEmail}</a></p>
            </div>
          </div>

          <!-- Shipping Address -->
          ${orderDetails.shippingAddress ? `
          <div style="background: white; padding: 25px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #059669;">
            <h2 style="color: #059669; margin-top: 0; font-size: 22px;">Shipping Address</h2>
            <div style="background: #f0f9ff; padding: 20px; border-radius: 6px; font-family: monospace; font-size: 16px; line-height: 1.6;">
              <strong>${orderDetails.customerName}</strong><br>
              ${orderDetails.shippingAddress.line1}<br>
              ${orderDetails.shippingAddress.line2 ? `${orderDetails.shippingAddress.line2}<br>` : ''}
              ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.postal_code}<br>
              <strong>${orderDetails.shippingAddress.country}</strong>
            </div>
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin-top: 15px;">
              <p style="margin: 0; color: #92400e; font-weight: bold;">📦 ACTION: Print this address for shipping label!</p>
            </div>
          </div>
          ` : ''}

          <!-- Items Ordered -->
          <div style="background: white; padding: 25px; margin-bottom: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin-top: 0; font-size: 22px;">Items to Fulfill</h2>
            <div style="border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
              <div style="background: #f3f4f6; padding: 10px; font-weight: bold; display: flex; justify-content: space-between;">
                <span>Item</span>
                <span>Quantity</span>
                <span>Price</span>
                <span>Total</span>
              </div>
              ${orderDetails.items.map(item => `
                <div style="padding: 15px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                  <div style="flex: 2;">
                    <strong style="color: #1f2937; font-size: 16px;">${item.name}</strong>
                  </div>
                  <div style="flex: 1; text-align: center; font-size: 16px; font-weight: bold; color: #dc2626;">${item.quantity}</div>
                  <div style="flex: 1; text-align: center;">€${item.price.toFixed(2)}</div>
                  <div style="flex: 1; text-align: right; font-weight: bold;">€${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              `).join('')}
              <div style="background: #dc2626; color: white; padding: 15px; font-size: 18px; font-weight: bold; text-align: right;">
                TOTAL: €${orderDetails.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>

          <!-- Design Details -->
          ${orderDetails.designDetails ? `
          <div style="background: white; padding: 25px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #7c3aed;">
            <h2 style="color: #7c3aed; margin-top: 0; font-size: 22px;">🎨 Custom Design Details</h2>
            <div style="background: #faf5ff; padding: 20px; border-radius: 6px;">
              <p style="margin: 5px 0; font-size: 16px;"><strong>Design Type:</strong> ${orderDetails.designDetails.isCustomDesign ? 'Custom Design Tool' : 'Uploaded Files'}</p>
              ${orderDetails.designDetails.designPosition ? `<p style="margin: 5px 0; font-size: 16px;"><strong>Position:</strong> X: ${Math.round(orderDetails.designDetails.designPosition.x)}%, Y: ${Math.round(orderDetails.designDetails.designPosition.y)}%</p>` : ''}
              ${orderDetails.designDetails.designSize ? `<p style="margin: 5px 0; font-size: 16px;"><strong>Size:</strong> ${Math.round((orderDetails.designDetails.designSize / 24) * 100)}% of standard</p>` : ''}
              ${orderDetails.designDetails.actualQuantity ? `<p style="margin: 5px 0; font-size: 16px;"><strong>Actual Quantity:</strong> ${orderDetails.designDetails.actualQuantity} items</p>` : ''}
              ${orderDetails.designDetails.productVariants ? `
                <p style="margin: 5px 0; font-size: 16px;"><strong>Product Options:</strong></p>
                <ul style="margin: 5px 0; padding-left: 20px;">
                  ${Object.entries(orderDetails.designDetails.productVariants).map(([key, value]) => `<li>${key}: ${value}</li>`).join('')}
                </ul>
              ` : ''}
              ${orderDetails.designDetails.designFiles && orderDetails.designDetails.designFiles.length > 0 ? `
                <p style="margin: 15px 0 10px 0; font-size: 16px;"><strong>Design Files (${orderDetails.designDetails.designFiles.length}):</strong></p>
                <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
                  ${orderDetails.designDetails.designFiles.map((file, index) => `
                    <div style="padding: 10px; margin: 5px 0; background: #f8f9fa; border-radius: 4px; border-left: 3px solid #7c3aed;">
                      <p style="margin: 0; font-weight: bold; color: #7c3aed;">📎 ${file.name || `Design File ${index + 1}`}</p>
                      ${file.url ? `<p style="margin: 5px 0 0 0; font-size: 14px;"><a href="${file.url}" style="color: #7c3aed;">📥 View/Download File</a></p>` : ''}
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin-top: 15px;">
              <p style="margin: 0; color: #92400e; font-weight: bold;">🎯 PRODUCTION NOTE: Use the position and size details above to place the design correctly on the product!</p>
            </div>
          </div>
          ` : ''}

          <!-- Action Items -->
          <div style="background: #dc2626; color: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: white; margin-top: 0; font-size: 22px;">Action Items</h2>
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 6px;">
              <div style="display: grid; gap: 10px;">
                <label style="display: flex; align-items: center; font-size: 16px;">
                  <input type="checkbox" style="margin-right: 10px; transform: scale(1.2);"> Process payment confirmation
                </label>
                <label style="display: flex; align-items: center; font-size: 16px;">
                  <input type="checkbox" style="margin-right: 10px; transform: scale(1.2);"> Prepare items for shipment
                </label>
                <label style="display: flex; align-items: center; font-size: 16px;">
                  <input type="checkbox" style="margin-right: 10px; transform: scale(1.2);"> Print shipping label with above address
                </label>
                <label style="display: flex; align-items: center; font-size: 16px;">
                  <input type="checkbox" style="margin-right: 10px; transform: scale(1.2);"> Send tracking information to customer
                </label>
                <label style="display: flex; align-items: center; font-size: 16px;">
                  <input type="checkbox" style="margin-right: 10px; transform: scale(1.2);"> Update order status in system
                </label>
              </div>
            </div>
          </div>

          <!-- Contact Info -->
          <div style="text-align: center; color: #666; font-size: 14px; padding: 20px;">
            <p style="margin: 5px 0;">📧 Customer Email: <a href="mailto:${orderDetails.customerEmail}" style="color: #dc2626;">${orderDetails.customerEmail}</a></p>
            <p style="margin: 5px 0;">💳 View in Stripe: <a href="https://dashboard.stripe.com/payments/${orderDetails.orderId}" style="color: #dc2626;">Payment Details</a></p>
            <p style="margin: 15px 0 5px 0; font-weight: bold; color: #dc2626;">This order needs immediate attention!</p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Failed to send admin email:', error);
      return { success: false, error };
    }

    console.log('✅ Admin notification email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending admin email:', error);
    return { success: false, error };
  }
};

// Send both customer and admin emails
export const sendOrderConfirmationEmails = async (orderDetails: OrderDetails) => {
  console.log('📧 Sending order confirmation emails...');
  
  const customerResult = await sendCustomerOrderConfirmation(orderDetails);
  const adminResult = await sendAdminOrderNotification(orderDetails);
  
  return {
    customer: customerResult,
    admin: adminResult,
    success: customerResult.success && adminResult.success
  };
};

// Newsletter signup functions
export const sendNewsletterWelcomeEmail = async (userEmail: string, userName?: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Silverback Treatment <noreply@silverbacktreatment.se>',
      to: [userEmail],
      subject: '🎉 Welcome to the Silverback Family - Newsletter Subscription Confirmed!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 30px 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <div style="background: white; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 32px; color: #1a1a2e; font-weight: bold;">
              ST
            </div>
            <h1 style="margin: 0; font-size: 28px;">🎉 Welcome to the Family!</h1>
            <p style="margin: 15px 0 0 0; opacity: 0.9; font-size: 18px;">You're now part of the Silverback community</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border: 1px solid #e9ecef;">
            <p style="font-size: 18px; color: #333; margin-bottom: 20px;">Hi ${userName ? userName : 'there'},</p>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">Thank you for subscribing to our newsletter! You've just joined thousands of streetwear enthusiasts who stay updated with our latest drops, exclusive offers, and style inspiration.</p>
            
            <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
              <h3 style="margin-top: 0; color: #333; font-size: 20px;">🚀 Here's what you'll get:</h3>
              <ul style="color: #555; line-height: 1.8; padding-left: 20px;">
                <li><strong>Exclusive Previews:</strong> Be the first to see new collections</li>
                <li><strong>Member-Only Discounts:</strong> Special pricing just for subscribers</li>
                <li><strong>Alpha Print Updates:</strong> Custom printing tips and new services</li>
                <li><strong>Style Inspiration:</strong> Trending looks and outfit ideas</li>
                <li><strong>Behind the Scenes:</strong> Design process and brand stories</li>
              </ul>
            </div>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <h3 style="color: white; margin-top: 0; font-size: 18px;">🎁 Welcome Gift</h3>
              <p style="color: white; margin: 10px 0; opacity: 0.9;">Use code <strong>NEWSLETTER15</strong> for 15% off your next order</p>
              <p style="color: white; margin: 0; font-size: 14px; opacity: 0.8;">*Valid for 30 days on orders over €30</p>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">We're excited to have you on this journey with us. Our newsletter goes out weekly with the freshest updates, so keep an eye on your inbox!</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://silverback-shop-connect-4x2qxbqof-senior-sanches-projects.vercel.app" style="background: #667eea; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; display: inline-block;">Shop Now</a>
              <a href="https://silverback-shop-connect-4x2qxbqof-senior-sanches-projects.vercel.app/alphaprint" style="background: #764ba2; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; display: inline-block; margin-left: 10px;">Custom Printing</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #343a40; color: white; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
            <div style="margin-bottom: 15px;">
              <strong>Silverback Treatment</strong><br>
              <span style="font-size: 14px; opacity: 0.8;">Premium Streetwear & Custom Printing</span>
            </div>
            <div style="font-size: 14px; opacity: 0.7;">
              <p style="margin: 5px 0;">📧 silverbacktreatment@gmail.com</p>
              <p style="margin: 5px 0;">📞 +34 600 013 960</p>
              <p style="margin: 15px 0 5px 0; font-size: 12px;">You're receiving this because you subscribed to our newsletter.</p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Newsletter welcome email failed:', error);
      return { success: false, error };
    }

    console.log('Newsletter welcome email sent successfully to:', userEmail);
    return { success: true, data };

  } catch (error) {
    console.error('Newsletter welcome email service error:', error);
    return { success: false, error };
  }
};

// Send newsletter signup notification to admin
export const sendNewsletterSignupNotification = async (userEmail: string, userName?: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Newsletter System <noreply@silverbacktreatment.se>',
      to: ['silverbacktreatment@gmail.com'],
      subject: `📬 New Newsletter Subscriber: ${userEmail}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">📬 New Newsletter Subscriber</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Someone just joined our mailing list!</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef;">
            <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
              <p><strong>Email:</strong> ${userEmail}</p>
              ${userName ? `<p><strong>Name:</strong> ${userName}</p>` : ''}
              <p><strong>Subscribed:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #059669;">
              <h3 style="margin-top: 0; color: #333;">📊 Quick Actions:</h3>
              <ul style="color: #555;">
                <li>Add to email marketing campaigns</li>
                <li>Send welcome sequence if automated</li>
                <li>Update subscriber count in analytics</li>
                <li>Consider for exclusive member offers</li>
              </ul>
            </div>
          </div>

          <div style="background: #343a40; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="margin: 0; font-size: 14px;">
              Silverback Treatment Newsletter System<br>
              Growing our community one subscriber at a time
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Newsletter signup notification failed:', error);
      return { success: false, error };
    }

    return { success: true, data };

  } catch (error) {
    console.error('Newsletter notification service error:', error);
    return { success: false, error };
  }
};
