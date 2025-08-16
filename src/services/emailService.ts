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
}

export const sendQuoteNotificationEmail = async (quoteData: QuoteRequestData) => {
  try {
    // Email to yourself (business owner)
    const { data, error } = await resend.emails.send({
      from: 'AlphaPrint <quotes@silverbacktreatment.se>',
      to: ['info@silverbacktreatment.se'], // Your email
      subject: `🎨 New AlphaPrint Quote Request from ${quoteData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">🎨 New AlphaPrint Quote Request</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">A new custom printing quote request has been submitted</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef;">
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
              <a href="mailto:info@silverbacktreatment.se" style="color: #adb5bd;">info@silverbacktreatment.se</a>
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
      from: 'AlphaPrint <quotes@silverbacktreatment.se>',
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
              <p style="margin: 5px 0;"><strong>📧 Email:</strong> <a href="mailto:info@silverbacktreatment.se">info@silverbacktreatment.se</a></p>
              <p style="margin: 5px 0;"><strong>📞 Phone:</strong> <a href="tel:+46123456789">+46 (0) 123 456 789</a></p>
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
      from: 'Shaze Sanches <ceo@silverbacktreatment.se>',
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
              <p style="margin: 5px 0;">📧 info@silverbacktreatment.se</p>
              <p style="margin: 5px 0;">📞 +46 (0) 123 456 789</p>
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
