import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/user.model.js';
import Subscription from '../models/subscription.model.js';
import mailSender from '../utils/mailSender.js';
import purchaseSuccessTemplate from '../templates/purchaseSuccessTemplate.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createOrder = async (amount, currency = 'INR') => {
  const options = {
    amount: amount * 100, 
    currency,
    receipt: 'receipt_' + Math.random().toString(36).substring(7),
  };

  try {
    const order = await razorpay.orders.create(options);
    return order; 
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

export const verifyPayment = async (razorpayOrderId, razorpayPaymentId, razorpaySignature, userId, plan, duration) => {
  try {
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpaySignature) {
      const user = await User.findById(userId);
     

      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + (duration === 'yearly' ? 12 : 1));

      user.subscription = 'Pro';
      user.subscriptionEndDate = endDate;
      await user.save();

      const subscription = new Subscription({
        user: userId,
        plan: plan,
        duration: duration,
        startDate: startDate,
        endDate: endDate,
        paymentId: razorpayPaymentId
      });
      await subscription.save();

      console.log(`Logging user before the email seonding`,user);
      try {
        await mailSender(user.email, "Subscription Purchase Successful",purchaseSuccessTemplate(user.name, plan, duration));
        console.log("Email sent successfully");
      } catch (emailError) {
        console.error("Error sending email:", emailError);
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return false;
  }
};
