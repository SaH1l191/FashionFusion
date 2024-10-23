import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import PricingCard from "./PricingCard";
import { axiosInstance } from '../lib/axios'; 
import { useNavigate } from 'react-router-dom';

export const pricingPlans = [
  {
    title: "Pro",
    type:"(monthly)",
    duration: "monthly",
    price: 999,
    description: "For growing teams",
    isPopular: true,
    features: [
      "Unlimited projects",
      "Unlimited users",
      "5GB storage",
      "Priority support",
    ],
  },
  {
    title: "Pro",
    duration: "yearly",
    type:"(yearly)",
    price: 9999,
    description: "Upgrade to save more! ",
    isPopular: false,
    features: [
      "Unlimited projects",
      "Unlimited users",
      "50GB storage",
      "24/7 support",
    ],
  },
];

const PricingSection = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
  
  console.log("Razorpay Key ID:", razorpayKeyId);
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      toast.error('Failed to load payment system. Please try again later.');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const { data: authUser } = useQuery({queryKey: ['authUser']});

  const createSubscriptionMutation = useMutation({
    mutationFn: async (planDetails) => {
      try {
        const response = await axiosInstance.post('/subscriptions/create', planDetails);
        return response.data;
      } catch (error) {
        console.error('Error creating subscription:', error);
        throw new Error(error.response?.data?.message || 'Failed to create subscription');
      }
    },
    onSuccess: (data) => {
      console.log('Response from create subscription:', data);
      if (!razorpayLoaded) {
        toast.error("Razorpay is not loaded yet. Please try again.");
        return;
      }

      const options = {
        key: razorpayKeyId,
        amount: data.amount,
        currency: "INR",
        name: "Fashion Fusion",
        description: `${selectedPlan.title} ${selectedPlan.duration} Subscription`,
        order_id: data.order.id,
        handler: function (response) {
          verifyPaymentMutation.mutate({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            plan: selectedPlan.title,
            duration: selectedPlan.duration,
            userId: authUser._id,
          });
        },
        prefill: {
          name: authUser?.name || "User's Name",
          email: authUser?.email || "user@example.com",
        },
        theme: {
          color: "#3399cc",
        },
      };
      console.log(options)
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    },
    onError: (error) => {
      toast.error("Error creating subscription: " + error.message);
    },
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: (paymentDetails) => axiosInstance.post('/subscriptions/verify', paymentDetails),
    onSuccess: () => {
      toast.success("Subscription activated successfully!");
      queryClient.invalidateQueries({queryKey: ['authUser']})
    },
    onError: (error) => {
      toast.error("Error verifying payment: " + error.message);
    },
  });

  const handleSubscribe = (plan) => {
    if (!authUser) {
      toast.error("Please log in to subscribe");
      navigate("/login")
      return;
    }
    if (authUser.subscription === 'Pro') {
      toast.error("You are already a Pro user. No need to subscribe again.");
      return;
    }
    setSelectedPlan(plan);
    createSubscriptionMutation.mutate({
      plan: plan.title,
      duration: plan.duration,
      userId: authUser._id,
    });
  };

  return (
    <div className="mt-10 text-center" data-aos="fade-right">
      <h1 className="text-6xl font-extrabold capitalize">Pricing</h1>
      <h2 className="pt-3 mb-8 text-3xl font-semibold">
        Flexible Pricing to Fit Your Needs
      </h2>
      {authUser && (
        <p className="mb-4">Current Plan: {authUser.subscription}</p>
      )}
      <div className="grid items-center max-w-screen-xl grid-cols-1 gap-3 mx-auto mt-10 md:grid-cols-2">
        {pricingPlans.map((plan, index) => (
          <PricingCard 
            key={index} 
            {...plan} 
            onSubscribe={() => handleSubscribe(plan)}
            disabled={authUser?.subscription === 'Pro'}
          />
        ))}
      </div>
    </div>
  );
};

export default PricingSection;